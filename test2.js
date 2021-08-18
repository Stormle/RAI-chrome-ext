var regexp = /[$]/gi;
var foo = "abc1, $Ab cd, abc3, zxy, abc4";
var match, matches = [];

while ((match = regexp.exec(foo)) != null) {
  matches.push(match.index);
}

console.log(matches);