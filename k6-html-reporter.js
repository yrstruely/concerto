const reporter = require('k6-html-reporter');

const options = {
        jsonFile: './results/performance/summary.json',
        output: './results/performance/k6-html-reporter.html',
    };

reporter.generateSummaryReport(options);