import VOArray from './VOArray';

/**
 * @private
 */
export default class ShaderAttribValue {
  constructor(name, descriptor, bufferSource) {
    this.name = name;
    this.descriptor = descriptor;
    this.bufferSource = bufferSource;
  }

  set bufferSource(source) {
    this.bufferSource_ = source;
    this.ref = source instanceof VOArray ? source.ref : source.voArray.ref;
  }

  get bufferSource() {
    return this.bufferSource_;
  }

  get attrDescriptor() {
    return this.descriptor.attr[this.name];
  }
}
