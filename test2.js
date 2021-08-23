var ret = returnfalse
if (typeof ret === 'string') {
  console.log("string")
} else {
  console.log("it was false")
}

function returnfalse() {
  return false
}