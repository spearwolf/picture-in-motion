// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/blendFunc

/** @private */
const toString = ({ enable, sfactor = '', dfactor = '' }) => JSON.stringify([enable, sfactor, dfactor]);

/** @private */
let blendModeCache = null;

export default class BlendMode {
  static make(name, options) {
    if (blendModeCache === null) {
      blendModeCache = new Map();

      BlendMode.make('off', { enable: false });
      BlendMode.make('additive', { enable: true, sfactor: 'SRC_ALPHA', dfactor: 'ONE' });
      BlendMode.make('orderDependent', { enable: true, sfactor: 'SRC_ALPHA', dfactor: 'ONE_MINUS_SRC_ALPHA' });
    }

    let blendMode = blendModeCache.get(name);
    if (blendMode) return blendMode;

    if (!options) return;

    const key = toString(options);
    blendMode = blendModeCache.get(key);
    if (blendMode) {
      blendModeCache.set(name, blendMode);
      return blendMode;
    }

    blendMode = new BlendMode(options);
    blendModeCache.set(key, blendMode);
    blendModeCache.set(name, blendMode);
    return blendMode;
  }

  constructor({ enable, sfactor = null, dfactor = null }) {
    this.enable = enable;
    this.sfactor = sfactor;
    this.dfactor = dfactor;
  }

  set sfactor(value) {
    this._sfactor = typeof value === 'string' ? value : undefined;
  }

  get sfactor() {
    return this._sfactor;
  }

  set dfactor(value) {
    this._dfactor = typeof value === 'string' ? value : undefined;
  }

  get dfactor() {
    return this._dfactor;
  }

  isEqual(other) {
    return other && this.enable === other.enable && this._sfactor === other.sfactor && this._dfactor === other.dfactor;
  }
}
