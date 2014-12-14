# Yielded Http Request

## Sample usage:

```javascript
var get = require('yhr/get'),
    walk = require('vz.walk');

walk(function*(){
  var data = yield get('https://www.gravatar.com/manvalls.json');
  
  // data.entry[0].displayName == 'manvalls'
});
```

## Standards

- [Encoding](https://encoding.spec.whatwg.org/)
- [XMLHttpRequest](https://xhr.spec.whatwg.org/)
- [ECMAScript 6](http://people.mozilla.org/~jorendorff/es6-draft.html)
