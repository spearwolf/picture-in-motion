/* eslint-env browser */

/**
 * @private
 */
export default (domElement) => {
  if (domElement.tagName === 'CANVAS') {
    return domElement;
  }

  const canvas = document.createElement('canvas');
  domElement.appendChild(canvas);
  return canvas;
};
