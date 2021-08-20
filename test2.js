var regexp = /\b(?:cent|cents)\b/gi;
var foo = "<html>centimeter percent aaa cents cent</html>";

var match, matches = [];
var lengthlist = []

while ((match = regexp.exec(foo)) != null) {
  matches.push(match.index);
  lengthlist.push(match[0].length)
}

console.log("a")