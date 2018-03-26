
/** @private */
const getComponentName = name => (name && typeof name.componentName === 'function' && name.componentName()) || name;

export default class ComponentRegistry {
  constructor() {
    this.factories = new Map();
  }

  /**
   * @param {string} name - component name
   * @param {object} componentFactory - the component factory interface
   * @param {function} componentFactory.create - create a new component object
   * @param {function} componentFactory.update - update a component
   * @param {function} [componentFactory.destroy] - destroy a component
   */
  registerComponent(name, componentFactory) {
    this.factories.set(name, componentFactory);
  }

  getComponentFactory(name) {
    const componentName = getComponentName(name);
    const factory = this.factories.get(componentName);
    if (!factory) {
      throw new Error(`ComponentRegistry: unknown factory '${componentName}'`);
    }
    return factory;
  }

  /**
   * Create a new component and attach it to the entity.
   */
  createComponent(entity, name, data) {
    const componentName = getComponentName(name);
    const factory = this.getComponentFactory(componentName);
    const component = factory.create(entity, data);
    entity.setComponent(componentName, component);
  }

  updateComponent(entity, name, data) {
    const componentName = getComponentName(name);
    const factory = this.getComponentFactory(componentName);
    const component = entity[componentName];
    factory.update(component, data);
  }

  createOrUpdateComponent(entity, name, data) {
    const componentName = getComponentName(name);
    this[entity.hasComponent(componentName) ? 'updateComponent' : 'createComponent'](entity, componentName, data);
  }

  destroyComponent(name, component) {
    const factory = this.factories.get(getComponentName(name));
    if (factory && factory.destroy) {
      factory.destroy(component);
    }
  }
}
