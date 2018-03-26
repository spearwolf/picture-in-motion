import { readOption } from '@picimo/core'; // eslint-disable-line

const CHILDREN_COMPONENT = 'children';

export default class ChildrenComponent {
  static componentName() {
    return CHILDREN_COMPONENT;
  }

  constructor(entity, options) {
    this.entity = entity;
    this.parent = readOption(options, 'parent');
    this.children = [];
  }

  setParent(parent) {
    const prevParent = this.parent;
    this.parent = parent;
    if (prevParent && prevParent.hasComponent(CHILDREN_COMPONENT)) {
      prevParent.children.removeChild(this.entity);
    }
    if (parent && parent.hasComponent(CHILDREN_COMPONENT)) {
      if (!parent.children.hasChild(this.entity)) {
        parent.children.children.push(this.entity);
      }
    }
  }

  hasChild(child) {
    return this.children.indexOf(child) >= 0;
  }

  removeChild(child) {
    const idx = this.children.indexOf(child);
    if (idx >= 0) {
      this.children.splice(idx, 1);
    }
    if (child.hasComponent(CHILDREN_COMPONENT)) {
      child.children.setParent(null);
    }
  }
}
