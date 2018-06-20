import { readOption } from '@picimo/utils'; // eslint-disable-line

import ChildrenComponent from './ChildrenComponent';

export const RENDER_FRAME = 'renderFrame';
export const POST_RENDER_FRAME = 'postRenderFrame';

const RENDERABLE = 'renderable';

export default class RenderableComponent {
  static componentName() {
    return RENDERABLE;
  }

  constructor(entity) {
    this.entity = entity;
  }

  renderFrame(renderer) {
    const { entity } = this;
    entity.emit(RENDER_FRAME, renderer);
    if (entity.hasComponent(ChildrenComponent)) {
      entity.children.forEach(
        ({ renderable }) => renderable.renderFrame(renderer),
        RenderableComponent,
      );
    }
    entity.emit(POST_RENDER_FRAME, renderer);
  }
}
