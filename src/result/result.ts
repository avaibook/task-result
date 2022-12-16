export interface Result<S, F> {
  fold<T>(
    onSuccess: (value: S) => T,
    onFail: (value: F) => T
  ): T;
  map<T>(fn: (value: S) => T): Result<T, F>;
  flatMap<T>(fn: (value: S) => Result<T, F>): Result<T, F>
}

type Success<T> = Result<T, never>;

type Fail<T> = Result<never, T>;

function success<S>(value: S): Success<S> {
  return {
    fold<T>(
      onSuccess: (val: S) => T,
      onFail: (val: never) => T,
    ): T {
      return onSuccess(value);
    },

    map<T>(fn: (val: S) => T): Success<T> {
      return this.flatMap((val: S) => success(fn(val)));
    },

    flatMap<T>(fn: (val: S) => Success<T>): Success<T> {
      return this.fold(
        (ok) => fn(ok),
        (err) => fail(err),
      );
    },
  };
}

function fail<F>(value: F): Fail<F> {
  return {
    fold<T>(
      onSuccess: (val: never) => T,
      onFail: (val: F) => T,
    ): T {
      return onFail(value);
    },

    map<T>(fn: (val: never) => T): Fail<F> {
      return this;
    },

    flatMap<T>(fn: (val: never) => Fail<F>): Fail<F> {
      return this;
    },
  };
}

export const Task = {
  success,
  fail,
};
