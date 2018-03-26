import { generateUuid } from '@picimo/core'; // eslint-disable-line
import eventize from '@spearwolf/eventize';
import getComponentName from './getComponentName';

const hasComponent = entity => name => entity.components.has(getComponentName(name));

export default class Entity {
  constructor(ecs, id = generateUuid()) {
    this.id = id;
    Object.defineProperties(this, {
      ecs: {
        value: ecs,
      },
      components: {
        value: new Set(),
      },
    });
    eventize(this);
  }

  destroy() {
    if (!this.destroyed) {
      this.destroyed = true;
      this.components.forEach(this.deleteComponent.bind(this));
      this.ecs.destroyEntity(this.id);
    }
  }

  setComponent(name, component) {
    if (!this.components.has(name)) {
      this.components.add(name);
      this[name] = component;
      if (component.connectedEntity) {
        component.connectedEntity(this);
      }
      this.emit(`componentConnected:${name}`, component, this);
    } else if (this[name] !== component) {
      throw new Error(`Entity.setComponent(): component already exists; name='${name}'`);
    }
  }

  hasComponent(name) {
    return Array.isArray(name) ? name.every(hasComponent(this)) : hasComponent(this)(name);
  }

  deleteComponent(name) {
    if (this.components.has(name)) {
      const component = this[name];
      this.ecs.destroyComponent(name, component);
      this.components.delete(name);
      this.emit(`destroyComponent:${name}`, component, this);
      if (component.disconnectedEntity) {
        component.disconnectedEntity(this);
      }
      delete this[component];
    }
  }
}
