var test = require('tape');
var gossip = require('../src/gossip');

test('syn', function(t) {
  var peer = {
    id: 'a',
    db: {
      a: ['foo'],
      b: ['bar', 'baz']
    }
  };
  var nextMessage = gossip(peer);

  t.deepEqual(nextMessage, {
    from: 'a',
    to: 'b',
    name: 'syn',
    digest: {a: 1, b: 2}
  });

  t.end();
});

test('synAck', function(t) {
  var peer = {
    id: 'b',
    db: {
      a: [],
      b: ['bar'],
      c: ['zip', 'zap', 'zop']
    }
  };
  var previousMessage = {
    from: 'a',
    to: 'b',
    name: 'syn',
    digest: {a: 1, b: 2}
  };
  var nextMessage = gossip(peer, previousMessage);

  t.deepEqual(nextMessage, {
    from: 'b',
    to: 'a',
    name: 'synAck',
    digest: {a: 0, b: 1, c: 3},
    updates: {c: ['zip', 'zap', 'zop']}
  });

  t.end();
});

test('ack', function(t) {
  var peer = {
    id: 'a',
    db: {
      a: ['foo'],
      b: ['bar', 'baz']
    }
  };
  var previousMessage = {
    from: 'b',
    to: 'a',
    name: 'synAck',
    digest: {a: 0, b: 1, c: 3},
    updates: {c: ['zip', 'zap', 'zop']}
  };
  var nextMessage = gossip(peer, previousMessage);

  t.deepEqual(nextMessage, {
    from: 'a',
    to: 'b',
    name: 'ack',
    digest: {a: 1, b: 2},
    updates: {a: ['foo'], b: ['baz']}
  });

  t.end();
});
