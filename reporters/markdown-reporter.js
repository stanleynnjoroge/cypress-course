const fs = require('fs');
const path = require('path');
const Mocha = require('mocha');
const { Base } = Mocha.reporters;

class MarkdownReporter extends Base {
    constructor(runner) {
        super(runner);

        const outputPath = path.join(__dirname, '../cypress/reports/results.md');

        const markdownHeader = '# Test Results\n\n| Test Title | Status | Duration (ms) | Error Message |\n|------------|--------|----------------|----------------|\n';
        fs.writeFileSync(outputPath, markdownHeader);

        runner.on('test end', (test) => {
            const testResult = [
                `| ${test.title} |`,
                ` ${test.state || 'skipped'} |`,
                ` ${test.duration || 0} |`,
                test.err ? ` "${test.err.message.replace(/\n/g, '')}" |` : ' |'
            ];

            const markdownLine = testResult.join('') + '\n';
            fs.appendFileSync(outputPath, markdownLine);
        });

        runner.on('end', () => {
            console.log('Markdown report has been written to:', outputPath);
        });
    }
}

module.exports = MarkdownReporter;
