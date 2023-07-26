#!/usr/bin/env node

import { createK6Config } from './helpers/k6/createK6Config.js';
import { generateSummaryReport } from 'k6-html-reporter';
import { Command } from 'commander';
import { spawnSync } from 'child_process';
import globSync from 'glob'
import fs from 'fs-extra';


const program = new Command();

program
    .name('concerto')
    .description('Automated API functional and performance testing living together in perfect harmony!')
    .version(process.versions.concerto)

program
    .command('init')
    .description('Initialize new concerto project in the current working directory')
    .action(() => {
        let concertoNpmRootDir
        const concertoNpmProjectRootDir = `${process.cwd()}/node_modules/@yrstruely/concerto/`
        const concertoNpmGlobalRootDir = `${spawnShellCommand('npm root -g', { stdio: 'pipe', shell: true }).stdout.toString().trim()}/@yrstruely/concerto/`

        if (fs.existsSync(concertoNpmGlobalRootDir)) {
            concertoNpmRootDir = concertoNpmGlobalRootDir
        } else if (fs.existsSync(concertoNpmProjectRootDir)) {
            concertoNpmRootDir = concertoNpmProjectRootDir
            console.warn('Warning: to get the best from concerto, it should be installed globally e.g. > npm install -g @yrstruely/concerto')
        } else {
            throw new Error('Error: concerto npm package not found! Please install with > npm install -g @yrstruely/concerto')
        }

        const globsToCopy = [
            { pattern: '.vscode/**/*.json', options: { cwd: `${concertoNpmRootDir}`, nodir: true, dot: true } },
            { pattern: 'client-configs/**/*.js', options: { cwd: `${concertoNpmRootDir}`, nodir: true, dot: true, ignore: 'client-configs/*client.js' } },
            { pattern: 'helpers/k6/k6-config-generator.js', options: { cwd: `${concertoNpmRootDir}`, nodir: true, dot: true } },
            { pattern: 'helpers/k6/k6-html-reporter.js', options: { cwd: `${concertoNpmRootDir}`, nodir: true, dot: true } },
            { pattern: 'results/**/*', options: { cwd: `${concertoNpmRootDir}`, nodir: true, dot: true } },
            { pattern: 'schemas/**/*', options: { cwd: `${concertoNpmRootDir}`, nodir: true, dot: true } },
            { pattern: 'test/**/*', options: { cwd: `${concertoNpmRootDir}`, nodir: true, dot: true } },
            { pattern: './*', options: { cwd: `${concertoNpmRootDir}`, nodir: true, dot: true, ignore: ['./*.js', './build.sh'] } }
        ]

        globsToCopy.forEach(glob => {
            globSync(glob.pattern, glob.options, (err, files) => {
                if (err) {
                    console.error(err);
                    return;
                }
                files.forEach(file => {
                    const sourceFilePath = `${concertoNpmRootDir.replace(/\\/g, '/')}${file.replace(/\\/g, '/').replace('./', '')}`
                    const fileAsArray = file.replace('./', '').split('/')
                    const targetPath = `${process.cwd().replace(/\\/g, '/')}/${fileAsArray.slice(0, fileAsArray.length - 1).join('/')}/${fileAsArray[fileAsArray.length - 1]}`

                    fs.copy(sourceFilePath, targetPath, { overwrite: true }, err => {
                        if (err) {
                            console.error(err);
                        }
                    });
                });
            });
        })

        if (fs.existsSync(`${process.cwd()}/gitignore`)) {
            fs.renameSync(`${process.cwd()}/.gitignore`, `${process.cwd()}/gitignore`)
        }
    })

