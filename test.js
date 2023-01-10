// local
import Ring from './lib/ring.js'

// constants
const keys = [ 'bob', 'joe', 'liz', 'zoe', 'abe', 'ian', 'may', 'kay', 'eve', 'ive' ]
// const keys = [ 'bob' ]
// const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('')

// setup
const ring = new Ring()

ring.addNode('redis-1.example.com')
// mapKeys(ring, keys)

ring.addNode('redis-2.example.com')
mapKeys(ring, keys)

// ring.delNode('redis-1.example.com')
// mapKeys(ring, keys)

function mapKeys(ring, keys) {
  for ( const key of keys ) {
    console.log(`node(${key}):`, ring.getNode(key))
  }
  console.log()
}

// okay, let's do an experiment and see how many buckets we get
ring.delNode('redis-1.example.com')
ring.delNode('redis-2.example.com')
ring.delNode('redis-3.example.com')
ring.addNode('date.example.com')
ring.addNode('kava.example.com')
ring.addNode('kola.example.com')
ring.addNode('lime.example.com')
ring.addNode('palm.example.com')
ring.addNode('pear.example.com')
ring.addNode('plum.example.com')
map()
ring.addNode('rimu.example.com')
// map()
ring.delNode('lime.example.com')
map()
ring.addNode('teak.example.com')
// map()
ring.delNode('kola.example.com')
map()
ring.addNode('coco.example.com')
// map()
ring.delNode('kava.example.com')
map()

function map() {
  const map = {}
  for ( let i = 0; i < 1000000; i++ ) {
    const name = String(Math.random())
    const node = ring.getNode(name)
    map[node] = map[node] ? map[node] + 1 : 1
  }
  console.log('map:', JSON.stringify(map, null, 2))
}

// remove one and remap, add a new one and remap
mapKeys(ring, keys)
ring.delNode('teak.example.com')
mapKeys(ring, keys)
ring.addNode('acer.example.com')
mapKeys(ring, keys)
