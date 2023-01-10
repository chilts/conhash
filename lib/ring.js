// npm
import murmurhash from 'murmurhash'

export default class Ring {
  constructor(vNodesPerNode, totalBuckets) {
    vNodesPerNode ||= 64
    totalBuckets ||= Math.pow(2, 16)

    this.buckets = vNodesPerNode
    this.totalBuckets = totalBuckets
    this.node = {}
    this.ring = []
    // this.rehash()
  }

  addNode(name) {
    this.node[name] = true

    this.rehash()
  }

  delNode(name) {
    delete this.node[name]
    this.rehash()
  }

  hash(str) {
    return murmurhash.v3(str) % this.totalBuckets
  }

  getNode(key) {
    if ( this.ring.length === 0 ) {
      throw new Error("Program Error: can't map a key until nodes have been added")
    }

    // const hash = murmurhash.v3(key)
    const hash = this.hash(key)
    // console.log(`getNode(${key}):`, hash)

    // okay, let's find the next node
    let found = null
    for ( const node of this.ring ) {
      // console.log(node)
      // console.log('Checking      hash:', hash)
      // console.log('Checking node.hash:', node.hash)
      // console.log('Checking   compare:', hash < node.hash)
      if ( !found && hash < node.hash ) {
        // console.log('less')
        found = node
      }
      else {
        // console.log('more')
      }
    }
    if ( !found ) {
      // console.log('BREAKING!!!')
      // throw new Error('sdf')
      found = this.ring[0]
    }

    return found.node
  }

  getNodes(key, count) {
    if ( this.ring.length === 0 ) {
      throw new Error("Program Error: can't map a key until nodes have been added")
    }

    const hash = this.hash(key)

    // okay, let's find the next node
    const nodes = []
    for ( let i = 0; i < this.ring.length; i++ ) {
      const node = this.ring[i]
      if ( nodes.length < count && hash < node.hash ) {
        // console.log('less')
        nodes.push(node.node)
        while ( nodes.length < count ) {
          nodes.push(this.ring[(i + nodes.length) % this.ring.length].node)
        }
        return nodes
      }
      else {
        // console.log('more')
      }
    }
    if ( nodes.length === 0 ) {
      // console.log('BREAKING!!!')
      nodes.push(this.ring[0].node)
      nodes.push(this.ring[1].node)
      nodes.push(this.ring[2].node)
    }

    return nodes
  }

  rehash() {
    // ToDo: when adding or removing a node, we could keep most of this and
    // just recompute what is needed, however speed is not (yet) the issue here.

    const newRing = []

    // for each node, we compute each bucket
    for ( const node of Object.keys(this.node) ) {
      // console.log('node:', node)
      for ( let num = 1; num <= this.buckets; num++ ) {
        // hash this name
        const name = `${node}/${num}`
        // console.log('hashing name:', name)
        // const hash = murmurhash.v3(name)
        const hash = this.hash(name)
        // console.log('hash:', hash)
        newRing.push({
          name,
          node,
          num,
          hash,
        })
      }
    }

    // console.log('newRing:', newRing)
    newRing.sort((a, b) => a.hash - b.hash)
    // console.log('newRing:', newRing)
    // for ( const item of newRing ) {
    //   console.log(`* ${item.name} (${item.hash})`)
    // }
    this.ring = newRing
  }

}
