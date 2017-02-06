var util = require('./util');

function digest(peer) {
  return util.map(peer.db, function(value) {
    return value.length;
  });
}

function updates(peer, digest) {
  return util.reduce(peer.db, function(obj, value, key) {
    var slice = value.slice(digest[key]);
    if (slice.length) obj[key] = slice;
    return obj;
  }, {});
}

function randomID(peer) {
  var db = Object.assign({}, peer.db);
  delete db[peer.id];

  var keys = Object.keys(db);
  var i = Math.floor(Math.random() * keys.length);

  return keys[i];
}

function gossip(peer, previousMessage) {
  if (previousMessage) {
    return {
      from: peer.id,
      to: previousMessage.from,
      name: (previousMessage.name === 'syn') ? 'synAck' : 'ack',
      digest: digest(peer),
      updates: updates(peer, previousMessage.digest)
    };
  } else {
    return {
      from: peer.id,
      to: randomID(peer),
      name: 'syn',
      digest: digest(peer)
    };
  }
}

module.exports = gossip;
