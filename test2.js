var regexp = /(<([^>]+)>)/ig
var foo = "<html>$100</html>";

var match, matches = [];
var lengthlist = []
var bounds = defineOutOfBounds(foo)
var endTags = foo.substring(bounds[1], foo.length)
var content = foo.substring(bounds[0], bounds[1])
var startTags = foo.substring(0, bounds[0])
while ((match = regexp.exec(foo)) != null) {
  matches.push(match.index);
  lengthlist.push(match[0].length)
}

function defineOutOfBounds(inputString) {
  //Designed to create bounds for staying within tags
  var regexp = /(<([^>]+)>)/ig
  var match, matches = [];
  var lengthList = []
  while ((match = regexp.exec(inputString)) != null) {
      matches.push(match.index);
      lengthList.push(match[0].length)
  }
  if (matches.length == 0) {
      //No tags
      return [0, inputString.length]
  } else if (!isEven(matches.length)) {
      //Creator of the website has either forgot to close a tag or the whole thing is within a tag
      return false
  } else {
      //Return the border indexes of two middle-most tags
      return [matches[(matches.length /2) - 1] + lengthList[(lengthList.length / 2) - 1], matches[matches.length / 2]]
  }
}

function isEven(value){
  if (value%2 == 0)
      return true;
  else
      return false;
}
console.log(matches);