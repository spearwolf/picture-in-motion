import TextureAtlas from './TextureAtlas';

export default class TextureHandle {
  constructor(textureOrAtlas) {
    this.texture = null;
    this.atlas = null;

    const saveAs = propName => async (value) => {
      this[propName] = await value;
      return value;
    };

    if (textureOrAtlas instanceof TextureAtlas) {
      this.onReady = saveAs('texture')(textureOrAtlas);
    } else {
      this.onReady = saveAs('atlas')(textureOrAtlas).then((atlas) => {
        this.texture = atlas.rootTexture;
      });
    }
  }
}
