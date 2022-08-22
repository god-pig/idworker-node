# idworker-node

## Install

```shell
npm install idworker
```

## Usage

```javascript
const { DefaultIdentifierGenerator } = require('idworker')
const generator = new DefaultIdentifierGenerator()
const uuid = generator.nextUUID()
console.log(uuid)
// d3066fbd-73b4-408b-86b8-de45ae0b7b92
const id = generator.nextId()
console.log(id)
// 1561629177826164737
```
