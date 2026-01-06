// Minimal Buffer polyfill for browser environment
export class Buffer {
  constructor(data) {
    if (typeof data === 'string') {
      this.data = new TextEncoder().encode(data);
    } else if (data instanceof Uint8Array) {
      this.data = data;
    } else if (Array.isArray(data)) {
      this.data = new Uint8Array(data);
    } else {
      this.data = new Uint8Array(0);
    }
  }

  static from(data, encoding) {
    if (typeof data === 'string') {
      return new Buffer(data);
    }
    if (data instanceof Uint8Array || Array.isArray(data)) {
      return new Buffer(data);
    }
    return new Buffer([]);
  }

  static alloc(size, fill = 0) {
    const buf = new Buffer(new Uint8Array(size));
    if (fill !== 0) {
      buf.data.fill(fill);
    }
    return buf;
  }

  static allocUnsafe(size) {
    return new Buffer(new Uint8Array(size));
  }

  static isBuffer(obj) {
    return obj instanceof Buffer;
  }

  toString(encoding = 'utf8') {
    return new TextDecoder().decode(this.data);
  }

  get length() {
    return this.data.length;
  }
}

export default Buffer;
