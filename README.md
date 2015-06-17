# metalsmith-grep

> A Metalsmith plugin for performing text search and replace in source files

This plugin allows for specifying a list of pairs of search/replace operations
to perform during a Metalsmith build. This can be used to fix common typos,
censor NSFW text, hide sensitive information, etc.

## Install

This is not on NPM. For the time being, I use `npm link` to use in projects.

## Usage

The plugin requires an object with a key called "subs", containing an array of substition objects with keys for "search" and "replace".

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

You can pass either an object directly, a path to a YAML file, or a function that returns an object.

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

### Passing a YAML file

YAML file
```yaml
subs:
  - search: teh
    replace: the
```

Javascript
```javascript
var Metalsmith = require('metalsmith');
var grep = require('metalsmith-grep');

Metalsmith(__dirname)
    .use(grep('path/to/subs.yaml'))
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

## License

MIT © [Anthony Castle](http://github.com/mrajo)
