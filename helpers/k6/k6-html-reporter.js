import {generateSummaryReport} from 'k6-html-reporter';

const k6HtmlReporterOptions = {
    jsonFile: './results/performance/summary.json',
    output: './results/performance/k6-html-report',
};

generateSummaryReport(k6HtmlReporterOptions);
