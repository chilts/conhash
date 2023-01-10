// npm
import test from 'tape'

// local
import Ring from '../lib/ring.js'

test('Check approx distribution', t => {
  t.plan(2)

  // setup (one million tests)
  const iterations = 100_000

  // two nodes to check
  const node1 = '127.0.0.1:1234'
  const node2 = '127.0.0.1:5678'

  const ring = new Ring()
  ring.addNode(node1)
  ring.addNode(node2)

  // no matter how many keys we add, we should always map to these two nodes
  const map = {
    [node1]: 0,
    [node2]: 0,
  }
  for ( let i = 0; i < iterations; i++ ) {
    const n = ring.getNode(String(Math.random()))
    map[n] += 1
  }

  const lower = iterations * 0.4
  const upper = iterations * 0.6
  t.ok(map[node1] > lower && map[node1] < upper, 'node1 gets its fair share')
  t.ok(map[node2] > lower && map[node2] < upper, 'node2 gets its fair share')

  t.end()
})

test('Check approx distribution', t => {
  // setup (one million tests)
  const iterations = 1_000_000
  const nodes = [ 'bob', 'joe', 'eva', 'ava', 'liz', 'tom', 'bet', 'ian', 'guy' ]
  const map = {}
  t.plan(nodes.length)

  const ring = new Ring()
  for ( const node of nodes ) {
    const randomName = node + '-' + String(Math.random()).substr(2)
    ring.addNode(randomName)
    map[randomName] = 0
  }

  for ( let i = 0; i < iterations; i++ ) {
    const n = ring.getNode(String(Math.random()))
    map[n] += 1
  }
  console.log('map:', map)

  // a range around 11% (i.e. 100% / 9)
  const lower = iterations * 0.075 // 7.5%
  const upper = iterations * 0.145 // 15.5%
  for ( const node of Object.keys(map) ) {
    t.ok(map[node] > lower && map[node] < upper, `node ${node} gets its fair share`)
  }

  t.end()
})
