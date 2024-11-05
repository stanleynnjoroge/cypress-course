const { defineConfig } = require("cypress");
const marge = require("mochawesome-merge");
const fs = require("fs");

module.exports = defineConfig({
  reporter: "mocha-multi-reporters",
  reporterOptions: {
    reporterEnabled:
      "mochawesome, mocha-junit-reporter, reporters/custom-csv-reporter, reporters/markdown-reporter.js",
    toConsole: true,

    mochawesomeReporterOptions: {
      reportDir: "cypress/reports",
      overwrite: false,
      html: true,
      json: true,
      toConsole: true,
    },

    mochaJunitReporterReporterOptions: {
      mochaFile: "./cypress/reports/results.xml",
      overwrite: false,
      outputs: true,
      includePending: true,
      toConsole: true,
    },
  },
  e2e: {
    // Place your Cypress e2e test settings here, if any
  },
});
