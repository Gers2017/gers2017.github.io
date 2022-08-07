---
layout: ../../layouts/BlogLayout.astro

title: "Typescript vs Rust"
description: "Today we're going to see which one is better: Typescript or Rust? who's the mvp of programming languages?"
date: "1 Jun 2022"
author: "Gers"
---

## Do you ever feel like typescript is too good?

### Introducing Rust:

```rs
fn get_input(message: &str) -> String {
    println!("{}: ", message);
    let mut buffer = String::new();
    let stdin = io::stdin();
    let mut handle = stdin.lock();

    match handle.read_line(&mut buffer) {
        Ok(_) => buffer.trim().to_owned(),
        Err(err) => {
            eprintln!("{}", err);
            String::new()
        }
    }
}

fn get_int_input(message: &str, fallback: i16) -> i16 {
    get_input(message).parse::<i16>().unwrap_or(fallback)
}
```
#### Pros
- Gorgeous compiler errors
- Borrow checker
- Ferris

## Typescript

#### Things We know about JS so far

- It sucks
- Is **not** _java_
- Is faster than python (somehow)
- Is in every corner
- You can't live without it

