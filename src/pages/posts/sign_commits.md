---
layout: ../../layouts/BlogLayout.astro

title: "How to sign your commits"
description: "Learn how to sign your commits using GPG or SSH keys"
postdate: "2 Sep 2022"
author: "Gers"
---

## Sign your Commits!!!

![RUN](https://media.giphy.com/media/7kn27lnYSAE9O/giphy.gif)
![Keep calm](https://media.giphy.com/media/p9bj7nrUPAypq/giphy.gif)

If you happen to be a github user then you might have seen this **Verified** signature next to some commits.

What does it mean? Are they part of secret society of Verified users? should I be signing my commits too?

![Github Signed Commit](https://docs.github.com/assets/cb-13111/images/help/commits/verified-commit.png)

Let's be real here, we all like shiny green badges next to our commits, it give us a sense of power (just like neovim users!)
Good news! In this blog-post you're going to learn how to sign your commits using GPG or SSH.

## Table of contents

-   [Using GPG to sign commits](#using-gpg-to-sign-commits)
-   [Add GPG key to Github](#add-gpg-key-to-github)
-   [Configure Git to use GPG key](#configure-git-to-use-gpg-key)
-   [Using SSH keys to Sign Commits](#using-ssh-keys-to-sign-commits)
-   [Resources](#resources)

## Using GPG to sign commits

Before we get started, please check the version of `gpg` is up to date by running `gpg --version`
Mine is `gpg (GnuPG) 2.2.37`.

### Generate the GPG key

```bash
gpg --full-generate-key
```

1. what kind of key you want: select RSA (sign only) by typing `4` and hit `Enter`
2. keysize: type `4096` and hit `Enter`
3. how long the key should be valid: recommended `2y` or `3y`

Answer the questions:

1. Real name: Your name or your Github username
2. Email address: The verified email address for your github account
    - Github specific: You could also use the no-reply email of your Github account: At [email settings](https://github.com/settings/emails) bellow the `Keep my email addresses private` checkbox should be the no-reply email like `@users.noreply.github.com`
3. Assuming everything is fine, type `O` to confirm
4. Provide a passphrase: Choose a secure passphrase
    - personal recommendation: create a passphrase made of `12` to `16` characters with at least one special character (`$, #, @, ...`)

### Test the GPG key

```bash
echo 'hi!' | gpg --clear-sign > test.txt
gpg --verify test.txt
```

It should say something like: `Good signature from "USERNAME (Test Key) <example@email.com>"`

### Get the GPG key ID

```bash
gpg --list-secret-keys --keyid-format=long
# or
gpg -K --keyid-format=short

# Output:

sec   rsa4096/A537823F 2022-09-02 [SC] [expires: 2023-09-02]
    E98E6B0663442DE0463E2A880FE0F073A537823F
uid         [ultimate] USERNAME (Test Key) <example@email.com>
```

In this case the key ID is `A537823F` (from `rsa4096/A537823F`)

### Add GPG key to Github

-   Get the public key

    ```bash
    gpg --armor --export A537823F

    # generated key
    # -----BEGIN PGP PUBLIC KEY BLOCK-----
    # ....
    # -----END PGP PUBLIC KEY BLOCK-----
    ```

-   Copy the generated key
-   Go to [SSH and GPG keys on github](https://github.com/settings/keys) or [Add new GPG key on github](https://github.com/settings/gpg/new)
    -   [More details here](https://docs.github.com/en/authentication/managing-commit-signature-verification/adding-a-gpg-key-to-your-github-account)
-   Paste the generated key
-   Click `Add GPG key`

### Configure Git to use GPG key

With the key ID `A537823F`

-   Add signingkey
    ```bash
    git config --global user.signingkey A537823F
    ```
-   Enable sign for all commits and tags
    ```bash
    git config --global commit.gpgSign true
    git config --global tag.gpgSign true
    ```
-   Set your name and email
    ```bash
    git config --global user.name USERNAME
    git config --global user.email example@email.com
    ```

### Gpg agent configuration

-   Export GPG_TTY
    append the following to your `.bashrc` / `.zshrc` or your initialization file

    ```bash
    export GPG_TTY=$(tty)

    # For fish users:
    set -x GPG_TTY $(tty)
    ```

-   Configure gpg.conf
    -   create `~/.gnupg/gpg.conf`
    -   append `use-agent` to `~/.gnupg/gpg.conf`

## Using SSH keys to Sign Commits

If you don't have a ssh key already, check:

-   [Generating a new SSH key - Github Docs](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
-   [Adding a new SSH key - Github Docs](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/adding-a-new-ssh-key-to-your-github-account)

**Don't forget** to set the Key type to `Signing key`

If you do have one, then:

### Configure git to use ssh

```bash
git config --global gpg.format ssh
```

### Copy your public ssh key

```bash
cat ~/.ssh/id_ed25519.pub
```

### Set the signkey to your public ssh key (replace the text inside the quotes)

```bash
# Beware of the quotes
git config --global user.signingkey 'key::ssh-ed25519 AAAAC3(...) example@email.com'
```

### Verify your signed commit

```bash
git commit -m "Some message"

# Verify the commit

git verify-commit 488a8d82 # get the hash with git log
# Or
git log --show-signature
```

## Resources

-   [About signature verification - Github Docs](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification)
-   [Generate a new SSH key - Github Docs](https://docs.github.com/en/authentication/connecting-to-github-with-ssh/generating-a-new-ssh-key-and-adding-it-to-the-ssh-agent)
-   [Tell git about your keys - Github Docs](https://docs.github.com/en/authentication/managing-commit-signature-verification/telling-git-about-your-signing-key)
-   [How (and why) to sign Git commits](https://withblue.ink/2020/05/17/how-and-why-to-sign-git-commits.html)
-   [Signing Git Commits with SSH Keys](https://blog.dbrgn.ch/2021/11/16/git-ssh-signatures/)
-   [GPG agent](https://linux.die.net/man/1/gpg-agent)
-   [OpenPGP Best Practices](https://riseup.net/en/security/message-security/openpgp/best-practices)
