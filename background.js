//Set value at $3 in case the API doesn't work. But it does work.
fetch('https://api.coingecko.com/api/v3/simple/price?ids=rai&vs_currencies=usd')
  .then(
    function(response) {
      if (response.status !== 200) {
        console.log('Looks like there was a problem. Status Code: ' +
          response.status);
      } else {
          // Examine the text in the response
        response.json().then(function(data) {
            raiPrice = parseFloat(data["rai"]["usd"])
            start(data["rai"]["usd"]);
          });
      }
    }
  )
  .catch(function(err) {
    console.log(err)
  });


function start() {
    var textnodes = nativeSelector()

    console.log(raiPrice)
    var modifiedHTML = ""
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
    var stillFinding = true
    var indexBlock = 0
    for (let i = 0; i < textnodes.length; i++) {
        matches = [];
        for (let i2 = 0; i2 < regexp.length; i2++) {
            indexBlock = 0
            stillFinding = true
            var textToSearch = ""
            textToSearch = textnodes[i].nodeValue
            while ((match = regexp[i2].exec(textToSearch)) != null) {
                matches.push(match.index);
            }
            if (matches.length == 0) {
                stillFinding = false
            }
            console.log("inner text: " + textToSearch)
            console.log("corresponding string: " + correspondingString[i2])

            while (stillFinding) {
                    modifiedHTML = replaceText(textnodes[i].nodeValue, correspondingString[i2], matches[0])
                    if (typeof modifiedHTML === 'string') {
                        if (modifiedHTML.includes("0.00000000000000000000000000000001")) {
                            console.log("here")
                        }
                        textnodes[i].nodeValue = modifiedHTML
                    } else {
                        indexBlock++
                    }

                    textToSearch = textnodes[i].nodeValue

                //Redo the index search 
                matches = []
                var skipcounter = 0
                while ((match = regexp[i2].exec(textToSearch)) != null) {
                    if (skipcounter >= indexBlock) {
                        matches.push(match.index);
                        break
                    } else {
                        skipcounter++
                    }
                }
                skipcounter = 0
                if (matches.length == 0) {
                    stillFinding = false
                }
            }
        }
    }
}
function nativeSelector() {
    var elements = document.querySelectorAll("body, body *");
    var results = [];
    var child;
    for(var i = 0; i < elements.length; i++) {
        child = elements[i].childNodes[0];
        if (elements[i].hasChildNodes() && child.nodeType == 3) {
            results.push(child);
        }
    }
    return results;
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
            if (pageEnd.length > i && pageEnd.length > 0) {
                charIter = pageEnd.charAt(i)
                if (charIter == "\\") {
                    //Element changed or someone used backslash in the text between found str and number. Unlikely but that would interupt the number search.
                    charIter = ""
                    isDone = true
                }
            } else {
                charIter = ""
                isDone = true
            }
        } else {
            if (pageStart.length > i >= 0 && pageStart.length > 0) {
                charIter = pageStart.charAt(pageStart.length - i)
                if (charIter == "\\") {
                    //Element changed or someone used backslash in the text between found str and number. Unlikely but that would interupt the number search.
                    charIter = ""
                    if (foundString.includes("$") || foundString.toLowerCase() == "usd" || foundString == "¢") {
                        searchBackwards = true
                    } else {
                        isDone = true
                    }
                }
            } else {
                charIter = ""
                if (foundString.includes("$") || foundString.toLowerCase() == "usd" || foundString == "¢") {
                    searchBackwards = true
                } else {
                    isDone = true
                }
                
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
        if (foundNumberBackwards.includes("1") || foundNumberBackwards.includes("2") || foundNumberBackwards.includes("3") || foundNumberBackwards.includes("4") || foundNumberBackwards.includes("5") || foundNumberBackwards.includes("6") || foundNumberBackwards.includes("7") || foundNumberBackwards.includes("8") || foundNumberBackwards.includes("9")) {
            sendBackwardsVariable = true
        } else if (foundIndex != 10000) {
            if (foundNumber.includes("1") || foundNumber.includes("2") || foundNumber.includes("3") || foundNumber.includes("4") || foundNumber.includes("5") || foundNumber.includes("6") || foundNumber.includes("7") || foundNumber.includes("8") || foundNumber.includes("9")) {
                sendBackwardsVariable = false
            } else {
                return false
            }
        } else {
            return false
        }

        
    } else if (foundIndex == 10000 && foundIndexBackwards == 10000){
        //Nothing was found.
        return false
    } else if (foundIndex == foundIndexBackwards){
        //Tie, just send front.
        sendBackwardsVariable = false
    } else if (foundIndexBackwards > foundIndex) {
        if (foundNumber.includes("1") || foundNumber.includes("2") || foundNumber.includes("3") || foundNumber.includes("4") || foundNumber.includes("5") || foundNumber.includes("6") || foundNumber.includes("7") || foundNumber.includes("8") || foundNumber.includes("9")) {
            sendBackwardsVariable = false
        } else if (foundIndexBackwards != 10000) {
            if (foundNumberBackwards.includes("1") || foundNumberBackwards.includes("2") || foundNumberBackwards.includes("3") || foundNumberBackwards.includes("4") || foundNumberBackwards.includes("5") || foundNumberBackwards.includes("6") || foundNumberBackwards.includes("7") || foundNumberBackwards.includes("8") || foundNumberBackwards.includes("9")) {
                sendBackwardsVariable = true
            } else {
                return false
            }
        } else {
            return false
        }
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
                if (foundNumber == "0") {
                    return false
                }
                foundNumber = foundNumber.split("").reverse().join("");
            } else if (foundNumberBackwards == "0") {
                return false
            }
            var convertedNumber
            var numberReplaced
            var returnString = ""
            if (sendBackwardsVariable) {
                convertedNumber = convertNumber(foundNumberBackwards, foundString)
                if (typeof convertedNumber == "boolean") {
                    return false
                }
                numberReplaced = replaceTextFromString(pageEnd, convertedNumber.toString(), foundIndexBackwards, foundNumberBackwards.length, true)
                
                returnString = pageStart + addStr(numberReplaced, foundIndexBackwards + convertedNumber.toString().length, " RAI")
            } else {
                convertedNumber = convertNumber(foundNumber, foundString)
                if (typeof convertedNumber == "boolean") {
                    return false
                }
                numberReplaced = replaceTextFromString(pageStart, convertedNumber.toString(), foundIndex, foundNumber.length, false)

                returnString = numberReplaced + "RAI" + pageEnd
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
    var rounded
    var goodEnough = false
    var addition = 0
    while (!goodEnough) {
        rounded = finalNumber.toFixed(sanitized.length - matches2[matches2.length - 1] + 1 + addition)
        if (rounded.includes("1") || rounded.includes("2") || rounded.includes("3") || rounded.includes("4") || rounded.includes("5") || rounded.includes("6") || rounded.includes("7") || rounded.includes("8") || rounded.includes("9") ) {
            finalNumber = rounded
            goodEnough = true
        } else {
            addition++
            if (addition > 30) {
                return false
            }
        }
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