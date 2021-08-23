const text = document.querySelectorAll('h1, h2, h3, h4, h5, p, li, td, caption, span, a')

//Set value at $3 in case the API doesn't work. But it does work.
var raiPrice = 3
fetch('https://api.coingecko.com/api/v3/simple/price?ids=rai&vs_currencies=usd')
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
        start(3)
      }

      // Examine the text in the response
      response.json().then(function(data) {
        raiPrice = parseFloat(data["rai"]["usd"])
        start(data["rai"]["usd"]);
      });
    }
  )
  .catch(function(err) {
    start()
  });


function start() {
    console.log(raiPrice)
    const text = document.querySelectorAll('h1, h2, h3, h4, h5, p, li, td, caption, span, a')
    var modifiedHTML = ""
    var allDone = false
    var regexp = [/[$]usd/gi,
    /[$]/gi,
    /us dollars/gi,
    /us dollar/gi,
    /usd/gi,
    /dollars/gi,
    /dollar/gi,
    /[¢]/gi,
    /\b(?:cent)\b/gi,
    /\b(?:cents)\b/gi];
    var correspondingString = ["$usd",
        "$",
        "us dollars",
        "us dollar",
        "usd",
        "dollars",
        "dollar",
        "¢",
        "cent",
        "cents"]
    var match, matches = [];
    var endTags
    var content
    var startTags
    for (let i = 0; i < text.length; i++) {
        matches = [];
        for (let i2 = 0; i2 < regexp.length; i2++) {
            //some issues with matching
            while ((match = regexp[i2].exec(text[i].innerHTML.toString())) != null) {
                matches.push(match.index);
            }
            console.log("inner html: " + text[i].innerHTML)
            console.log("corresponding string: " + correspondingString[i2])
            for (let i3 = 0; i3 < matches.length; i3++) {
                
                console.log("match: " + matches[i3])
                var bounds = defineOutOfBounds(text[i].innerHTML)
                if (bounds === true) {
                    modifiedHTML = replaceText(text[i].innerHTML, correspondingString[i2], matches[0])
                    if (modifiedHTML != false) {
                        text[i].innerHTML = modifiedHTML
                    }
                } else if (bounds === false) {
                    continue;
                } else {
                    endTags = text[i].innerHTML.substring(bounds[1], text[i].innerHTML.length)
                    content = text[i].innerHTML.substring(bounds[0], bounds[1])
                    startTags = text[i].innerHTML.substring(0, bounds[0])
                    modifiedHTML = startTags + replaceText(content, correspondingString[i2], matches[0] - bounds[0]) + endTags
                    if (modifiedHTML != false) {
                        text[i].innerHTML = modifiedHTML
                    }
                }
                //Redo the index search 
                matches = []
                while ((match = regexp[i2].exec(text[i].toString())) != null) {
                    matches.push(match.index);
                }
            }
        }
    }
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
        return true
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
                charIter = ""
                isDone = true
            }
        } else {
            if (pageStart.length > i >= 0) {
                charIter = pageStart.charAt(pageStart.length - i)
            } else {
                charIter = ""
                isDone = true
            }
        }
        if (charIter == "1" || charIter == "2" || charIter == "3" || charIter == "4" || charIter == "5" || charIter == "6" || charIter == "7" || charIter == "8" || charIter == "9" || charIter == "9" || charIter == "." || charIter == "," || charIter == "0") {
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
            if (foundString.includes("$") || foundString.toLowerCase() == "usd" || foundString == "¢") {
                if (!searchBackwards) {
                    searchBackwards = true
                    isFound = false
                    i = 0
                } else {
                    charIter = ""
                    isDone = true
                }
            } else {
                charIter = ""
                isDone = true
            }
            
        } else if (i < 20) {
            //Search max 20 chars without result
            i++
        } else {
            //None found in 20 characters.
            if (foundString.includes("$") || foundString.toLowerCase() == "usd" || foundString == "¢") {
                if (!searchBackwards) {
                    searchBackwards = true
                    isFound = false
                    i = 0
                } else {
                    charIter = ""
                    isDone = true
                }
            } else {
                charIter = ""
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
        return false
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
                if (foundString.charAt(0) == " " && foundString.charAt(foundString.length - 1)) {
                    returnString = numberReplaced + " RAI " + pageEnd
                } else if (foundString.charAt(0) == " "){
                    returnString = numberReplaced + " RAI" + pageEnd
                } else {
                    returnString = numberReplaced + "RAI" + pageEnd
                }
                
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
        inputNumber = "0" + inputNumber
    }
    if (inputNumber.includes(".") && inputNumber.includes(",")) {
        sanitized = inputNumber.split(',').join("");
        typeOfJunk = "both"
    } else if (inputNumber.includes(",")) {
        var regexp = /,/gi
        var match, matches = [];
        while ((match = regexp.exec(inputNumber)) != null) {
            matches.push(match.index);
        }
        if (inputNumber.length < 4) {
            //$1,2
            sanitized = inputNumber.split(',').join(".");
            typeOfJunk = "commas"
        } else {
            if (matches[matches.length - 1] >= inputNumber.length - 3) {
                //$100,2
                sanitized = inputNumber.split(',').join(".");
                typeOfJunk = "commas"
            } else {
                //100,000
                typeOfJunk = "both"
                sanitized = inputNumber.replaceAll(',', '')
            }
        }
    }

    var finalNumber = ""
    if (foundString == "cent" || foundString == "cents" || foundString == "¢") {
        finalNumber = parseFloat(sanitized) / raiPrice / 100
    } else {
        finalNumber = parseFloat(sanitized) / raiPrice
    }
    var regexp2 = /./gi
    var match2, matches2 = [];
    while ((match2 = regexp2.exec(sanitized)) != null) {
        matches2.push(match2.index);
    }

    //Add 2 extra decimals to whatever amount there was before. ($2 -> $2.00)   
    finalNumber = finalNumber.toFixed(sanitized.length - matches2[matches2.length - 1] + 1)

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