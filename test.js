// local
import Ring from './lib/ring.js'

// constants
const keys = [ 'bob', 'joe', 'liz', 'zoe', 'abe', 'ian', 'may', 'kay', 'eve', 'ive' ]
// const keys = [ 'bob' ]
// const keys = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.split('')

// setup
const ring = new Ring(256)

ring.addServer('redis-1.chilts.me')
// mapKeys(ring, keys)

ring.addServer('redis-2.chilts.me')
mapKeys(ring, keys)

// ring.delServer('redis-1.chilts.me')
// mapKeys(ring, keys)

function mapKeys(ring, keys) {
  for ( const key of keys ) {
    console.log(`server(${key}):`, ring.getServerForKey(key))
  }
  console.log()
}

// okay, let's do an experiment and see how many buckets we get
ring.delServer('redis-1.chilts.me')
ring.delServer('redis-2.chilts.me')
ring.delServer('redis-3.chilts.me')
ring.addServer('andy.chilts.me')
ring.addServer('babe.chilts.me')
ring.addServer('chuk.chilts.me')
ring.addServer('dann.chilts.me')
ring.addServer('evan.chilts.me')
ring.addServer('fred.chilts.me')
ring.addServer('gerd.chilts.me')
map()
ring.addServer('jack.chilts.me')
// map()
ring.delServer('chuk.chilts.me')
map()
ring.addServer('john.chilts.me')
// map()
ring.delServer('evan.chilts.me')
map()
ring.addServer('hugh.chilts.me')
// map()
ring.delServer('evan.chilts.me')
map()

function map() {
  const map = {}
  for ( let i = 0; i < 100000; i++ ) {
    const name = String(Math.random())
    const server = ring.getServerForKey(name)
    map[server] = map[server] ? map[server] + 1 : 1
  }
  console.log('map:', JSON.stringify(map, null, 2))
}

// remove one and remap, add a new one and remap
mapKeys(ring, keys)
ring.delServer('andy.chilts.me')
mapKeys(ring, keys)
ring.addServer('brit.chilts.me')
mapKeys(ring, keys)
