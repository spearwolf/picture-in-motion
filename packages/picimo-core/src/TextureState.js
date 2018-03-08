
export default class TextureState {
  constructor(texture, atlas) {
    this.texture = null;
    this.atlas = null;
    this.promise = Promise.resolve(texture).then((tex) => {
      this.texture = tex;
      return tex;
    });
    Promise.resolve(atlas).then((atlas_) => {
      this.atlas = atlas_;
    });
  }

  get isReady() {
    return this.texture != null;
  }
}
