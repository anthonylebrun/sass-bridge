# SaasBridge (WIP)

SaasBridge helps you write [sass functions](https://github.com/sass/node-sass#functions--v300---experimental) by defining conventions around and handling Sass <-> JavaScript type conversion for you.

## Example

Here's how you might write a function without SaasBridge:

`webpack.config.js`:
```js
WRITE EXAMPLE WITH SASS LOADER HERE
```

And here's how it looks with SassBridge:

`webpack.config.js`:
```js
WRITE EXAMPLE WITH SASS LOADER HERE
```

## Sass -> JavaScript Type Casting

### Transparent types

Some types are similar between Sass and JavaScript, and type conversion for the following is automatic:

#### Booleans
Sass booleans will convert to JS booleans

#### Strings
Sass strings will convert to JS strings

#### Lists
Sass lists will convert to JS arrays

### Special types

Some types don't quite map 1-1 or have edge cases / limitations that you need to be aware of. 

#### Maps
Sass maps will convert to a something with a[Map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map)-like interface rather than a plain object. You will need to use the `myMap.get('key')` and `myMap.set('key', value)` methods to change manipulate this object.

#### Numbers
Sass numbers don't map 1-1 to JS numbers because in Sass/CSS there is the concept of unit (px, rem, em, fr, etc.). Numbers are represented in a JSON format. For example, `10px` would be converted to:

```js
{
  denominatorUnits: [],
  numeratorUnits: ["px"],
  value: 10
}
```

#### Colors
Sass colors, whether they were specified in hex, rgb, hsl, etc. format in your Sass code, will be returned as an JSON formatted RGBA object. So `#ffffff` would be converted to:

```js
{
  R: 255,
  G: 255,
  B: 255,
  A: 1
}
```

## JavaScript -> Sass Type Casting

As far I as I know, this just works. Values like '#fefefe' and '12px' are valid and SaasBridge will infer that you meant a color and number with a pixel unit. The [Special Types](#special-types) listed above will also convert back to their respective sass types. Please submit an issue if you encounter any problems with this or need some clarification.