## Project Overview
Concerto is an API functional and performance testing framework that unifies Mocha-based functional testing with k6-based performance testing.   Its main goal is to eliminate the maintenance overhead of keeping functional and performance tests synchronized by automatically generating k6 configurations from existing functional tests.  The target audience includes developers and QA engineers who need to perform both functional and performance testing on APIs. 

## Architecture & Structure

### High-level Architecture Overview
Concerto operates as a Node.js CLI framework.  It integrates `mocha` for functional testing and `k6` for performance testing, with `axios` handling HTTP requests.  The framework automatically generates k6 performance test configurations from functional test client configurations. 

### Key Directories and their Purposes
When a new Concerto project is initialized using `concerto init`, it creates a specific directory structure: 
*   `.vscode/`: Contains debug configurations. 
*   `client-configs/`: Stores API client templates and generated k6 configurations. 
*   `helpers/k6/`: Contains utilities for k6, such as `k6-config-generator.js` and `k6-html-reporter.js`. 
*   `results/`: Holds report templates and generated test reports. 
*   `schemas/`: Contains validation schemas. 
*   `test/`: Stores sample tests and user-defined tests. 
*   Root files like `.env` and `package.json` are also copied for project configuration. 

### Main Components and how they interact
*   **CLI (`cli.js`)**: The command-line interface for interacting with Concerto, handling commands like `init`, `test`, `results`, and `create-k6-config`.  It uses `commander` for argument parsing. 
*   **Functional Testing Stack**: Uses `mocha` as the test runner  and `AxiosClient` (an `axios` wrapper) for HTTP requests.  `mochawesome` is used for HTML reporting. 
*   **Performance Testing Stack**: Leverages `k6` for load testing.  `xk6-dotenv` and `xk6-faker` are k6 extensions for environment support and data generation.  `k6-html-reporter` generates performance reports. 
*   **Test Configuration Layer**: `client-configs/*.js` files define API methods.  `helpers/k6/createK6Config.js` (aliased as `k6-config-generator.js` in `package.json`) is responsible for auto-generating k6 configurations from these functional test client configurations.  

### Data flow and system design
The `concerto` CLI orchestrates the testing workflow.  For combined testing, functional tests are executed first using `npm run test`.  Then, `concerto create-k6-config` is called, which uses `helpers/k6/createK6Config.js` to parse existing client configurations and generate `k6-config.js`.   Finally, performance tests are run using `npm run perf-test` with the generated k6 configuration.  Reports are generated for both functional and performance tests. 

## Development Setup

### Prerequisites and dependencies
To use Concerto, you need:
*   Node.js and npm. 
*   Docker (for building and running tests in Docker containers). 
*   k6.io. 
*   xk6-dotenv and xk6-faker (k6 extensions).  Building these extensions requires the Go toolchain, Git, and xk6.  Alternatively, you can build k6 extensions using the `xk6` Docker image. 

### Installation steps
1.  Install the `@yrstruely/concerto` npm package globally: `npm install -g @yrstruely/concerto`. 
2.  Create a project directory and navigate into it: `mkdir <project-dir>` then `cd <project-dir>`. 
3.  Initialize the Concerto project: `concerto init`.  This command copies necessary files from the installed npm package into your project directory. 
4.  Install project dependencies: `npm install`. 
5.  Build k6 with `xk6-dotenv` and `xk6-faker` extensions. The recommended approach is to use Docker: 
    *   Linux: `sudo docker run --rm -it -u "$(id -u):$(id -g)" -v "${PWD}:/xk6" grafana/xk6 build v0.44.1 --with github.com/szkiba/xk6-dotenv@v0.1.3 --with github.com/szkiba/xk6-faker@latest` 
    *   MacOS: `docker run --rm -e GOOS=darwin -u "$(id -u):$(id -g)" -v "${PWD}:/xk6" grafana/xk6 build v0.44.1 --with github.com/szkiba/xk6-dotenv@v0.1.3 --with github.com/szkiba/xk6-faker@latest` 
    *   Windows (PowerShell): `docker run --rm -e GOOS=windows -v "${PWD}:/xk6" grafana/xk6 build v0.44.1 --output k6.exe --with github.com/szkiba/xk6-dotenv@v0.1.3 --with github.com/szkiba/xk6-faker@latest` 
    *   You will need to replace the system `k6` executable with the newly created one. 

### Environment configuration
Concerto uses `.env` files for environment variables like API endpoints and credentials.  These variables are accessed using `process.env`. 

