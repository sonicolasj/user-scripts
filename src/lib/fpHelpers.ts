export type Option<T> = T | undefined | null;

export function optionable<T,R>(f: (_: T) => R): (input: Option<T>) => Option<R> {
    return function(param: Option<T>) {
        if (param == null) return param;
        return f(param);
    }
}

export function strict<T,R>(f: (_: T) => Option<R>, errorText: string): (input: T) => R {
    return function(param: T) {
        const value = f(param);
        if (value == null) throw new Error(errorText);
        return value;
    }
}

export type Result<T> = T | Error;

export function resultable<T,R>(f: (_: T) => R): (input: Result<T>) => Result<R> {
    return function(param: Result<T>) {
        if (param instanceof Error) return param;
        return f(param);
    }
}

export function safe<T,R>(f: (_: T) => R): (input: T) => Result<R> {
    return function(param: T) {
        try {
            return f(param);
        }
        catch (e) {
            return e;
        }
    }
}
