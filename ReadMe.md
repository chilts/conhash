# ConHash

A fast consistent hashing (ring) implementation.

## Synopsis

```js
// import the Ring class
import Ring from './lib/ring.js'

// create a new ring with 64 vNodes per server, and a ring space of 2^^16
const ring = new Ring(64, 65536)

// before you can hash a key to a node you must add at least one server
ring.addNode('192.168.1.2:1234')
ring.addNode('192.168.1.3:1234')
ring.addNode('192.168.1.4:1234')

// hash a key to one node
const nodeAbc1 = ring.getNode('abc')
// -> 192.168.1.3:1234

// hash another key
const nodeSdf1 = ring.getNode('sdf')
// -> 192.168.1.4:1234

// you may add or remove nodes at will
// most keys will stay the same, only a percentage will change
ring.addNode('192.168.1.5:1234')

// when re-mapping we get the same node as earlier
const nodeAbc2 = ring.getNode('abc')
// -> 192.168.1.3:1234

// but when re-mapped, this key maps to a new node
const nodeSdf2 = ring.getNode('sdf')
// -> 192.168.1.5:1234

// you can also get multiple nodes instead of just one
// e.g. this would give 3 out of the above 4 nodes
const nodes = ring.getNodes('abc', 3)
// -> [ '192.168.1.3:1234', '192.168.1.2:1234', '192.168.1.5:1234']
```

Anything else you want to know?

## Author

* Andrew Chilton
* andychilton@gmail.com
* https://chilts.org/

## License

ISC.

(Ends)
