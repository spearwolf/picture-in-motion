import PropTypes from 'prop-types';

export default (WrappedComponent) => {
  class Renderable extends WrappedComponent {
    render() {
      const { renderCtl } = this.context;
      if (renderCtl) {
        const { renderFrame } = this;
        if (renderFrame) {
          renderCtl.onNextFrame(renderFrame.bind(this));
        }
      }
      const out = super.render();
      if (renderCtl) {
        const { renderFrameEnd } = this;
        if (renderFrameEnd) {
          renderCtl.onNextFrameEnd(renderFrameEnd.bind(this));
        }
      }
      return out;
    }
  }

  const WrappedComponentName = WrappedComponent.displayName
    || WrappedComponent.name
    || 'Component';

  Renderable.displayName = `Renderable(${WrappedComponentName})`;

  Renderable.contextTypes = Object.assign({
    renderCtl: PropTypes.object,
  }, WrappedComponent.contextTypes);

  return Renderable;
};
