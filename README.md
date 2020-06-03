# auto-check-in
Automated check in to a website.

# Setup

1. Create a new directory.
```
mkdir auto-check-in
```
2. Enter the directory.
```
cd auto-check-in
```
3. Create a `package.json` by running the command in your terminal.

```
npm init -y
```
This should something like the following:

`package.json`
```json
{
  "name": "auto-check-in",
  "version": "1.0.0",
  "description": "Automated check in to a website",
  "main": "main.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/simonfong6/auto-check-in.git"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "bugs": {
    "url": "https://github.com/simonfong6/auto-check-in/issues"
  },
  "homepage": "https://github.com/simonfong6/auto-check-in#readme"
}

```
4. Install webdriver for browser interaction.
```
npm install webdriverio @wdio/sync
```