program
    .command('test')
    .description('Runs your tests')
    .argument('[type]', 'The type of tests to run: functional, performance. If no type is provided, all test types are run')
    .option('-m, --manual-performance-tests', 'Don\'t automatically generate performance tests from your existing functional tests')
    .option('-d, --debug', 'Adds aditional debug output while running performance tests')
    .action((type, options) => {
        const spawnOpts = {
            stdio: 'inherit',
            shell: true
        }
        switch (type) {
            case 'functional':
                spawnShellCommand('npm run test', spawnOpts)
                break;

            case 'performance':
                options.manualK6Tests ? undefined : spawnShellCommand('concerto create-k6-config', spawnOpts)
                options.debug ? spawnShellCommand('npm run perf-test-local', spawnOpts) : spawnShellCommand('npm run perf-test', spawnOpts)
                generateK6Report()
                break;

            default:
                spawnShellCommand('npm run test')
                options.manualK6Tests ? undefined : spawnShellCommand('concerto create-k6-config', spawnOpts)
                options.debug ? spawnShellCommand('npm run perf-test-local', spawnOpts) : spawnShellCommand('npm run perf-test', spawnOpts)
                generateK6Report()
                break;
        }
    });

program
    .command('results')
    .description('Displays the test results')
    .argument('[type]', 'The type of test results to display: functional, performance. If no type is provided, all test types are run')
    .option('-h, --html', 'Display the HTML test results in a browser (default)')
    .option('-j, --junit', 'Display the JUnit test results in the terminal')
    .action((type, options) => {
        const platform = process.platform
        let commands
        let fileFunctional
        let filePerformance
        switch (platform) {
            case 'linux':
            case 'freebsd':
            case 'openbsd':
            case 'sunos':
                commands = ['xdg-open', 'sensible-browser', 'firefox', 'google-chrome', 'brave-bin', 'vivaldi', 'more']
                fileFunctional = 'index.html'
                filePerformance = 'report.html'
                break;
            case 'darwin':
                commands = ['open', 'more']
                fileFunctional = 'index.html'
                filePerformance = 'report.html'
                break;
            case 'win32':
                commands = ['start', 'more']
                fileFunctional = 'index.html'
                filePerformance = 'report.html'
                break;
            default:
                commands = ['more']
                fileFunctional = 'index.json'
                filePerformance = 'junit.xml'
                break;
        }
        const spawnOpts = {
            stdio: 'inherit',
            shell: true
        }
        switch (type) {
            case 'functional':
                try {
                    options.junit ? spawnShellCommand('more ./results/integration/junit.xml', spawnOpts) : spawnShellCommandsList(commands, `<command> ./results/integration/${fileFunctional}`, spawnOpts)
                } catch (error) {
                    console.error(error)
                }
                break;
            case 'performance':
                try {
                    options.junit ? spawnShellCommand('more ./results/performance/junit.xml', spawnOpts) : spawnShellCommandsList(commands, `<command> ./results/performance/k6-html-report/${filePerformance}`, spawnOpts)
                } catch (error) {
                    console.error(error)
                }
                break;
            default:
                try {
                    options.junit ? spawnShellCommand('more ./results/integration/junit.xml', spawnOpts) : spawnShellCommandsList(commands, `<command> ./results/integration/${fileFunctional}`, spawnOpts)
                    options.junit ? spawnShellCommand('more ./results/performance/junit.xml', spawnOpts) : spawnShellCommandsList(commands, `<command> ./results/performance/k6-html-report/${filePerformance}`, spawnOpts)
                } catch (error) {
                    console.error(error)
                }
                break;
        }
    });

program
    .command('create-k6-config')
    .description('Build the k6 configuration file based on the functional tests')
    .action(() => {
        createK6Config()
    });

program.parse()


function spawnShellCommand(cmd, spawnOpts) {

    const splitCmd = cmd.split(' ')
    const command = splitCmd[0]
    splitCmd.splice(0, 1)
    const args = splitCmd

    return spawnSync(command, args, spawnOpts)
}

function spawnShellCommandsList(cmdList, cmdPattern, spawnOpts) {
    let response
    let found = false
    cmdList.forEach(command => {
        if (!found) {
            response = spawnShellCommand(cmdPattern.replace('<command>', command), spawnOpts)
            if (response.status === 0) {
                found = true
            }
        }
        return response
    })
}

function generateK6Report() {
    generateSummaryReport({
        jsonFile: './results/performance/summary.json',
        output: './results/performance/k6-html-report',
    });
}
