# metalsmith-grep [![Build Status](https://travis-ci.org/mrajo/metalsmith-grep.svg)](https://travis-ci.org/mrajo/metalsmith-grep)

> A Metalsmith plugin for performing text search and replace in source files

This plugin allows for specifying a list of pairs of search/replace operations
to perform during a Metalsmith build. This can be used to fix common typos,
censor NSFW text, hide sensitive information, etc.

## Install

```
npm install metalsmith-grep
```

## Usage

The plugin requires an object with a key called "subs", containing an array of substition objects with keys for "search" and "replace". Search terms are case-insensitive.

### Example
```javascript
{
  subs: [
    {
      search: "some text or simple pattern",
      replace: "the replacement text"
    },
    {
      search: "more text",
      replace: "another replacement"
    }
    ...
  ]
}
```

You can pass either an object directly, a path to a JSON or YAML file, or a function that returns an object.

### Passing an object

```javascript
var Metalsmith = require('metalsmith');
var grep = require('metalsmith-grep');

Metalsmith(__dirname)
    .use(grep({
        subs: [
            {
                search: 'teh',
                replace: 'the'
            }
        ]
    }))
    .build();
```

### Passing a file

YAML file must end with extension `.yaml` or `.yml`.
```yaml
subs:
  - search: teh
    replace: the
```

JSON file must end with extension `.json`.
```json
{
    "subs": [
        {
            "search": "teh",
            "replace": "the"
        }
    ]
}
```

Javascript
```javascript
var Metalsmith = require('metalsmith');
var grep = require('metalsmith-grep');

// YAML
Metalsmith(__dirname)
    .use(grep('path/to/subs.yaml'))
    .build();

// JSON
Metalsmith(__dirname)
    .use(grep('path/to/subs.json'))
    .build();
```

### Passing a function

```javascript
var Metalsmith = require('metalsmith');
var grep = require('metalsmith-grep');

function makeSubs() {
  // do stuff
  return {
      subs: [
          {
              search: 'teh',
              replace: 'the'
          }
      ]
  };
}

Metalsmith(__dirname)
    .use(grep(makeSubs))
    .build();
```

## Bypassing grep
To allow a word to bypass replacement (such as homonyms or other instances of words changing meaning with context), surround it with vertical pipes in your source, like `|word|`. For example:

#### Original source
```
There once was a man named Bob who liked to bob for apples.
```

#### Javascript
```
Metalsmith(__dirname)
    .use(grep({
        subs: [
            {
                search: 'bob',
                replace: 'Paul'
            }
        ]
    }))
    .build();
```

#### Bad output; we don't want to replace the second instance of "bob"
```
There once was a man named Paul who liked to Paul for apples.
```

#### Modified source
```
There once was a man named Bob who liked to |bob| for apples.
```

#### New output
```
There once was a man named Paul who liked to bob for apples.
```

## License

MIT © [Anthony Castle](http://github.com/mrajo)
