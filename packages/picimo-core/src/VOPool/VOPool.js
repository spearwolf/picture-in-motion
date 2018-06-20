/* eslint no-param-reassign: 0 */
import { readOption } from '@picimo/utils'; // eslint-disable-line

import generateUuid from '../generateUuid';

import createVOs from './createVOs';

export default class VOPool {
  /**
   * @param {VODescriptor} descriptor - vertex object descriptor
   * @param {Object} [options] - Advanced options
   * @param {number} [options.capacity] - Maximum number of *vertex objects*
   * @param {VOArray} [options.voArray] - Vertex object array
   * @param {VertexObject} [options.voZero] - *vertex object* prototype
   * @param {VertexObject} [options.voNew] - *vertex object* prototype
   * @param {number} [options.maxAllocVOSize] - never allocate more than `maxAllocVOSize` *vertex objects* at once
   * @param {string} [options.usage='dynamic'] - buffer `usage` hint, choose between `dynamic` or `static`
   * @param {string} [options.doubleBuffer] - buffer `doubleBuffer` hint, set to `true` (which is the default if `usage` equals to `dynamic`) or `false`.
   * @param {string} [options.autotouch] - auto touch vertex buffers hint, set to `true` (which is the default if `usage` equals to `dynamic`) or `false`.
   */

  constructor(descriptor, options) {
    this.id = generateUuid();
    this.descriptor = descriptor;
    this.capacity = readOption(options, 'capacity', this.descriptor.maxIndexedVOPoolSize);
    this.maxAllocVOSize = readOption(options, 'maxAllocVOSize', 0);
    this.voZero = readOption(options, 'voZero', () => descriptor.createVO());
    this.voNew = readOption(options, 'voNew', () => descriptor.createVO());
    this.usage = readOption(options, 'usage', 'dynamic');
    this.voArray = readOption(options, 'voArray', () => descriptor.createVOArray(this.capacity, {
      usage: this.usage,
      autotouch: readOption(options, 'autotouch', this.usage === 'dynamic'),
      doubleBuffer: readOption(options, 'doubleBuffer', this.usage === 'dynamic'),
      // TODO tripleBuffer / read and write to different buffers for dynamic...
    }));

    this.availableVOs = [];
    this.usedVOs = [];

    createVOs(this, this.maxAllocVOSize);
  }

  /**
   * Number of in use *vertex objects*.
   * @type {number}
   */

  get usedCount() {
    return this.usedVOs.length;
  }

  /**
   * Number of free and unused *vertex objects*.
   * @type {number}
   */

  get availableCount() {
    return this.capacity - this.usedVOs.length;
  }

  /**
   * Number of **allocated** *vertex objects*.
   * @type {number}
   */

  get allocatedCount() {
    return this.availableVOs.length + this.usedVOs.length;
  }

  /**
   * Return **size** *vertex objects*
   * @return {VertexObject|VertexObject[]}
   */

  alloc(size = 1, push2arr) {
    if (size > 1) {
      const arr = push2arr || [];
      for (let i = 0; i < size; ++i) {
        const vo = this.alloc(1);
        if (vo !== undefined) {
          arr.push(vo);
        } else {
          break;
        }
      }
      return arr;
    }

    const vo = this.availableVOs.shift();

    if (vo === undefined) {
      if ((this.capacity - this.allocatedCount) > 0) {
        createVOs(this, this.maxAllocVOSize);
        return this.alloc();
      }
      return;
    }

    this.usedVOs.push(vo);

    vo.voArray.copy(this.voNew.voArray);

    return vo;
  }

  /**
   * @param {VertexObject|VertexObject[]} vo - vertex object(s)
   */

  free(vo) {
    if (Array.isArray(vo)) {
      vo.forEach(this.free.bind(this));
      return;
    }

    const idx = this.usedVOs.indexOf(vo);

    if (idx === -1) return;

    const lastIdx = this.usedVOs.length - 1;

    if (idx !== lastIdx) {
      const last = this.usedVOs[lastIdx];
      vo.voArray.copy(last.voArray);

      const tmp = last.voArray;
      last.voArray = vo.voArray;
      vo.voArray = tmp;

      this.usedVOs.splice(idx, 1, last);
    }

    this.usedVOs.pop();
    this.availableVOs.unshift(vo);

    vo.voArray.copy(this.voZero.voArray);
  }
}
