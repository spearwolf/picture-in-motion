/* eslint-env browser */
/* eslint-env mocha */
/* eslint no-console: 0 */
import { assert } from 'chai';

import ECS from './ECS';

describe('ECS', () => {
  it('new ECS()', () => {
    const ecs = new ECS();
    assert.exists(ecs);
  });

  it('createEntity()', () => {
    const ecs = new ECS();
    const entity = ecs.createEntity();
    assert.exists(entity);
    assert.exists(entity.id, 'entity should have id property');
  });

  it('getEntity()', () => {
    const ecs = new ECS();
    const entity = ecs.createEntity();
    assert.strictEqual(ecs.getEntity(entity.id), entity);
  });

  it('destroyEntity()', () => {
    const ecs = new ECS();
    const entity = ecs.createEntity();
    assert.strictEqual(ecs.getEntity(entity.id), entity);
    ecs.destroyEntity(entity.id);
    assert.isTrue(entity.destroyed);
    assert.notExists(ecs.getEntity(entity.id));
  });
});
