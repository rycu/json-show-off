# json-show-off 🕺
![gzipped size](https://img.shields.io/bundlephobia/minzip/react.svg)   ![dependencies](https://img.shields.io/badge/dependencies-0-green.svg)   [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)



## Generate self sufficient html table snippets from json objects

It turns out that not everybody enjoys trawling thorough json as a way of absorbing data.

json-show-off takes a json object and returns nested html tables with some sugar. 

## Installation
```sh
npm install json-show-off --save
```
or
```sh
yarn add json-show-off
```

## Usage

```js
import showOff from "json-show-off";

jsonObject = {key: value};

showOff(jsonObject);
```

## Style Overrides

```js
jsonObject = {key: value};

customStyles = {
  table: `
    border-collapse: collapse; 
    color:pink;
    text-align:centre; 
    padding:10px;`
}

showOff(jsonObject, customStyles);
```

### Default Styles
Any off this keys below can be overridden with valid css 
```js
{
  details: "text-indent:6px; font-family: Arial;",
  table: "border-collapse: collapse; color:white; text-align:left; padding:6px;",
  column: "border:1px solid #555; padding:10px;",
  header: "border:1px solid #555; padding:10px; font-weight:bold;",
  caption: "font-size:smaller; text-align:centre; padding:4px 0; color:white",
  captionPrefix: "color:#5ECBEE; font-style:italic",
  captionSuffix: "color:#A9E023",
  key: "text-align:right; font-weight:bold; color:white;",
  object: "background-color:#222;",
  array: "background-color:#2F2F2F;",
  string: "color:#FBF670;",
  number: "color:#AD83FE;",
  true: "color:#AD83FE;",
  false: "color:#AD83FE;"
}
```

## Setting Overrides

```js
jsonObject = {key: value};

customSettings = {
  expandOnLoad: false
}

showOff(jsonObject, null, customSettings);
```

### Default Settings
```js
{
  expandOnLoad: true,
  horizontalArrayView: true
}
```
## Example

```js
import showOff from "json-show-off";

jsonObject =  {
  name: "Can",
  formed: 1968,
  active: false,
  albums: [
    {
      name: "Ege Bamyasi",
      year: 1972,
      personnel: {
        musicians: [
          { name: "Holger Czukay", role: "bass" },
          { name: "Michael Karoli", role: "guitar" },
          { name: "Jaki Liebezeit", role: "drums" },
          { name: "Irmin Schmidt", role: "keyboards" },
          { name: "Damo Suzuki", role: "vocals" }
        ],
        production: [
          { name: "Holger Czukay", role: "engineering / editing" },
          { name: "Ingo Trauer", role: "artwork" },
          { name: "Richard J. Rudow", role: "design" }
        ]
      },
      singles: [
        { name: "Spoon", year: 1971 },
        { name: "Vitamin C", year: 1972 }
      ]
    }
  ]
};

document.write(showOff(showOff));
```

### Rendered Output

![Example of Rendered Output](../assets/renderedOutputExample.png?raw=true)

## License

json-show-off is licensed as MIT.