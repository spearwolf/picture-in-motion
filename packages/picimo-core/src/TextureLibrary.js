import Texture from './Texture';
import TextureHandle from './TextureHandle';
import TextureAtlas from './TextureAtlas';
import ShaderTexture2dVariable from './ShaderTexture2dVariable';

export default class TextureLibrary {
  constructor() {
    this.handles = new Map();
    this.shaderVars = new Map();
  }

  loadTexture(id, url = id, textureHints = undefined) {
    const th = new TextureHandle(Texture.load(url, textureHints));
    this.handles.set(id, th);
    return th.onReady;
  }

  loadTextureAtlas(id, url = id, textureAtlasOptions = undefined) {
    const th = new TextureHandle(TextureAtlas.load(url, textureAtlasOptions));
    this.handles.set(id, th);
    return th.onReady;
  }

  getTexture(id) {
    const th = this.handles.get(id);
    return th && th.texture;
  }

  getTextureAtlas(id) {
    const th = this.handles.get(id);
    return th && th.atlas;
  }

  whenLoaded(textureId, shaderVarKey, onLoaded) {
    const texture = this.getTexture(textureId);
    if (!texture) return;

    let shaderVar = this.shaderVars.get(shaderVarKey);
    if (!shaderVar) {
      shaderVar = new ShaderTexture2dVariable(shaderVarKey);
      this.shaderVars.set(shaderVarKey, shaderVar);
    }

    shaderVar.texture = texture;
    onLoaded(shaderVar);
  }
}

