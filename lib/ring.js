// npm
import murmurhash from 'murmurhash'

export default class Ring {
  constructor(vNodesPerNode, totalBuckets) {
    vNodesPerNode ||= 64
    totalBuckets ||= Math.pow(2, 16)

    this.vNodesPerNode = vNodesPerNode
    this.totalBuckets = totalBuckets
    this.node = {}

    // an array of nodes with slot information
    this.ring = []
  }

  addNode(name) {
    this.node[name] = true
    this.recreate()
  }

  delNode(name) {
    delete this.node[name]
    this.recreate()
  }

  slot(str) {
    return murmurhash.v3(str) % this.totalBuckets
  }

  getRing() {
    return this.ring
  }

  getNode(key) {
    if ( this.ring.length === 0 ) {
      throw new Error("Program Error: can't map a key until nodes have been added")
    }

    const slot = this.slot(key)
    // console.log(`getNode(${key}):`, slot)

    // find the node greater than this slot on the ring
    let found = null
    for ( const node of this.ring ) {
      if ( !found && slot < node.slot ) {
        found = node
      }
    }
    if ( !found ) {
      found = this.ring[0]
    }

    return found.node
  }

  getNodes(key, count) {
    if ( this.ring.length === 0 ) {
      throw new Error("Program Error: can't map a key until nodes have been added")
    }

    const slot = this.slot(key)

    // okay, let's find the next node
    const nodes = []
    for ( let i = 0; i < this.ring.length; i++ ) {
      const node = this.ring[i]
      if ( nodes.length < count && slot < node.slot ) {
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
      nodes.push(this.ring[0].node)
      nodes.push(this.ring[1].node)
      nodes.push(this.ring[2].node)
    }

    return nodes
  }

  recreate() {
    // ToDo: when adding or removing a node, we could keep most of this and
    // just recompute what is needed, however speed is not (yet) the issue here.

    const newRing = []

    // for each node, we compute its slot
    for ( const node of Object.keys(this.node) ) {
      for ( let num = 1; num <= this.vNodesPerNode; num++ ) {
        // get the slot of this name
        const name = `${node}(${num})`
        const slot = this.slot(name)
        newRing.push({
          name,
          node,
          num,
          slot,
        })
      }
    }

    // sort these slots into the ring
    newRing.sort((a, b) => a.slot - b.slot)

    // save the new ring
    this.ring = newRing
  }

}
