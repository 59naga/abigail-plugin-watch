Abigail Watch Plugin
---

<p align="right">
  <a href="https://npmjs.org/package/abigail-plugin-watch">
    <img src="https://img.shields.io/npm/v/abigail-plugin-watch.svg?style=flat-square">
  </a>
  <a href="https://travis-ci.org/abigailjs/abigail-plugin-watch">
    <img src="http://img.shields.io/travis/abigailjs/abigail-plugin-watch.svg?style=flat-square">
  </a>
  <a href="https://codeclimate.com/github/abigailjs/abigail-plugin-watch/coverage">
    <img src="https://img.shields.io/codeclimate/github/abigailjs/abigail-plugin-watch.svg?style=flat-square">
  </a>
  <a href="https://codeclimate.com/github/abigailjs/abigail-plugin-watch">
    <img src="https://img.shields.io/codeclimate/coverage/github/abigailjs/abigail-plugin-watch.svg?style=flat-square">
  </a>
  <a href="https://gemnasium.com/abigailjs/abigail-plugin-watch">
    <img src="https://img.shields.io/gemnasium/abigailjs/abigail-plugin-watch.svg?style=flat-square">
  </a>
</p>

No installation
---
> abigail built-in plugin

Usage
---
if specify the separated glob with a comma, change the target.

```bash
abby test --watch "*.jsx,src/**/*.jsx,test/**/*.jsx"
# ...
# +    1 ms @_@ ... watch at *.jsx, src/**/*.jsx, test/**/*.jsx.
```

if disable only this plugin(use `--no-watch` option), run only once the task.

```bash
abby test --no-watch && echo pass || echo fail
# ...
# +  2.3  s @_@ task end test. exit code 0.
# +    1 ms @_@ cheers for good work.
# pass
```

if specify in the abigail field of your package.json:

```json
{
  "name": "need-single-run",
  "scripts": {
    "test": "ava"
  },
  "abigail": {
    "plugins": {
      "watch": false
    }
  }
}
```

```json
{
  "name": "use-jsx",
  "scripts": {
    "test": "ava"
  },
  "abigail": {
    "plugins": {
      "watch": "*.jsx,src/**/*.jsx,test/**/*.jsx"
    }
  }
}
```

See also
---
* [abigailjs/abigail](https://github.com/abigailjs/abigail#usage)
* [abigailjs/abigail-plugin](https://github.com/abigailjs/abigail-plugin#usage)

Development
---
Requirement global
* NodeJS v5.7.0
* Npm v3.7.1

```bash
git clone https://github.com/abigailjs/abigail-plugin-watch
cd abigail-plugin-watch
npm install

npm test
```

License
---
[MIT](http://abigailjs.mit-license.org/)
