/* eslint-env browser */
/* eslint-env mocha */
/* eslint no-console: 0 */
import { assert } from 'chai';
import sinon from 'sinon';

import ECS from '../ECS';
import ComponentFactory from '../ComponentFactory';

import {
  ChildrenComponent,
  RenderableComponent,
} from '.';

describe('RenderableComponent', () => {
  const ecs = new ECS();

  before(() => {
    ComponentFactory.registerComponent(ecs, ChildrenComponent, RenderableComponent);
  });

  it('createEntity()', () => {
    const entity = ecs.createEntity([RenderableComponent]);
    assert.exists(entity);
  });

  it('renderFrame()', () => {
    const entity = ecs.createEntity([RenderableComponent]);
    const renderFrameSpy = sinon.spy();
    const postRenderFrameSpy = sinon.spy();

    entity.on('renderFrame', renderFrameSpy);
    entity.on('postRenderFrame', postRenderFrameSpy);

    const re = {};
    entity.renderable.renderFrame(re);

    assert.isTrue(renderFrameSpy.called, 'renderFrame event should be called');
    assert.isTrue(renderFrameSpy.calledWith(re));
    assert.isTrue(postRenderFrameSpy.called, 'postRenderFrame event should be called');
    assert.isTrue(postRenderFrameSpy.calledWith(re));
  });

  it('renderFrame() with children', () => {
    const root = ecs.createEntity([RenderableComponent, ChildrenComponent]);
    const a = ecs.createEntity([RenderableComponent, ChildrenComponent]);
    const b = ecs.createEntity([ChildrenComponent]);

    const aSpy = sinon.spy();
    const bSpy = sinon.spy();

    a.on('renderFrame', aSpy);
    b.on('postRenderFrame', bSpy);

    a.children.setParent(root);
    b.children.setParent(root);

    const re = {};
    root.renderable.renderFrame(re);

    assert.isTrue(aSpy.called, 'renderFrame should be called on children with the renderable component');
    assert.isTrue(aSpy.calledWith(re));
    assert.isFalse(bSpy.called, 'renderFrame should not be called on a child without the renderable component');
  });
});
