/* eslint new-cap: 0 */
/* eslint class-methods-use-this: 0 */
/* eslint no-unused-vars: 0 */

/**
 * A very simple component factory.
 */
export default class ComponentFactory {
  static registerComponent(registry, ...components) {
    components.forEach((componentClass) => {
      registry.registerComponent(componentClass.componentName(), new ComponentFactory(componentClass));
    });
  }

  constructor(componentClass) {
    this.componentClass = componentClass;
  }

  create(entity, data) {
    return new this.componentClass(entity, data);
  }

  update(component, data) {
    if (component.update) {
      component.update(data);
    }
  }

  destroy(component) {
    if (component.destroy) {
      component.destroy();
    }
  }
}
