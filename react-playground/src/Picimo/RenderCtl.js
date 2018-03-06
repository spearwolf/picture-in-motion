import PropTypes from 'prop-types';

export const RENDERCTL = 'renderCtl';

const Shape = PropTypes.shape({
  renderer: PropTypes.object,
  parent: PropTypes.object,
  renderable: PropTypes.object,
  children: PropTypes.object,
});

const appendChild = (renderCtl, child) => {
  renderCtl.children.add(child);
};

const removeChild = (renderCtl, child) => {
  renderCtl.children.delete(child);
};

const renderFrame = ({ renderable }, renderer, renderChildren) => renderable && renderable.renderFrame && renderable.renderFrame(renderer, renderChildren);
const renderFrameAfter = ({ renderable }, renderer) => renderable && renderable.renderFrameAfter && renderable.renderFrameAfter(renderer);

export default {
  Shape,
  appendChild,
  removeChild,
  renderFrame,
  renderFrameAfter,
};
