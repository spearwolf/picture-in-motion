/* eslint-env browser */
/* eslint-env mocha */
/* eslint no-console: 0 */
import { assert } from 'chai';

import ECS from '../ECS';
import ComponentFactory from '../ComponentFactory';
import ChildrenComponent from './ChildrenComponent';

describe('ChildrenComponent', () => {
  const ecs = new ECS();
  let entity;
  let entity2;

  it('ECS#registerComponent()', () => {
    const factory = new ComponentFactory(ChildrenComponent);
    ecs.registerComponent(ChildrenComponent.componentName(), factory);
    assert.strictEqual(ecs.getComponentFactory(ChildrenComponent), factory);
  });

  it('ECS#createEntity()', () => {
    entity = ecs.createEntity();
    assert.exists(entity);
  });

  it('ECS#createComponent()', () => {
    ecs.createComponent(entity, ChildrenComponent);
    assert.instanceOf(entity.children, ChildrenComponent, 'entity.children should be an instance of ChildrenComponent');
  });

  it('setParent()', () => {
    entity2 = ecs.createEntity([ChildrenComponent]);
    entity.children.setParent(entity2);
    assert.strictEqual(entity.children.parent, entity2);
  });

  it('hasChild()', () => {
    assert.isTrue(entity2.children.hasChild(entity));
  });

  it('entity.hasComponent()', () => {
    assert.isTrue(entity.hasComponent(ChildrenComponent));
    assert.isTrue(entity2.hasComponent([ChildrenComponent]));
    assert.isTrue(entity.hasComponent('children'));
    assert.isTrue(entity2.hasComponent(['children']));
  });

  it('removeChild()', () => {
    entity2.children.removeChild(entity);
    assert.isFalse(entity2.children.hasChild(entity));
  });
});
