import Serial from './Serial';

let lastUuid = 0;

const generateUuid = () => String(++lastUuid);

class ResourceRef {
  constructor(resourceType, resource, hints) {
    this.resourceType = resourceType;
    this.resource_ = resource;
    this.id = hints && hints.id != null ? String(hints.id) : generateUuid();
    this.serial = new Serial(hints && typeof hints.serial === 'number' ? hints.serial : 1);
    this.hints = hints;
  }

  get resource() {
    return this.resource_;
  }

  set resource(next) {
    const current = this.resource_;

    if (next !== current) {
      this.resource_ = next;
      this.serial.touch();
    }
  }

  touch() {
    this.serial.touch();
  }

  /**
   * @param {ResourceRef} sourceRef
   * @returns {boolean}
   */
  isSynced(sourceRef) {
    const { value } = this.serial;
    return value > 0 && value === sourceRef.serial.value;
  }

  /**
   * @param {ResourceRef} sourceRef
   * @returns {boolean}
   */
  needSync(sourceRef) {
    return !this.isSynced(sourceRef);
  }

  /**
   * @param {ResourceRef} sourceRef
   * @param {function} cb
   */
  sync(sourceRef, cb) {
    if (this.needSync(sourceRef)) {
      cb(this.resource);
      this.serial.value = sourceRef.serial.value;
    }
  }
}

export default ResourceRef;
