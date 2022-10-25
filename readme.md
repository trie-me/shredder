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

### tl;dr Example Configuration

An Example file can be found in
`{project root}/test-data/text-data-config.json`

### Output Configuration

The following can be set in the configuration root to configure outputs.

```json
  "writeToConsole": true, //enable console sink
  "writeToFile": true, // enable file sink
  "outfile": "./dist/job-output.jsonl", // specify file sink output, requred to use file sink
```

### Jobs

A job represents a single parallel request of a resource given a uri.

Each job contains a series of Tasks that will execute once the uri resource has been loaded and javascript has executed in the given request session.

#### Example Job Configuration

```json
{
  "writeToConsole": true,
  "writeToFile": true,
  "outfile": "./dist/ford-output.jsonl",
  "headless": true,
  "jobs": [
    {
      "uri": "https://some.uri/that/is/html",
      "tasks": []
    }
  ]
}
```

### Tasks

A task is a collected series of FieldAnalysis objects that define individual points of data to be collected given a selector.

The following task defines 2 analyses that will retrieve a given selector and its value.

```json
"tasks": [
  {
    "name": "Task name", "analyses": [
      {"fieldName": "name", "selector": "h2.ProductTile__Header-sc-8r7rba-0.gxihyh"},
      {"fieldName": "price", "isNumeric": true, "selector": "span.Attributes__AttributePrefixSuffix-m3qu0l-1.Attributes__AttributeValue-m3qu0l-4.MgUmT", "valueAtIndex": 0, "transforms": ["currency"]}
    ]
  }]
```

#### Selector Evaluation

A field analysis by default will retrieve an array of nodes. In the event that a selector returns more than 1, the 0th index value will be selected by default. It is recommended whenever possible to use a highly specific selector.

If the value in question is at a known ordinal position, the `valueAtIndex` property can be set to identify the value to retrieve.

```json
{"fieldName": "price", "isNumeric": true, "selector": "span.Attributes", "valueAtIndex": 4, "transforms": ["currency"]}
```

### Transforms

At this point in time, the framework supports a limited number of value transforms that can be used for cleaning. They are identified by supplying an array of strings to the `transforms` property in the field analysis configuration.

```json
{"fieldName": "price" ... "transforms": ["currency"]}
```

#### Task Output Modes

Tasks can be configured to output field values either as merged fields in an object, or as an array of results.

- Use object mode when field names are unique per task
- Use list mode when you need to have multiple field keys of the same name.

> Note: List most produces a well-known result property in the resulting data which is an array of T

#### Task List output mode example

> Example Task config

```json
"tasks": [
  {
    "emitArray": true,
    "name": "paint-color-scan", "analyses": [
      {"fieldName": "color", "data": { "group": "black"}, "selector": "p.option-selection-items__OptionItemSimpleTitle-sc-1us76sp-4.bUeXsp", "valueAtIndex": 0},
      {"fieldName": "price", "data": { "group": "black"},"isNumeric": true, "selector": "span.Attributes__AttributePrefixSuffix-m3qu0l-1.Attributes__AttributeValue-m3qu0l-4.gNyXcO", "valueAtIndex": 0, "transforms": ["currency"]},
      {"fieldName": "color", "data": { "group": "grey"}, "selector": "p.option-selection-items__OptionItemSimpleTitle-sc-1us76sp-4.bUeXsp", "valueAtIndex": 1},
      {"fieldName": "price", "data": { "group": "grey"}, "isNumeric": true, "selector": "span.Attributes__AttributePrefixSuffix-m3qu0l-1.Attributes__AttributeValue-m3qu0l-4.gNyXcO", "valueAtIndex": 1, "transforms": ["currency"]}
    ]
  }]
```

> Example output

```json
{
    "job-id": "...",
    "taskName": "paint-color-scan",
    "result": [
        {
            "group": "black",
            "color": "Absolute Black"
        },
        {
            "group": "black",
            "price": "0"
        },
        {
            "group": "grey",
            "color": "Space White"
        },
        {
            "group": "grey",
            "price": "800"
        }
    ]
}
```

### Data properties

Data properties are framework specific objects of containing arbitrary string keys and numeric or string values that will be merged into their respective output objects. These are useful for supplying job-contextual data such as group identifiers, keys, enrichment data, well-known identifiers and more.

The following configuration objects support data properties:

- Jobs
- Tasks
- Field Analyses

Example:

```json
{
  ...
  "jobs": [
    {
      ...
      "data": { "id": "some value"},
      "tasks": [
        {
          "data": {"task-identifier": "some other value"},
          ...,
          "analyses": [
            {... "data": {"group": "yet another value"}}
          ]
        }
      ]
    }
  ]
}
```

## Debug

### IDE

- Debug configurations are included for jetbrains IDEs/webstorm in the runConfigurations dir.

- Debug will execute a breakpoint-enabled session using the configuration file in test-data

### Browser

The headless flag can be toggled to false in the application to show the browser during a run. This requires a full or debug browser with shell installed and a desktop environment to work.

#### DO NOT USE THIS IN PRODUCTION.

```json
  "headless": false,
```