### How to run the project locally
*   **Run sample tests**: `concerto test` 
*   **View results**: `concerto results` 
*   **Using Docker Compose**: From your project directory, run `docker-compose -f docker-compose.yml up --build`. 
*   **Running functional tests only**: `concerto test functional` 
*   **Running performance tests only**: `concerto test performance` 

## Code Organization

### Coding standards and conventions
The codebase uses ES module syntax for imports and exports.  

### File naming patterns
*   Client configuration files follow the pattern `*-client-config.js`, e.g., `sample-client-config.js`. 
*   Test files are typically located in the `test/` folder and can be named with numerical prefixes for order, e.g., `1.test1.spec.js`. 

### Import/export patterns
Modules use `import` and `export` keywords. For example, `createK6Config` is imported from `helpers/k6/createK6Config.js` into `cli.js`.  Client configurations export functions and objects that define API methods. 

### Component structure
The core components are organized around the CLI, functional testing, performance testing, and test configuration layers, as described in the Architecture & Structure section.

## Key Features & Implementation

### Main features and how they're implemented
*   **Unified Functional and Performance Testing**: Concerto allows both functional and performance tests to share the same API client configurations.  Functional tests are written using `AxiosClient` (an `axios` wrapper) , and performance tests are generated from these configurations for `k6`. 
*   **Automatic k6 Configuration Generation**: The `concerto create-k6-config` command, implemented in `helpers/k6/createK6Config.js`, reads client configuration files (e.g., `sample-client-config.js`) and dynamically generates `k6-config.js`.  This generation process involves converting exported functions and objects from the client config into a format usable by k6. 
*   **Reporting**: Functional tests generate `mochawesome` HTML reports and JUnit XML reports.  Performance tests generate `k6-html-reporter` HTML reports and JUnit XML reports. 

### Important algorithms or business logic
The core logic for unifying tests lies in `helpers/k6/createK6Config.js`. This file reads the `*-client-config.js` file, identifies exported functions and objects, converts them to strings, and then writes them into a new `k6-config.js` file, combining them with `k6-imports-template.js` and `k6-exports-template.js`.  This ensures that the API methods defined for functional tests are directly available for use in k6 performance tests.

### API endpoints
API endpoints are defined within the client configuration files, such as `client-configs/sample-client-config.js`.  These configurations typically use environment variables (e.g., `process.env.JSON_PLACEHOLDER_BASE_URL`) to construct the full URI. 

## Testing Strategy

### Testing frameworks used
*   **Functional Testing

# Development Partnership and How We Should Partner

We build production code together. I handle implementation details while you guide architecture and catch complexity early.

## Core Workflow: Research → Plan → Implement → Validate

**Start every feature with:** "Let me research the codebase and create a plan before implementing."

1. **Research** - Understand existing patterns and architecture
2. **Plan** - Propose approach and verify with you
3. **Implement** - Build with tests and error handling
4. **Validate** - ALWAYS run formatters, linters, and tests after implementation

## Code Organization

**Keep functions small and focused:**
- If you need comments to explain sections, split into functions
- Group related functionality into clear packages
- Prefer many small files over few large ones

## Architecture Principles

**This is always a feature branch:**
- Delete old code completely - no deprecation needed
- No "removed code" or "added this line" comments - just do it

**Prefer explicit over implicit:**
- Clear function names over clever abstractions
- Obvious data flow over hidden magic
- Direct dependencies over service locators

## Maximize Efficiency

**Parallel operations:** Run multiple searches, reads, and greps in single messages
**Multiple agents:** Split complex tasks - one for tests, one for implementation
**Batch similar work:** Group related file edits together

## Problem Solving

**When stuck:** Stop. The simple solution is usually correct.

**When uncertain:** "Let me ultrathink about this architecture."

**When choosing:** "I see approach A (simple) vs B (flexible). Which do you prefer?"

Your redirects prevent over-engineering. When uncertain about implementation, stop and ask for guidance.

## Testing Strategy

**Match testing approach to code complexity:**
- Complex business logic: Write tests first (TDD)
- Simple CRUD operations: Write code first, then tests
- Hot paths: Add benchmarks after implementation

**Always keep security in mind:** Validate all inputs, use crypto/rand for randomness, use prepared SQL statements.

**Performance rule:** Measure before optimizing. No guessing.

## Progress Tracking

- **Use Todo lists** for task management
- **Clear naming** in all code

Focus on maintainable solutions over clever abstractions.

---
Generated using [Sidekick Dev]({REPO_URL}), your coding agent sidekick.
[byterover-mcp]

# important 
always use byterover-retrieve-knowledge tool to get the related context before any tasks 
always use byterover-store-knowledge to store all the critical informations after sucessful tasks