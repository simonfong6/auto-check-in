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
      const text = NineThirtyCheckInButton.getText();
      log(`9:30 AM Text: '${text}'`);
      log('9:30 AM Button Clicked');
    } else {
      log('9:30 AM Button Not Found');
    }

    // Click the 5:30 PM Check In button if it exists.
    const FiveThirtyCheckInButton = browser.$('button*=05:30');
    if (FiveThirtyCheckInButton.isExisting()) {
      FiveThirtyCheckInButton.click();
      const text = FiveThirtyCheckInButton.getText();
      log(`5:30 PM Text: '${text}'`);
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
