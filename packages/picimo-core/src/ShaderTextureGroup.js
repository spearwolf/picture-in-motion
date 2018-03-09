import ShaderVariableGroup from './ShaderVariableGroup';
import ShaderTexture2dVariable from './ShaderTexture2dVariable';

/**
 * @private
 */
export default class ShaderTextureGroup {
  constructor(textureLibrary, shaderTextureMap) {
    this.textureLibrary = textureLibrary;
    this.waitFor = Object.keys(shaderTextureMap).map(shaderVarKey => ({
      shaderVarKey,
      textureId: shaderTextureMap[shaderVarKey],
      isLoaded: false,
    }));
    this.shaderVarGroup = new ShaderVariableGroup([]);
    this.shaderVarStore = new Map();
  }

  get isLoaded() {
    return this.waitFor.length === 0 && this.shaderVarGroup.shaderVars.length > 0;
  }

  whenLoaded(onLoaded) {
    if (!this.isLoaded) {
      this.waitFor.forEach((waitFor) => {
        if (!waitFor.isLoaded) {
          const texture = this.textureLibrary.getTexture(waitFor.textureId);
          if (!texture) return;

          const shaderVar = new ShaderTexture2dVariable(waitFor.shaderVarKey);
          shaderVar.texture = texture;
          this.shaderVarGroup.shaderVars.push(shaderVar);

          waitFor.isLoaded = true; // eslint-disable-line
        }
      });

      this.waitFor = this.waitFor.filter(waitFor => waitFor.isLoaded === false);

      if (this.isLoaded) {
        onLoaded(this.shaderVarGroup);
      }
    } else {
      onLoaded(this.shaderVarGroup);
    }
  }
}
