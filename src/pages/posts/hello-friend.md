---
layout: ../../layouts/BlogLayout.astro

title: "Hello Friend"
description: "Learn typescript in 10 seconds! utility types and all!"
postdate: "August 5 2022"
author: "Gers"
tags: []
---

-   hi
-   hi again
-   this is a markdown test

### Hello friend :)

> This is my first post! - Will Smith

**Typescript** _is_ ~Great~

```ts
const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26,
  based: 👨‍💻️,
});

// makeWatchedObject has added `on` to the anonymous Object

person.on("firstNameChanged", (newValue) => {
  console.log(`firstName was changed to ${newValue}!`);
});
```
