/* eslint no-param-reassign: 0 */
import RenderCtl, { RENDERCTL } from './RenderCtl';

const createChildContext = (renderable, context) => {
  let { childContext } = renderable;
  if (!childContext) {
    childContext = {};
    renderable.childContext = childContext;
  }

  if (context) {
    const { [RENDERCTL]: parent } = context;
    if (parent) {
      childContext[RENDERCTL] = {
        parent,
        renderable,
        children: new Set(),
      };
      RenderCtl.appendChild(parent, renderable);
    }
  }

  return childContext;
};

const hasRenderCtl = component => component.childContext && component.childContext[RENDERCTL];

const withRenderCtl = ({ childContext }, callback) => {
  if (childContext) {
    const renderCtl = childContext[RENDERCTL];
    if (renderCtl) {
      callback(renderCtl);
    }
  }
};

export default (WrappedComponent) => {
  class Renderable extends WrappedComponent {
    constructor(props, context) {
      super(props, context);
      this.childContext = createChildContext(this, context);
    }

    componentWillReceiveProps(nextProps, nextContext) {
      if (!hasRenderCtl(this)) {
        this.childContext = createChildContext(this, nextContext);
      }
      if (super.componentWillReceiveProps) {
        super.componentWillReceiveProps(nextProps, nextContext);
      }
    }

    componentDidMount() {
      if (!hasRenderCtl(this)) {
        this.childContext = createChildContext(this, this.context);
      }

      if (super.componentDidMount) {
        super.componentDidMount();
      }
    }

    componentWillUnmount() {
      if (super.componentWillUnmount) {
        super.componentWillUnmount();
      }

      withRenderCtl(this, renderCtl => RenderCtl.removeChild(renderCtl, this));
    }

    getChildContext() {
      return this.childContext; // TODO WrappedComponent context?
    }
  }

  const WrappedComponentName = WrappedComponent.displayName
    || WrappedComponent.name
    || 'Component';

  Renderable.displayName = `Renderable(${WrappedComponentName})`;

  Renderable.contextTypes = Object.assign({
    [RENDERCTL]: RenderCtl.Shape,
  }, WrappedComponent.contextTypes);

  Renderable.childContextTypes = Object.assign({
    [RENDERCTL]: RenderCtl.Shape,
  }, WrappedComponent.childContextTypes);

  return Renderable;
};
