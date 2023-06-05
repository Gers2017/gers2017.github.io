---
layout: ../../layouts/BlogLayout.astro

title: "From Pythonista to Rustacean"
description: "Basic introduction to rust for pythonistas"
postdate: "June 5 2023"
author: "Gers"
tags:
    - python
    - rust
    - tutorial
    - lifetimes
---

## Introduction to rust for pythonistas

I'm legally obliged to start this post with an unnecessary introduction.
Python is a general purpose, dynamically typed, interpreted language that is both easy to learn and use. Python supports classes and all the _beauty_ of the OOP paradigm, it features a vibrant ecosystem of packages, its package manager is called `pip`.

Due to its popularity, there are a lot of tutorials and learning resources. Personally I consider it great for prototyping and learning new concepts.

Rust is a general purpose, statically typed, compiled language that aims to be both fast and memory safe. It features wonderful error messages, a great documentation, the all-mighty turbo fish (`<>::`), the glorious `match` statement and a thriving ecosystem of packages ([crates](https://doc.rust-lang.org/book/ch07-01-packages-and-crates.html)). Its package manager is called `cargo`.

One the key features of rust is the borrow checker, it understands ownership and references in your code and by extension it understands your code. This enables it to enforce certain rules before running the code.

## Comparing Syntax

```py
# python syntax

number = 420
string = "hello there!"
my_list = [0, 1, 2]
my_tuple = ("John", 42)
my_dict = {"alice": 600, "bob": 200}

for i in range(10):
    print(i)

n = 0

while n < 3:
    print("I'm inside a while loop!")
    n += 1

foo = 0

if foo == 1:
    # foo is 1
elif foo < 1:
    # foo is less than 1
else:
    # everything else
```

```rs
// rust syntax

let number = 420;
let string: String = String::from("hello there!");
let my_list = vec![0, 1, 2];
let my_tuple: (&str, i32) = ("John", 42);

let mut my_dict: HashMap<&str, i32> = HashMap::new();
my_dict.insert("alice", 600);
my_dict.insert("bob", 200);

for i in 0..10 {
    println!("{}", i);
}

let mut n = 0;

while n < 3 {
    println!("I'm inside a while loop!");
    n += 1;
}

let foo = 0;

if foo == 1 {
    // foo is 1
} else if foo < 1 {
    // foo is less than 1
} else {
    // everything else
}

// or

match foo {
    1 => {
        // foo is 1
    }
    foo if foo < 1 => {
        // foo is less than 1
    }
    _ => {
        // everything else
    }
}
```

## A Simple Function

In python you can define an add function like this:

```py
def add(a: int, b: int):
    return a + b
```

Now in rust:

```rs
fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

Since rust is an expression based language we can simply return `a + b` without the return keyword. Notice that the last statement is missing the semicolon at the end.
Early returns still use the `return` keyword. Let's take a look to another example.

## References and Strings

```py
def get_first_char(string: str) -> str | None: # Optional[str]
    if len(string) == 0:
        return None

    return str[0]
```

```rs
fn get_first_char(string: &str) -> Option<char> {
    if string.len() == 0 {
        return None;
    }

    string.chars().next() // ?
}
```

Ok so what is `&str` doing here? `&str` Represents a reference to a [string slice](https://doc.rust-lang.org/std/primitive.str.html).
You can think of it as two separate components `&` means reference and `str` means string slice. In a few words you can think of a reference as a pointer to the original value.

<div align="center">
    <img src="/assets/references-meme.png" width="275px" alt="references" />
</div>

---

You may be wondering why are we using `string.chars().next()` instead of
`string[0]` and there's a good reason for that.
Well you see, turns out that some characters take more storage than others.

What do I mean by that, well here's a good example from the rust book:

```rs
String::from("Hola"); // characters: 4, bytes: 4
String::from("Здравствуйте"); // characters: 12, bytes: 24
```

In the code above, the first string takes 4 bytes to encode while the last one takes 24 bytes to encode in UTF-8. We can't index into the string like we we'd do with an array because we may be indexing in the middle of a character.

Instead we need to use the `.chars()` method to access the characters. For a more in-depth explanation please read [this](https://doc.rust-lang.org/book/ch08-02-strings.html#internal-representation).

---

Going back to the `get_first_char` function, we can do better.
For example be could use the **glorious** match statement:

```rs
fn get_first_char(string: &str) -> Option<char> {
    match string.chars().next() {
        Some(ch) => Some(ch),
        None => None,
    }
}
```

Or even better!

```rs
fn get_first_char(string: &str) -> Option<char> {
    string.chars().next()
}
```

Let’s take a look to an example that mutates values inside a function.

In python we can define a `User` class and a function to change its name like this:

```py
class User:
    name: str
    is_admin: bool

    def __init__(self, name, is_admin) -> None:
        self.name = name
        self.is_admin = is_admin


def change_username(user: User, username: str):
    user.name = username

user = User("Bob", True)
change_username(user, "Cool Bob")
```

Equivalent code in rust:

```rs
struct User {
    name: String,
    is_admin: bool,
}

fn change_username(user: &mut User, username: &str) {
    user.name = username.to_string();
}

// inside main()...
let mut user = User {
    name: String::from("Bob"),
    is_admin: true,
};

change_username(&mut user, "Cool Bob");
```

Ok looks nice, we know what `&str` means, but what is `&mut` doing here?.
Same as before `&` represents a reference, `mut` indicates that this function mutates the original value of this reference. And `&mut User` means mutable reference of a `User` struct.

We can also create a _"constructor"_ function for the `User` struct like this:
You can mentally replace `Self` with `User`.

```rs
impl User {
    fn new(name: &str, is_admin: bool) -> Self {
        Self { name: String::from(name), is_admin }
    }
}

// main()...
let mut user = User::new("Bob", true);
change_username(&mut user, "Cool Bob");
```

## Functions with Lifetime Annotations

```py
def split_by(slice: str, delimiter: str) -> Optional[List[str]]:
    result = slice.split(delimiter, maxsplit=1)
    return result if len(result) > 1 else None


pair = split_by("snakes & ducks!", "&")
print(pair) # ['snakes ', ' ducks!']
```

```rs
type Pair<'a> = [&'a str; 2];

fn split_by(slice: &str, delimiter: char) -> Option<Pair> {
    match slice.split_once(delimiter) {
        Some((left, right)) => Some([left, right]),
        None => None,
    }
}

let pair = split_by("ducks & crabs!", '&');
println!("{:?}", pair); // Some(["ducks ", " crabs!"])
```

The python version of `split_by` splits once the slice by a delimiter. Returning the list if the list contains more than 1 item else returns `None`.
The `Optional` here means that this function may return `None` and `List[str]` means a list of strings (python doesn't have a `char` type).

The rust version does virtually the same as the previous function. And everything looks fine until you realize that `Pair<'a>` has a weird generic parameter `<'a>`. And why is it after `&` but before `str`?

I'm glad you notice it. You can think of `'a` as an annotation to indicate how long a reference lives (or how long is valid).
Let's decompose `&'a` into smaller components. `&` represents a reference, `'a` represents how long is this reference valid.
So `&'a` is a reference that's valid for the lifetime `'a`.

```rs
//                v--- reference's lifetime
type Pair<'a> = [&'a str; 2];
//        ^- generic lifetime
```

If we take a look at the `split_once` definition, we will find lifetime annotations:

```rs
//                 v-- input lifetime         v-- Pattern of lifetime 'a
pub fn split_once<'a, P>(&'a self, delimiter: P) -> Option<(&'a str, &'a str)>
//                                    str reference of lifetime 'a ---^
where // <-- generic constraint
    P: Pattern<'a>,
