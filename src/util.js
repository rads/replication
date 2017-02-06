function map(coll, fn) {
  return reduce(coll, function(obj, value, key) {
    obj[key] = fn(value, key);
    return obj;
  }, {});
}

function reduce(coll, fn, init) {
  return Object.keys(coll).reduce(function(acc, key) {
    return fn(acc, coll[key], key);
  }, init);
}

module.exports = {
  map: map,
  reduce: reduce
};
