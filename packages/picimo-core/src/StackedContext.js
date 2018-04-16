/* eslint no-param-reassign: 0 */

export default class StackedContext {
  constructor() {
    this.context = new Map();
  }

  push(name, value) {
    const stack = this.context.get(name);
    if (stack) {
      stack.push(value);
      return stack.length - 1;
    }
    this.context.set(name, [value]);
    return 0;
  }

  pop(name, idx) {
    const stack = this.context.get(name);
    if (stack) {
      if (idx === undefined) {
        return stack.pop();
      }
      return stack.splice(idx, stack.length - idx);
    }
  }

  get(name) {
    const stack = this.context.get(name);
    if (stack) {
      const len = stack.length;
      if (len > 0) {
        return stack[len - 1];
      }
    }
  }

  clear() {
    this.context.forEach((value) => {
      value.length = 0;
    });
  }
}

