class Pipe<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }

  pipe<U>(fn: (value: T) => U): Pipe<U> {
    return new Pipe(fn(this.value));
  }

  valueOf(): T {
    return this.value;
  }

  get(): T {
    return this.value;
  }
}

export function pipedData<T>(value: T) {
  return new Pipe(value);
}
