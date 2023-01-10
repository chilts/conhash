// npm
import test from 'tape'

// local
import Ring from '../lib/ring.js'

test('New Ring with One Node', t => {
  t.plan(1)

  // setup (one million tests)
  const iterations = 1_000_000

  // just one node for this test
  const node = '127.0.0.1:1234'

  const ring = new Ring()
  ring.addNode(node)

  // no matter how many keys we add, we should always map to this single node
  let ok = true
  for ( let i = 0; i < iterations; i++ ) {
    const n = ring.getNode(Math.random())
    if ( n !== node ) {
      ok = false
    }
  }
  t.ok(ok, 'All random iterations map to the only node we have')

  t.end()
})

test('New Ring with Two Nodes', t => {
  t.plan(1)

  // setup (one million tests)
  const iterations = 1_000_000

  // just one node for this test
  const node1 = '127.0.0.1:1234'
  const node2 = '127.0.0.1:5678'

  const ring = new Ring()
  ring.addNode(node1)
  ring.addNode(node2)

  // no matter how many keys we add, we should always map to this single node
  let ok = true
  for ( let i = 0; i < iterations; i++ ) {
    const n = ring.getNode(String(Math.random()))
    if ( n !== node1 && n !== node2 ) {
      ok = false
    }
  }
  t.ok(ok, 'All random iterations map to one of the nodes (and not crash)')

  t.end()
})
