let lastUuid = 0;

const generateUuid = () => String(++lastUuid);

class ResourceReference {
  constructor(resourceType, resource, hints) {
    this.resourceType = resourceType;
    this.resource_ = resource;
    this.id = hints && hints.id != null ? String(hints.id) : generateUuid();
    this.serial = hints && typeof hints.serial === 'number' ? hints.serial : 1;
  }

  get resource() {
    return this.resource_;
  }

  set resource(next) {
    const current = this.resource_;

    if (next !== current) {
      this.resource_ = next;
      this.serial++;
    }
  }

  touch() {
    this.serial++;
  }
}

export default ResourceReference;