```

The generic parameter `'a` takes the lifetime of the `&str` (`&'a self`) calling the function and basically says: I may or may not return a tuple of `&str` that live as long as the original `&str` it came from.

<div align="center">
    <img src="/assets/spider-lifetimes.png" width="300px" alt="lifetimes" />
</div>

Going back to the example. The reason why we don't need to annotate every reference with `'a` is because of a little thing called **lifetime elision**.
Without it the example would look like this:

```rs
type Pair<'a> = [&'a str; 2];

fn split_by<'a>(slice: &'a str, delimiter: char) -> Option<Pair<'a>> {
    match slice.split_once(delimiter) {
        Some((left, right)) => Some([left, right]),
        None => None,
    }
}
```

Lifetime elision is what allow us to omit the annotations, you can think of it as a set of rules / patterns that the compiler uses to infer lifetimes.

As such the compiler is totally ok without any lifetime annotations (in some cases).
With more complex cases the compiler will leave it up to the programmer.

If you're curious about the lifetime elision consider reading [this](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html?highlight=lifetimes#lifetime-elision) chapter of the rust book.

---

For the sake of completion, I'd like to refactor `split_by`.
Instead of `match` we could simply use `map` to extract the values of the tuple and return the array.

```rs
fn split_by(slice: &str, delimiter: char) -> Option<Pair> {
    slice
        .split_once(delimiter)
        .map(|(left, right)| [left, right])
}
```

---

## Resources

-   [Rust Book](https://doc.rust-lang.org/book/)
-   [Docs.rs](https://docs.rs/)
-   [Rust's Data Types](https://doc.rust-lang.org/book/ch03-02-data-types.html)
-   [String Slice](https://doc.rust-lang.org/std/primitive.str.html)
-   [String in Rust](https://doc.rust-lang.org/book/ch08-02-strings.html)
-   [Lifetime Elision](https://doc.rust-lang.org/book/ch10-03-lifetime-syntax.html?highlight=lifetimes#lifetime-elision)
