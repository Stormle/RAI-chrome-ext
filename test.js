start(3)


function start(raiPrice) {
    console.log(raiPrice)
    const text2 = ["We have found 2352.1 gazillionn$USDffrom a vault under the mountain."]
    const text = ["Why do apples cost so much? Like honestly if apples cost 1 dollar each then one million apples will cost 1 million dollars!"]
    var modifiedHTML = ""
    var allDone = false
    var match, matches = [];
    for (let i = 0; i < text.length; i++) {
        allDone = false
        while (!allDone) {
            if (text[i].toLowerCase().indexOf("$usd") != -1) {
                regexp = /[$]usd/g;
                if (modifiedHTML != false) {
                    text[i] = replaceText(text[i], "$usd", text[i].toLowerCase().indexOf("$usd"))
                }
            } else if (text[i].indexOf("$") != -1) { 
                
                if (modifiedHTML != false) {
                    text[i] = replaceText(text[i], "$", text[i].toLowerCase().indexOf("$"))
                }
            } else if (text[i].indexOf("US Dollar") != -1) {
                
                if (modifiedHTML != false) {
                    text[i] = replaceText(text[i], "US Dollar", text[i].toLowerCase().indexOf("US Dollar"))
                }
            } else if (text[i].indexOf("usd") != -1) {
                
                if (modifiedHTML != false) {
                    text[i] = replaceText(text[i], "usd", text[i].toLowerCase().indexOf("usd"))
                }
            } else if (text[i].indexOf("dollars") != -1) {
                
                if (modifiedHTML != false) {
                    text[i] = replaceText(text[i], "dollars", text[i].toLowerCase().indexOf("dollars"))
                }
            } else if (text[i].indexOf("dollar") != -1) {
                text[i] = replaceText(text[i], "dollar", text[i].toLowerCase().indexOf("dollar"))
                if (modifiedHTML != false) {
                    
                }
            } else if(text[i].indexOf("¢") != -1){
                text[i] = replaceText(text[i], "¢", text[i].toLowerCase().indexOf("¢"))
                if (modifiedHTML != false) {
                    
                }
            } else if(text[i].indexOf("cents") != -1){
                text[i] = replaceText(text[i], "cents", text[i].toLowerCase().indexOf("cents"))
                if (modifiedHTML != false) {
                    
                }
            } else if(text[i].indexOf("cent") != -1){
                text[i] = replaceText(text[i], "cent", text[i].toLowerCase().indexOf("cent"))
                if (modifiedHTML != false) {
                    
                }
            }
    }
    }
    console.log(text[0])
}
async function getRAIprice() {
    var getPrice = await fetchRAIprice()
    return getPrice
}
async function fetchRAIprice() {
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=rai&vs_currencies=usd")
    .then(function (response) {
      return response.json();
    })
    .catch(function (error) {
      console.log("Error: " + error);
    });
}

