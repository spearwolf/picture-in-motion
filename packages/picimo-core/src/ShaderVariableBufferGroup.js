import ShaderAttribValue from './ShaderAttribValue';
import ShaderAttribVariable from './ShaderAttribVariable';
import ShaderVariableAlias from './ShaderVariableAlias';
import ShaderVariableGroup from './ShaderVariableGroup';

/**
 * A group of shader variables all referencing the same array buffer.
 * @private
 */
export default class ShaderVariableBufferGroup extends ShaderVariableGroup {
  /**
   * @param {VOPool|VOArray} bufferSource
   * @param {VODescriptor} descriptor, only needed if `bufferSource` is an `VOArray`
   */
  constructor(bufferSource, voDescriptor) {
    super([]);
    const descriptor = voDescriptor || bufferSource.descriptor;
    let firstVar;
    Object.keys(descriptor.attr).forEach((attrName) => {
      if (!firstVar) {
        firstVar = new ShaderAttribVariable(
          attrName,
          new ShaderAttribValue(
            attrName,
            descriptor,
            bufferSource,
          ),
        );
        this.shaderVars.push(firstVar);
      } else {
        this.shaderVars.push(new ShaderVariableAlias(attrName, firstVar));
      }
    });
  }

  get bufferSource() {
    return this.shaderVars[0].data.bufferSource;
  }

  get serial() {
    return this.shaderVars[0].serial;
  }

  touch() {
    return this.shaderVars[0].touch();
  }
}
