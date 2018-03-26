import Entity from './Entity';
import ComponentRegistry from './ComponentRegistry';

export default class ECS extends ComponentRegistry {
  constructor() {
    super();
    this.entities = new Map();
  }

  /**
   * @param {Array} [components] - *Optional* components to attach to the entity
   * @param {string} [id] - The *optional* entity id
   * @returns {Entity}
   */
  createEntity(components, id) {
    const e = new Entity(this, id);
    if (this.entities.has(e.id)) {
      throw new Error(`ECS: duplicate entity.id='${e.id}' are not allowed`);
    }
    this.entities.set(e.id, e);
    if (Array.isArray(components)) {
      components.forEach((c) => {
        if (Array.isArray(c)) {
          this.createComponent(e, ...c);
        } else {
          this.createComponent(e, c);
        }
      });
    }
    return e;
  }

  getEntity(id) {
    return this.entities.get(id);
  }

  destroyEntity(id) {
    const e = this.entities.get(id);
    if (e) {
      this.entities.delete(id);
      if (!e.destroyed) {
        e.destroy();
      }
    }
  }

  destroyAllEntities() {
    this.entities.forEach(e => e.destroy());
  }
}
