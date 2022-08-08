---
layout: ../../layouts/BlogLayout.astro

title: "Typescript + Rust = Trust"
description: "Trust: Using Rust's Result and Some enum in Typescript"
postdate: "7 Aug 2022"
author: "Gers"
---

## Have you ever wonder what would happen if Typescript had a baby with Rust? Because I do!

Since I read the [Error Handling section](https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html?highlight=Result#recoverable-errors-with-result) of The Rust Programming Language Book I have been thinking: How other languages would _look_ or _feel_ if you borrow some of Rust's ideas and somehow merge them into a Franken-Rust amalgamation.

Join me in this Rust code adventure!

### Introducing Result enums:
```rs
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

```rs
fn main() {
    let file_result = File::open("file.txt");

    let file = match file_result {
        Ok(f) => f, // <- Return file inside the Result
        Err(error) => panic!("Problem opening the file: {:?}", error), 
        // ^^^ Panics, exits the program and no file was returned
    };
}
```

### Now the Typescript version of this could be
```ts
let file_result = open_file("file.txt");

file_result
    .on_payload((file) => {
        console.log("Working on file...", file);
    })
    .on_error((error) => {
        throw error;
    });
```

As you see it isn't an exact copy of the rust version, and there is a good reason for that: **Typescript doesn't have a match statement built-in**.

me: Mom can we get a `match statement`?

mom: We have a `match statement` at home:

`match statement` at home:

```ts
function my_switch<T>(result: Result<T>): T | never {
    switch (!!result.payload) {
        case true:
            return result.payload!;
        default:
            throw result.error!;
    }
}
```

We could implement our own but it wouldn't be as powerful as the rust one. That being said, this is a Rust code adventure and I'm legally obligated to do it.

## Pattern matching in Typescript

After **many** failed attempts to create a match function in Typescript, I realized that I don't really need to match every posible datatype.

Instead I could just check if Result has a payload and if it does call the correct callback. Lazy but it works.

```ts
type ResultCases<T, U> = { Ok: (v: T) => U; Err: (error: Error) => never };

function match<T, U>(result: Result<T>, cases: ResultCases<T, U>) {
    if (result.payload) {
        return cases["Ok"](result.payload);
    }
    return cases["Err"](result.error!);
}

// Example

const result = Math.random() >= 0.55 ? Ok("Bob") : Err<string>("Not BOB");

const value = match(result, {
    Ok: (v) => `Cooler ${v}`, // Cooler Bob
    Err(error) {
        throw error;
    },
});
```

Now that we have a rust-like match statement things are getting Rusty:

```ts
let file_result = open_file("file.txt");

let file = match(file_result, {
    Ok: (f) => f,
    Err(error) {
        throw error;
    },
});
```
## The Result type in Typescript
Hey, but where's the Result type? you might besaying. I'm glad you asked! Well you see at the beginning the **Result** type was very simple and humble type.

Honestly I can't take the credit for this, during a code review a Typescript 10x dev proposed the initial Result type.
It had simple task, be the return type of a function that might fail.

A different approach to the try-catch pattern, closer to the golang way of handling errors.

```ts
export type IResult<T> =
    | { payload: T; err?: Error }
    | { payload?: T; err: Error };
```

Since the simple Result won't cut it we'll need to get classy 🎩 🧐

```ts
export class Result<T> {
    payload?: T;
    error?: Error;
    public constructor({ payload, err }: IResult<T>) {
        this.payload = payload;
        this.error = err;
    }

    on_payload(callback: Callback<T>) {
        if (this.payload) {
            callback(this.payload);
        }
        return this;
    }

    on_error(callback: Callback<Error>) {
        if (this.error) {
            callback(this.error);
        }
        return this;
    }

    map_or<U>(mapper: Mapper<T, U>, initial: U) {
        return this.payload ? mapper(this.payload) : initial;
    }
}

// Utility Functions

export function Ok<T>(v: T): Result<T> {
    return new Result({ payload: v });
}

export function Err<T>(msg: string) {
    return new Result<T>({ err: new Error(msg) });
}
```

With that our Typescript-Rust monster should be working. We now have **Trust** the amalgamation of Typescript and Rust (very creative name)
Something you might notice is that the `Err` functions uses `<string>` that's because the `Err` function doesn't know the type of the payload
and since the `Result` sometimes have a payload we need to tell Typescript what's the type of the payload we expect.

```ts
const user_result = Math.random() > 0.5 ? Ok("pablo") : Err<string>("No pablo");

user_result
    .on_payload((payload) => {
        console.log(`mod == ${payload}`);
        save_to_db(payload);
    })
    .on_error(log_error);

match(user_result, {
    Ok(payload) { // <- returns void
        console.log(`mod == ${payload}`);
    },
    Err(error) {
        throw error;
    },
});

const user_obj = get_id().map_or<{ id: number; ok: boolean }>( // <- type is optional
    (x) => {
        return { id: x, ok: x >= 200 };
    },
    { id: 0, ok: false } // <- default value
);

console.log("Mapped user:", user_obj);
```

## Resources

- [Enums and Pattern Matching - Rust](https://doc.rust-lang.org/book/ch06-00-enums.html)
- [Recoverable Errors with Result - Rust](https://doc.rust-lang.org/book/ch09-02-recoverable-errors-with-result.html)
- [Utility Types - Typescript](https://www.typescriptlang.org/docs/handbook/utility-types.html)
- [Generics - Typescript](https://www.typescriptlang.org/docs/handbook/2/generics.html)