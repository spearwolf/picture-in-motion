import TextureAtlas from './TextureAtlas';

export default class TextureHandle {
  constructor(textureOrAtlas) {
    this.texture = null;
    this.atlas = null;

    this.onReady = Promise.resolve(textureOrAtlas).then(async (toa) => {
      if (toa instanceof TextureAtlas) {
        this.atlas = toa;
        this.texture = toa.rootTexture;
      } else {
        this.texture = toa;
      }
      return toa;
    });
  }
}
