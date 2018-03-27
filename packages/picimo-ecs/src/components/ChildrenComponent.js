import { readOption } from '@picimo/core'; // eslint-disable-line

const CHILDREN = 'children';

export default class ChildrenComponent {
  static componentName() {
    return CHILDREN;
  }

  constructor(entity, options) {
    this.entity = entity;
    this.parent = readOption(options, 'parent');
    this.children = [];
  }

  forEach(callback, hasComponents) {
    if (hasComponents) {
      this.children.forEach((child) => {
        if (child.hasComponent(hasComponents)) {
          callback(child);
        }
      });
    } else {
      this.children.forEach(callback);
    }
  }

  setParent(parent) {
    const prevParent = this.parent;
    this.parent = parent;
    if (prevParent && prevParent.hasComponent(CHILDREN)) {
      prevParent.children.removeChild(this.entity);
    }
    if (parent && parent.hasComponent(CHILDREN)) {
      if (!parent.children.hasChild(this.entity)) {
        parent.children.children.push(this.entity);
      }
    }
  }

  hasChild(child) {
    return this.children.indexOf(child) >= 0;
  }

  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx >= 0) {
      this.children.splice(idx, 1);
    }
    if (child.hasComponent(CHILDREN)) {
      child.children.setParent(null);
    }
  }
}
