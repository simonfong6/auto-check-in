# auto-check-in
Automated check in to a website. Intended to work on a Mac.

# Resources

## Webdriverio
https://webdriver.io/docs/setuptypes.html

## Crontab
https://superuser.com/questions/126907/how-can-i-get-a-script-to-run-every-day-on-mac-os-x


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

5. Make the login script.

`main.js`
```javascript
#!/usr/local/bin/node
/*
main.js
Starting code from https://webdriver.io/docs/setuptypes.html from the
synchronous example.
*/
// To write to log file.
fs = require('fs');

// Web Browser interaction.
const { remote } = require('webdriverio')
const sync = require('@wdio/sync').default

// Website to check in.
const url = 'https://www.interview-db.com/';

// DEFAULTS
const DEFAULT_EMAIL = 'EMAIL';
const DEFAULT_PASSWORD = 'PASSWORD';

// Login Credentials.
// Change to your credentials.
// WARNING: After you change this, do not commit or push the file to GitHub.
const email = DEFAULT_EMAIL;
const password = DEFAULT_PASSWORD;

// Checking for unchanged email.
if (email === DEFAULT_EMAIL) {
  console.log("You must change from the default email.");
  console.log("EXITING...")
  process.exit()
}

// Checking for unchanged password.
if (password === DEFAULT_PASSWORD) {
  console.log("You must change from the default email.");
  console.log("EXITING...")
  process.exit()
}

// Sleep function to pause script.
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Logs messages to file.
function log(message) {
  const CheckInLogPath = 'check_in.log';

  console.log(`Logging ${message}`);

  fs.appendFileSync(CheckInLogPath, message + '\n');
}

// Logs the date to a file.
function logDate() {
  const date = new Date();

  const CheckInEntry = `Checking in at ${date.toLocaleString()}`;

  log(CheckInEntry);
}

// Create Browser.
remote({
  runner: true,
  outputDir: __dirname,
  capabilities: {
    browserName: 'chrome'
  }
}).then((browser) => sync(() => {
    // Log date.
    logDate();

    // Visit the site.
    browser.url(url);

    // Click on GitHub Sign In button.
    const signInButton = browser.$('div.signin-buttons-container div a');
    signInButton.click();

    // Fill out email.
    const gitHubUsername = browser.$('#login_field');
    gitHubUsername.setValue(email);

    // Fill out password.
    const gitHubPassword = browser.$('#password');
    gitHubPassword.setValue(password);

    // Click login button.
    const submitButton = browser.$('input[type=submit]');
    submitButton.click();

    // Click the attendance tab
    const attendanceTab = browser.$('#react-tabs-4');
    attendanceTab.click();

    // Wait until the Check In Button exists / is loaded.
    const NineThirtyCheckInButton = browser.$('button*=09:30');
    try {
      browser.waitUntil(() => {
        return NineThirtyCheckInButton.isExisting();
      }, 5000);
    } catch (err) {
      console.log("error")
    }

    // Click the 9:30 AM Check In button if it exists.
    if (NineThirtyCheckInButton.isExisting()) {
      NineThirtyCheckInButton.click();
      log('9:30 AM Button Clicked');
    } else {
      log('9:30 AM Button Not Found');
    }

    // Click the 5:30 PM Check In button if it exists.
    const FiveThirtyCheckInButton = browser.$('button*=05:30');
    if (FiveThirtyCheckInButton.isExisting()) {
      FiveThirtyCheckInButton.click();
      log('5:30 PM Button Clicked');
    } else {
      log('5:30 PM Button Not Found');
    }

    // Wait for 5 seconds, then delete the browser.
    sleep(5000).then(() => {
      browser.deleteSession();
      logDate();
    });
    
}));
```

6. Run the login script.
```
node main.js
```
A browser window should popup and try to login. The login fails here because we gave it dummy credentials.

![](node-main.gif)

7. Make it executable. (Only required if we need to execute automatically.)
```
chmod +x main.js
```
This uses the shebang at the top to execute the file. `#!/usr/local/bin/node` so that we can run it like so:

```
./main.js
```

If you want to undo it, you can run.
```
chmod -x main.js
```

8. Running it automatically. This will require using `crontab`.
I can't figure out a way to use VS Code to edit the `crontab`, so we'll be using VIM.

## Aside
We need the path of the the file to execute (`realpath` works on mac, but on linux you can use `pwd` and append the file name.):
```
realpath main.js
```
Output
```
simon@Simons-MBP auto-check-in % realpath main.js 
/Users/simon/Projects/tools/auto-check-in/main.js
```

## Back to crontab
```
EDITOR="vim"
```

Edit the `crontab`.
```
crontab -e
```

This should open up a file like this.
```bash
20 9 * * * /Users/simon/Projects/delete-me/see-browser/run.sh "Run everyday at 9:20 AM"
```

Yours will likely be empty.


## Vim Commands
- `esc` - Reset to command mode.
- `i` - in command mode, lets you insert text or type
- `:wq` - in command mode, save and quit
- `:q` - in command mode, quit

Press `i` to write a new crontab
Let's make it run everyday at 8 AM, follow this format: https://crontab.guru/every-day-8am
```
0 8 * * * /path/to/script "Note"
```
Then type `esc` and `:wq` and `enter` to save and quit.

Example
```
0 8 * * * /Users/simon/Projects/tools/auto-check-in/main.js "Run everyday at 8:00 AM"
```
## Note
Cronjobs only run when the computer is awake, so you'll need to make sure your computer is awake when the script is supposed to run.

9. Making sure your mac is going to be awake.