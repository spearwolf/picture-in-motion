import generateUuid from './generateUuid';

/**
 * @desc
 * Generic data reference with a *type* and *serial number*.
 *
 * Each time you are setting the `data` property to a new value, the serial number will be increased.
 * Use `.touch()` if you want to increase the serial number without changing the value.
 *
 */
class DataRef {
  constructor(type, data, hints = null) {
    this.type = type;
    this.data_ = data;
    this.id = (hints && hints.id) ? String(hints.id) : generateUuid();
    this.serial = (hints && typeof hints.serial === 'number') ? hints.serial : 1;
    this.hints = hints;
  }

  get data() {
    return this.data_;
  }

  set data(next) {
    const current = this.data_;

    if (next !== current) {
      this.data_ = next;
      this.touch();
    }
  }

  touch() {
    this.serial++;
  }

  /**
   * @param {DataRef} otherRef
   * @returns {boolean} Returns `true` if *serial* is greater than 0 and equals to *serial* from `otherRef`
   */
  isSynced(otherRef) {
    const { serial } = this;
    return serial > 0 && serial === otherRef.serial;
  }

  /**
   * @param {DataRef} otherRef
   * @returns {boolean} - Returns the opposite of `isSynced()`
   */
  needSync(otherRef) {
    return !this.isSynced(otherRef);
  }

  /**
   * @param {DataRef} otherRef
   * @param {function} callback
   */
  sync(otherRef, callback) {
    if (this.needSync(otherRef)) {
      callback(this.data);
      this.serial = otherRef.serial;
    }
  }

  /**
   * Returns `true` if a hint exists and the hint value is as expected.
   * If you leave out the expected value (call the method with just one argument)
   * the methods just ckecks if the hint exists (regardless ofthe value).
   *
   * @param {string} hintKey
   * @param {*} expectedValue
   * @returns {boolean}
   */
  hasHint(hintKey, expectedValue) {
    if (arguments.length === 1) {
      return Boolean(this.hints && hintKey in this.hints);
    }
    return Boolean(this.hints && hintKey in this.hints && this.hints[hintKey] === expectedValue);
  }

  /**
   * Returns a hint value.
   *
   * @param {string} hintKey
   * @returns {*}
   */
  hint(hintKey) {
    return this.hints && this.hints[hintKey];
  }
}

export default DataRef;
