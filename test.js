var testtext = "oh welcome, welcome my friend"
console.log(testtext.indexOf("welcome"))


const text = ["We have found 2352.1 gazillionn$USDffrom a vault under the mountain."]

for (let i = 0; i < text.length; i++) {
    if (text[i].toLowerCase().indexOf("$usd") != -1) {
        replaceText(text[i], "$usd", text[i].toLowerCase().indexOf("$usd"))
    } else if (text[i].indexOf("$") != -1) { 
        replaceText(text[i].toLowerCase(), "$", text[i].toLowerCase().indexOf("$"))
    } else if (text[i].indexOf("US Dollar") != -1) {
        replaceText(text[i].toLowerCase(), "US Dollar", text[i].toLowerCase().indexOf("US Dollar"))
    } else if (text[i].indexOf("usd") != -1) {
        replaceText(text[i].toLowerCase(), "usd", text[i].toLowerCase().indexOf("usd"))
    } else if (text[i].indexOf("dollars") != -1) {
        replaceText(text[i].toLowerCase(), "dollars", text[i].toLowerCase().indexOf("dollars"))
    } else if (text[i].indexOf("dollar") != -1) {
        replaceText(text[i].toLowerCase(), "dollar", text[i].toLowerCase().indexOf("dollar"))
    } else if(text[i].indexOf("¢") != -1){
        replaceText(text[i].toLowerCase(), "¢", text[i].toLowerCase().indexOf("¢"))
    } else if(text[i].indexOf("cents") != -1){
        replaceText(text[i].toLowerCase(), "cents", text[i].toLowerCase().indexOf("cents"))
    } else if(text[i].indexOf("cent") != -1){
        replaceText(text[i].toLowerCase(), "cent", text[i].toLowerCase().indexOf("cent"))
    }
}

function replaceText(text, foundString, indexOf) {
    console.log(foundString)
    var pageStart = text.substring(0, indexOf)
    var pageEnd = text.substring(indexOf + foundString.length)
    console.log(pageStart)
    var foundNumber = ""
    var isFound = false
    var isDone = false
    var i = 0;
    while (!isDone) {
        var charIter = pageStart.charAt(pageStart.length - i)
        if (charIter == "1" || charIter == "2" || charIter == "3" || charIter == "4" || charIter == "5" || charIter == "6" || charIter == "7" || charIter == "8" || charIter == "9" || charIter == "9" || charIter == "." || charIter == ",") {
            //Adding found number character
            isFound = true
            foundNumber += charIter
            i++
        } else if (isFound) {
            //Number ended, stopping the iterations.
            isDone = true
        } else if (i < 20) {
            //Search max 20 chars back
            i++
        } else {
            isDone = true
        }
    }
    if (foundNumber =! "") {
        if ( foundNumber.includes("1") || foundNumber.includes("2") || foundNumber.includes("3") || foundNumber.includes("4") || foundNumber.includes("5") || foundNumber.includes("6") || foundNumber.includes("7") || foundNumber.includes("8") || foundNumber.includes("9") || foundNumber.includes("0") ) {
            foundNumber = foundNumber.split("").reverse().join("");
            var convertedNumber = convertNumber(foundNumber, foundString)
            return pagestart + convertedNumber.toString() + "RAI" + pageEnd
        }
        
    }
    
}

function convertNumber(inputNumber, foundString) {
    var sanitized = ""
    var typeOfJunk = ""
    if (inputNumber.charAt(0) == "," || inputNumber.charAt(0) == ".") {
        //Starts with a , or . so we add a zero to fix math
        sanitized = "0"
    }
    if (inputNumber.includes(".") && foundNumber.includes(",")) {
        sanitized = inputNumber.split(',').join("");
        typeOfJunk = "both"
    } else if (inputNumber.includes(",")) {
        sanitized = inputNumber.split(',').join(".");
        typeOfJunk = "commas"
    }

    //Get current price from coingecko:
    var price = 3

    var finalNumber = ""
    if (foundString == "cent" || foundString == "cents" || foundString == "¢") {
        finalNumber = parseFloat(sanitized) / price / 100
    } else {
        finalNumber = parseFloat(sanitized) / price
    }
    
    if (finalNumber < 0.1) {
        finalNumber = finalNumber.toFixed(5)
    } else {
        finalNumber = finalNumber.toFixed(2)
    }
    if (typeOfJunk == "both") {
        finalNumber = commaSeparateNumber(finalNumber)
    } else if (typeOfJunk == "commas") {
        finalNumber = finalNumber.split('.').join(",");
    }
    return finalNumber
}
function commaSeparateNumber(val){
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
  }