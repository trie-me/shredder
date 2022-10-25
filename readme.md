# Shredder

A scraper using puppeteer and node

## Usage

Build

```bash
npm i
npm run build
```

Run

```bash
# from dist folder or deployment dir containing build output.
# ESM arg is mandatory

node --es-module-specifier-resolution=node index /path/to/config/file.json
```

## Configuration

### Example data

Example file can be found in
`{project root}/test-data/text-data-config.json`

### Output Configuration

The following can be set in the configuration root to configure outputs.

```json
  "writeToConsole": true, //enable console sink
  "writeToFile": true, // enable file sink
  "outfile": "./dist/job-output.jsonl", // specify file sink output, requred to use file sink
```

## Debug

### IDE

- Debug configurations are included for jetbrains IDEs/webstorm in the runConfigurations dir.

- Debug will execute a breakpoint-enabled session using the configuration file in test-data

### Browser

The headless flag can be toggled to false in the application to show the browser during a run. This requires a full or debug browser with shell installed and a desktop environment to work.

#### DO NOT USE THIS IN PRODUCTION.

```json
  "headless": true,
```

