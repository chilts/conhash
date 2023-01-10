// npm
import murmurhash from 'murmurhash'

export default class Ring {
  constructor(buckets) {
    this.buckets = buckets
    this.server = {}
    this.ring = []
    // this.rehash()
  }

  addServer(name) {
    this.server[name] = true

    this.rehash()
  }

  delServer(name) {
    delete this.server[name]
    this.rehash()
  }

  getServerForKey(key) {
    if ( this.ring.length === 0 ) {
      throw new Error("Program Error: can't hash a key before adding servers")
    }

    const hash = murmurhash.v3(key)
    // console.log(`getServerForKey(${key}):`, hash)

    // okay, let's find the next server
    let found = null
    for ( const server of this.ring ) {
      // console.log(server)
      // console.log('Checking        hash:', hash)
      // console.log('Checking server.hash:', server.hash)
      // console.log('Checking     compare:', hash < server.hash)
      if ( !found && hash < server.hash ) {
        // console.log('less')
        found = server
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

    return found.server
  }

  rehash() {
    // ToDo: when adding or removing a server, we could keep most of this and
    // just recompute what is needed, however speed is not (yet) the issue here.

    const newRing = []

    // for each server, we compute each bucket
    for ( const server of Object.keys(this.server) ) {
      // console.log('server:', server)
      for ( let num = 1; num <= this.buckets; num++ ) {
        // hash this name
        const name = `${server}/${num}`
        // console.log('hashing name:', name)
        const hash = murmurhash.v3(name)
        // console.log('hash:', hash)
        newRing.push({
          name,
          server,
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
