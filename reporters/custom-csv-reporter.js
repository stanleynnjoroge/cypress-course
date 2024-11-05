// custom-csv-reporter.js
const Mocha = require('mocha');
const fs = require('fs');
const path = require('path');
const { log } = require('console');
const { Base } = Mocha.reporters;

// Custom CSV Reporter
class CustomCSVReporter extends Base {
  constructor(runner) {
    super(runner);

    const name = `tests-results-${Date.now()}.csv`

    // CSV header
    const outputPath = path.join(`cypress/reports/${name}`);
    const csvHeader = 'test_uuid,test_title,suites,tests,passes,failures,start,end,duration,testsRegistered,passPercent,pendingPercent,other,hasOther,skipped,hasSkipped,result_Uuid,title,fullFile,file,beforeHooksCount,afterHooksCount,testsCount,suitesCount,passesCount,failuresCount,pendingCount,skippedCount,root,rootEmpty,timeout,parent_suite_uuid,test_full_title,timedOut,state,speed,fail,context,code,parentUUID,isHook,error\n'

    // Create (or overwrite) the CSV file with the header
    fs.writeFileSync(outputPath, csvHeader, (err) => {
      if (err) throw err;
    });

    // On each test completion (pass, fail, skip)
    runner.on('test end', (test) => {
      console.log(test);
      
      const testResult = [
        test.test_uuid,
        test.test_title,
        test.suites,
        test.tests,
        test.passes,
        test.failures,
        test.start,
        test.end,
        test.duration,
        test.testsRegistered,
        test.passPercent,
        test.pendingPercent,
        test.other,
        test.hasOther,
        test.skipped,
        test.hasSkipped,
        test.result_Uuid,
        test.title,
        test.fullFile,
        test.file,
        test.beforeHooksCount,
        test.afterHooksCount,
        test.testsCount,
        test.suitesCount,
        test.passesCount,
        test.failuresCount,
        test.pendingCount,
        test.skippedCount,
        test.root,
        test.rootEmpty,
        test.timeout,
        test.parent_suite_uuid,
        test.test_full_title,
        test.timedOut,
        test.state,
        test.speed,
        test.fail,
        test.parentUUID,
        test.isHook,
        test.error
      ];

      // Append test result to CSV
      const csvLine = testResult.join(',') + '\n';
      fs.appendFileSync(outputPath, csvLine, (err) => {
        if (err) throw err;
      });
    });

    // On run end
    runner.on('end', () => {
      console.log('Test results have been written to CSV file.');
    });
  }
}

module.exports = CustomCSVReporter;
