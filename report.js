const cypress = require("cypress");
const marge = require("mochawesome-report-generator");
const { merge } = require("mochawesome-merge");
const fs = require("fs");
const path = require("path");

async function generateReport() {
    const timestamp = Date.now();

    // Ensure the merge-output directory exists
    const mergeOutputDir = "cypress/reports/merge-output";
    if (!fs.existsSync(mergeOutputDir)) {
        fs.mkdirSync(mergeOutputDir, { recursive: true });
    }

    // Folder for flattened json
    const flatJsonDir = "cypress/reports/flat_json";
    if (!fs.existsSync(flatJsonDir)) {
        fs.mkdirSync(flatJsonDir, { recursive: true });
    }

    const options = {
        files: ["cypress/reports/*.json"], // JSON files to merge
        reportDir: "cypress/reports/html"              // Directory for HTML report
    };

    try {
        const report = await merge(options); // Merge JSON files

        // Save merged JSON to the merge-output folder
        const mergedJsonPath = path.join(mergeOutputDir, `merged-report-${timestamp}.json`);
        fs.writeFileSync(mergedJsonPath, JSON.stringify(report, null, 2));
        console.log(`Merged JSON saved to ${mergedJsonPath}`);

        // Generate flattenned json from the merged report data
        const flatJsonData = generateCSV(report);

        // Save flattended json to the flatJsonDir folder
        const flatJsonPath = path.join(flatJsonDir, `report-${timestamp}.json`);
        fs.writeFileSync(flatJsonPath, flatJsonData);
        console.log(`Flattened json report saved to ${flatJsonPath}`);

    } catch (error) {
        console.error("Error generating report:", error);
    }
}

function generateCSV(data) {
    console.log(data);
    

    const csvData = { tests: [], suites: [] };

    const stats = {
        suites: data.stats.suites,
        tests: data.stats.tests,
        passes: data.stats.passes,
        pending: data.stats.pending,
        failures: data.stats.failures,
        start: data.stats.start,
        end: data.stats.end,
        duration: data.stats.duration,
        testsRegistered: data.stats.testsRegistered,
        passPercent: data.stats.passPercent,
        pendingPercent: data.stats.pendingPercent,
        other: data.stats.other,
        hasOther: data.stats.hasOther,
        skipped: data.stats.skipped,
        hasSkipped: data.stats.hasSkipped
    }

    data.results.forEach(results => {
        const resultsData = {
            ...stats,
            result_Uuid: results.uuid,
            title: results.title,
            fullFile: results.fullFile,
            file: results.file,
            beforeHooksCount: results.beforeHooks.length,
            afterHooksCount: results.afterHooks.length,
            testsCount: results.tests.length,
            suitesCount: results.suites.length,
            passesCount: results.passes.length, // uuids
            failuresCount: results.failures.length, // uuids
            pendingCount: results.pending.length,
            skippedCount: results.skipped.length,
            duration: results.duration,
            root: results.root,
            rootEmpty: results.rootEmpty,
            timeout: results._timeout
        }

        // Parent suites
        results.suites.forEach(suite => {

            const suitesData = {
                ...resultsData,
                parent_suite_uuid: suite.uuid,
                title: suite.title,
                fullFile: suite.fullFile,
                file: suite.file,
                beforeHooksCount: suite.beforeHooks.length,
                afterHooksCount: suite.afterHooks.length,
                duration: suite.duration,
                root: suite.root,
                rootEmpty: suite.rootEmpty,
                timeout: suite.timeout,
                skipped: suite.skipped.length,
                pending: suite.pending.length,
                failuresCount: suite.failures.length,
                passes: suite.passes.length,
            };

            // suites array
            suite.suites.forEach(suites => {

                const suitesArray = {
                    ...suitesData,
                    suite_uuid: suite.suuid,
                    title: suite.title,
                    fullFile: suite.fullFile,
                    file: suite.file,
                    beforeHooks: suite.beforeHooks.length,
                    afterHooks: suite.afterHooks.length,
                    failures: suite.failures.length,
                    pending: suite.pending.length,
                    skipped: suite.skipped.length,
                    duration: suite.duration,
                    root: suite.root,
                    rootEmpty: suite.rootEmpty,
                    timeout: suite._timeout,
                }

                suites.tests.forEach(test => {
                    const suiteTests = {
                        ...suitesArray,
                        test_title: test.title,
                        test_full_title: test.fullTitle,
                        test_timed_out: test.timedOut,
                        test_duration: test.duration,
                        test_state: test.state,
                        test_speed: test.speed,
                        test_pass: test.pass,
                        test_fail: test.fail,
                        test_pending: test.pending,
                        test_context: test.context,
                        test_code: test.code,
                        test_error: test?.err || null,
                        test_uuid: test.uuid,
                        test_parend_uuid: test.parentUUID,
                        test_isHook: test.isHook,
                        test_skipped: test.skipped,
                    }
                    csvData.tests.push(suiteTests);
                })
            })

            // tests array
            suite.tests.forEach(tests => {
                const testsArray = {
                    ...suitesData,
                    test_title: tests.title,
                    test_full_title: tests.fullFile,
                    timedOut: tests.timedOut,
                    duration: tests.duration,
                    state: tests.state,
                    speed: tests.speed,
                    pass: tests.pass,
                    fail: tests.fail,
                    pending: tests.pending,
                    context: tests.context,
                    code: tests.code,
                    test_uuid: tests.uuid,
                    parentUUID: tests.parentUUID,
                    isHook: tests.isHook,
                    skipped: tests.skipped,
                    error: tests.err?.message
                }

                csvData.suites.push(testsArray);
            })

        })
    })

    return csvData;
}

cypress.run().then(
    () => {
        generateReport(); // Call generateReport after Cypress tests complete
    },
    (error) => {
        generateReport(); // Generate report even if there is an error
        console.error("Cypress test run error:", error);
        process.exit(1);
    }
);
