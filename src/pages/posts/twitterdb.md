---
layout: ../../layouts/BlogLayout.astro

title: "Use Twitter as your Database"
description: "or how I accidentally uploaded my passwords to twitter"
postdate: "December 20 2023"
author: "Gers"
tags: [cryptography, encryption, base64, twitter, compression, web-scrapping]
---

## Welcome Everybody!

Good evening my dear pythonistas, js lovers, rustaceans, 4coders, vim enthusiasts and everyone else!

In today's episode of the misadventures of gers, we will learn how to ~harvest the power of the sun with a dyson sphere~ - I mean use twitter as your database!
That's right, **Twitter as a Database**.

But before all of that, a short message from our sponsor (spoiler: _we don't have any_)

---

-   Tired of paying AWS all your life savings?
-   Can't find any reason to sell your soul to Azure?
-   MongoDB webscale isn't enough for you?

Then today is your lucky day!
Presenting: **TwitterDB™**

The world's first AI-powered Serverless Database.
Capable of handling 69 Trillion requests per second. Infinite webscale. No SQL, fast and reliable by default.

Truly an exceptional feat of engineering, redefining what a Database is.

---

The reaction of Elon Tusk when he finds out:

![🤯🤯🤯](https://media.giphy.com/media/YN1eB6slBDeNHr1gjs/giphy.gif)

Don't worry he won't.

🤫🤫🤫

### Struck by lightning and technological arms race

![arms-race](/assets/arms-race.png)

One does not simply upload an image by dragging it into a web interface.

To upload anything to **TwitterDB™** we need to be efficient, clever and sneaky.
We can't just upload huge images as bytes and expect it to scale.

Luckily the engineers at **TwitterDB™** realized that and devised a plan:

```
- get the bytes
- encrypt the bytes
- encode to base64
- split it into chunks
- write the encoded chunks into a text file
```

Everything in this wonderful digital world is made of little shiny things called "bits", a byte is made of 8 bits, 2^8 = 256 and binary is the superior base for counting numbers.
Understood? Good, glad we had this talk.

Ok, we're definitely going to need these "bytes" for this transcendental task.

Let's pretend that we have an image, maybe a PNG with roughly 264 bytes, 16px wide and 16px high.
Now using your favorite programming language (I use rust btw), [read](https://doc.rust-lang.org/std/fs/fn.read.html) the bytes of the image.

```rs
let bytes = read(file_path).expect("I expect this to work");
```

### RSA stands for privacy

Remember what I said earlier about being sneaky? Well, we are not sneaky enough. Our sneakiness is bellow 200 points in the Richter scale.

We could use the original bytes but if we do, anyone could reconstruct the image and get the nuclear codes and we surely don't want that to happen, **RIGHT?**.

But how can we hide the contents of our image without mixing and smashing our image beyond recognition?

If only there was some formula, science or something we could use for this purpose. 😰😖

_I don't know what I'm doing anymore 😔😔😔_

I've heard about this thing called cryptography, I guess we can give it a try.

After 3 hours of reading wikipedia articles I have finally found the best encryption method for this endeavor.

For obvious reasons I'm not sharing the encryption method that I used; I didn't totally used the equivalent of ROT13 for images, I can guarantee you that.

```rs
fn encrypt_bytes(bytes: &[u8]) -> Vec<u8> {
    // use your imagination :)
}
```

### The Based64 user

Editor's note: I made a mistake. In a previous attempt I used hexadecimal instead of base64.

As much as I'd love to send raw bytes to **TwitterDB™**, that would break the first law of robotics.

So instead of that, we will encode the bytes to base64 using this neat [base64 crate](https://crates.io/crates/base64).

```rs
let encrypted = encrypt_bytes(&bytes);
let encoded = STANDARD_NO_PAD.encode(encrypted);
```

### Heartwarming family reunion

We're getting closer to the final step!

We're chopping the encoded string into chunks of `279` characters.
Why `279` characters? Because Twitter hates me and I'm too deep in this mud to turn back now.

Just as an example:

```
U29tZXRoaW5nIGlzIHdyb25nIHdpdGggZ2xvYmFsIHNub3cgcHJvZHVjdGlvbiwgYW5kIHlvdSd2ZSBiZWVuIHNlbGVjdGVkIHRvIHRha2Ug
YSBsb29rLiBUaGUgRWx2ZXMgaGF2ZSBldmVuIGdpdmVuIHlvdSBhIG1hcDsgb24gaXQsIHRoZXkndmUgdXNlZCBzdGFycyB0byBtYXJrIHRo
ZSB0b3AgZmlmdHkgbG9jYXRpb25zIHRoYXQgYXJlIGxpa2VseSB0byBiZSBoY

XZpbmcgcHJvYmxlbXMuCllvdSd2ZSBiZWVuIGRvaW5nIHRoaXMgbG9uZyBlbm91Z2ggdG8ga25vdyB0aGF0IHRvIHJlc3RvcmUgc25vdyBvcG
VyYXRpb25zLCB5b3UgbmVlZCB0byBjaGVjayBhbGwgZmlmdHkgc3RhcnMgYnkgRGVjZW1iZXIgMjV0aC4gQ29sbGVjdCBzdGFycyBieSBzb2x
2aW5nIHB1enpsZXMuIFR3byBwdXp6bGVzIHdpbGwgYmUgbWFkZSBhdmFpbG

FibGUgb24gZWFjaCBkYXkgaW4gdGhlIEFkdmVudCBjYWxlbmRhcjsgdGhlIHNlY29uZCBwdXp6bGUgaXMgdW5sb2NrZWQg
d2hlbiB5b3UgY29tcGxldGUgdGhlIGZpcnN0LiBFYWNoIHB1enpsZSBncmFudHMgb25lIHN0YXIuIEdvb2QgbHVjayE=
```

### Uploading my password to the cloud

Finally, with the bytes encoded in base64, we generate a text file.

![it's rewind time - will smith](https://media.giphy.com/media/3d6WO0F9SK9hbmpsiX/giphy.gif)

> Nice and all, but how are we going to upload this to our database?
>
> -- dementia bear

I'm glad you asked dementia bear, allow me to explain it with luxury of details.

We have a few options, we could try to emulate a legitimate request from a twitter client; this is specially tricky because we would need to stay in sync with the twitter API, and even if we do there's no guarantee that we'll get everything right in the beginning, someone at twitter HQ might see our activities as suspicious.

Another option, we don't try to emulate, we run in bare metal. Our primary concern is to not raise any alarms, to do that we need to blend with the rest of requests. But what if we could programmatically open a browser and act like a regular client.

Good news for us, we can control a browser and avoid all the pain of using the twitter API.

We'll use this little tool I like to call **playwright**, I only use this tool for testing purposes and nothing else. 😉😉😉

Bring your javascript hat because we're creating a new nodejs project.

With the baroque nature of Javascript in our side, we carve our way to the `twitter.com` website.

-   \*Carefully types the credentials\*
-   \*Waits for an unbearable amount of javascript to be downloaded\*
-   \*The website is slow as a snail\*
-   The modern web experience 😌

And this is where **the text file** comes into play.
By reading the file and splitting it into chunks, we get a list of tweets.
Each of them contains a fragment of the bytes encoded in base64.

Now, imagine the browser furiously posting each chunk from the text file. (Try to beat text files now clojure devs)

At the end, when every chunk has been posted, we instruct playwright to press the big "post" button. And wait a few seconds.... Success!!!

And with that, I'm out. We have stored our image in **TwitterDB™** and now we can retrieve the encoded bytes from each tweet, decode it, decrypt the bytes and get our precious image back.

![posting chunks of base64 to twitter](/assets/twitterdb-in-action.gif)

![celebrate](https://media.giphy.com/media/U4DswrBiaz0p67ZweH/giphy.gif)

### Stuff you won't read

-   [cryptography](https://en.wikipedia.org/wiki/Cryptography)
-   [encryption](https://en.wikipedia.org/wiki/Encryption)
-   [playwright](https://playwright.dev/docs/intro)
