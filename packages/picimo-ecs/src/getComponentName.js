
export default (component) => {
  switch (typeof component) {
    case 'string':
      return component;
    case 'function': {
      switch (typeof component.componentName) {
        case 'function':
          return component.componentName();
        case 'string':
          return component.componentName;
        default:
          return undefined;
      }
    }
    default:
      return undefined;
  }
};
