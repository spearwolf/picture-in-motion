/* eslint-env browser */
/* eslint no-param-reassign: 0 */
import {
  isPowerOf2,
  findNextPowerOf2,
} from '@picimo/utils'; // eslint-disable-line

/** @private */
function convertToPowerOf2(image) {
  const w = findNextPowerOf2(image.width);
  const h = findNextPowerOf2(image.height);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d').drawImage(image, 0, 0);

  return canvas;
}

/** @private */
function setPowerOf2ImgEl(p2img, imgEl) {
  p2img.imgEl = isPowerOf2(imgEl.width) && isPowerOf2(imgEl.height) ? imgEl : convertToPowerOf2(imgEl);
  p2img.origWidth = imgEl.width;
  p2img.origHeight = imgEl.height;
}

/**
 * Represents a `<img>` or `<canvas>` element which sizes (width and height) are
 * always power of 2.
 */
export default class PowerOf2Image {
  /**
   * If image dimension is NOT power of 2 then create a new `<canvas>`
   * (with power of 2 dimension) and copy the original image content onto it.
   * Since fetching imge data from server is a *async* operation the `imgEl` property
   * can be `null` right after object construction and will be set later after
   * image is loaded (and possible converted).
   *
   * @param {string|HTMLImageElement|HTMLCanvasElement} from - url or html *image* element
   */
  constructor(from) {
    let imgEl;
    if (typeof from === 'string') {
      imgEl = new window.Image();
      imgEl.src = from;
    } else {
      imgEl = from;
    }
    if (imgEl.onLoaded === false || (imgEl.width === 0 && imgEl.height === 0)) {
      /**
       * @type {HTMLImageElement|HTMLCanvasElement}
       */
      this.imgEl = null;
      /**
       * @type {Promise<PowerOf2Image>}
       */
      this.onLoaded = new Promise((resolve) => {
        const origOnLoad = imgEl.onload;
        imgEl.onload = () => {
          if (origOnLoad) origOnLoad.call(imgEl);
          setPowerOf2ImgEl(this, imgEl);
          resolve(this);
        };
      });
    } else {
      setPowerOf2ImgEl(this, imgEl);
      /**
       * @type {Promise<PowerOf2Image>}
       */
      this.onLoaded = Promise.resolve(this);
    }
  }

  /**
   * A boolean that is `true` if the image has loaded and possible converted.
   * @type {boolean}
   */
  get isComplete() {
    return this.imgEl != null;
  }

  /**
   * Returns image width or `0` if image loading is not finished.
   * @type {number}
   */
  get width() {
    return (this.imgEl && this.imgEl.width) || 0;
  }

  /**
   * Returns image height or `0` if image loading is not finished.
   * @type {number}
   */
  get height() {
    return (this.imgEl && this.imgEl.height) || 0;
  }
}