function replaceText(text, foundString, indexOf) {
    console.log(foundString)
    var pageStart = text.substring(0, indexOf)
    var pageEnd = text.substring(indexOf + foundString.length)
    console.log(pageStart)
    var foundNumber = ""
    var foundNumberBackwards = ""
    var isFound = false
    var isDone = false
    var i = 0;
    var searchBackwards = false
    var charIter
    var foundIndex = 10000
    var foundIndexBackwards = 10000
    while (!isDone) {
        //Get character
        if (searchBackwards) {
            if (pageEnd.length > i) {
                charIter = pageEnd.charAt(i)
            } else {
                isdone = true
            }
        } else {
            if (i >= 0) {
                charIter = pageStart.charAt(pageStart.length - i)
            } else {
                isdone = true
            }
            
        }
        if (charIter == "1" || charIter == "2" || charIter == "3" || charIter == "4" || charIter == "5" || charIter == "6" || charIter == "7" || charIter == "8" || charIter == "9" || charIter == "9" || charIter == "." || charIter == ",") {
            //Adding found number character
            if (!isFound && !searchBackwards) {
                isFound = true
                foundIndex = i
            } else if (searchBackwards && !isFound) {
                isFound = true
                foundIndexBackwards = i
            }
            if (!searchBackwards) {
                foundNumber += charIter
            } else {
                foundNumberBackwards += charIter
            }
            i++
        } else if (isFound) {
            //Already found valid numbers. Checking if we should go the other way.
            if (foundString.includes("$") || foundString.toLowerCase() == "usd") {
                if (!searchBackwards) {
                    searchBackwards = true
                    isFound = false
                    i = 0
                } else {
                    isDone = true
                }
            } else {
                isDone = true
            }
            
        } else if (i < 20) {
            //Search max 20 chars without result
            i++
        } else {
            //None found in 20 characters.
            if (foundString.includes("$") || foundString.toLowerCase() == "usd") {
                if (!searchBackwards) {
                    searchBackwards = true
                    isFound = false
                    i = 0
                } else {
                    isDone = true
                }
            } else {
                isDone = true
                return false
            }
        }
    }

    var sendBackwardsVariable
    if (foundIndexBackwards < foundIndex) {
        //Backwards
        sendBackwardsVariable = true
    } else if (foundIndex == 10000 && foundIndexBackwards == 10000){
        //Nothing was found.
        return
    } else if (foundIndex == foundIndexBackwards){
        //Tie, just send front.
        sendBackwardsVariable = false
    } else if (foundIndexBackwards > foundIndexBackwards) {
        sendBackwardsVariable = false
    }

    if (foundNumber != "" || foundNumberBackwards != "") {
        var actualContent = false
        if ( foundNumber.includes("1") || foundNumber.includes("2") || foundNumber.includes("3") || foundNumber.includes("4") || foundNumber.includes("5") || foundNumber.includes("6") || foundNumber.includes("7") || foundNumber.includes("8") || foundNumber.includes("9") || foundNumber.includes("0") ) {
            actualContent = true
        } else if ( foundNumberBackwards.includes("1") || foundNumberBackwards.includes("2") || foundNumberBackwards.includes("3") || foundNumberBackwards.includes("4") || foundNumberBackwards.includes("5") || foundNumberBackwards.includes("6") || foundNumberBackwards.includes("7") || foundNumberBackwards.includes("8") || foundNumberBackwards.includes("9") || foundNumberBackwards.includes("0") ) {
            actualContent = true
        }
        if (actualContent) {
            if (!sendBackwardsVariable){
                foundNumber = foundNumber.split("").reverse().join("");
            }
            var convertedNumber
            var numberReplaced
            var returnString = ""
            if (sendBackwardsVariable) {
                convertedNumber = convertNumber(foundNumberBackwards, foundString)
                numberReplaced = replaceTextFromString(pageEnd, convertedNumber.toString(), foundIndexBackwards, foundNumberBackwards.length, true)
                
                returnString = pageStart + addStr(numberReplaced, foundIndexBackwards + convertedNumber.toString().length, " RAI")
            } else {
                convertedNumber = convertNumber(foundNumber, foundString)
                numberReplaced = replaceTextFromString(pageStart, convertedNumber.toString(), foundIndex, foundNumber.length, false)
                returnString = numberReplaced + "RAI" + pageEnd
                console.log(returnString)
            }
            return returnString
        }
        
    }
    
}
function addStr(str, index, stringToAdd){
    return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
}

function replaceTextFromString(input, replacement, index, length, isBackwards) {
    var start = ""
    var end = ""
    if (!isBackwards) {
        //Right to left
        start = input.substring(0, input.length - index - length + 1)
        end = input.substring(input.length - index + 1, input.length)
    } else {
        //Left to right
        start = input.substring(0, index - 1)
        end = input.substring(index + length, input.length)
    }
    
    var totalString = start + replacement + end
    return totalString
}
function convertNumber(inputNumber, foundString) {
    var sanitized = inputNumber
    var typeOfJunk = ""
    if (inputNumber.charAt(0) == "," || inputNumber.charAt(0) == ".") {
        //Starts with a , or . so we add a zero to fix math
        sanitized = "0"
    }
    if (inputNumber.includes(".") && inputNumber.includes(",")) {
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