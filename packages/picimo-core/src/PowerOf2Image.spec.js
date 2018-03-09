/* eslint-env mocha */
/* eslint-env browser */
import assert from 'assert';

import { PowerOf2Image } from '.';

describe('PowerOf2Image', () => {
  describe('should load image from given url', () => {
    const p2img = new PowerOf2Image('/assets/nobinger.png');
    let promiseResult;
    before('after onLoaded', (done) => {
      p2img.onLoaded.then((img) => {
        promiseResult = img;
        done();
      });
    });

    it('onLoaded promise should return the PowerOf2Image instance', () => assert.equal(p2img, promiseResult));
    it('width', () => assert.equal(p2img.width, 128));
    it('height', () => assert.equal(p2img.height, 256));
    it('origWidth', () => assert.equal(p2img.origWidth, 128));
    it('origHeight', () => assert.equal(p2img.origHeight, 256));
    it('isComplete', () => assert.equal(p2img.isComplete, true));
    it('imgEl', () => assert(p2img.imgEl instanceof window.HTMLImageElement));
  });

  describe('should load image from HTMLImageElement', () => {
    const img = new window.Image();
    img.src = '/assets/nobinger.png';
    let origWidth;
    let origHeight;
    img.onload = () => {
      origWidth = img.width;
      origHeight = img.height;
    };
    const p2img = new PowerOf2Image(img);

    before('after onLoaded', () => p2img.onLoaded);

    it('should have been called previous onload image handler', () => assert.equal(typeof origWidth, 'number'));
    it('original width', () => assert.equal(origWidth, 128));
    it('original height', () => assert.equal(origHeight, 256));
    it('width', () => assert.equal(p2img.width, 128));
    it('height', () => assert.equal(p2img.height, 256));
    it('isComplete', () => assert.equal(p2img.isComplete, true));
    it('imgEl', () => assert(p2img.imgEl instanceof window.HTMLImageElement));
  });

  describe('should convert non-power-of-2 image', () => {
    const p2img = new PowerOf2Image('/assets/bird-chicken-penguin.png');

    before('after onLoaded', (done) => {
      p2img.onLoaded.then(() => done());
    });

    it('width', () => assert.equal(p2img.width, 1024));
    it('height', () => assert.equal(p2img.height, 512));
    it('origWidth', () => assert.equal(p2img.origWidth, 640));
    it('origHeight', () => assert.equal(p2img.origHeight, 480));
    it('imgEl', () => assert(p2img.imgEl instanceof window.HTMLCanvasElement));
  });
});

