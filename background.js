//Get coingecko price. If it doesn't work, do nothing.
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
    /*The purpose of this function is to take all child nodes considered as text
    and run the content through a loop of finding the index of mentions of usd.
    It then passes the original text, found string and the index of the found text 
    to the replaceText() function.
    If replaceText() returns a string, the operation of the function was valid
    and childnode can be replaced with new content; the content being the return.
    A fail will result replaceText() to return false. 

    Iteration over found mentions happens by taking the modified version of the node
    and always taking the first mention left to right. In case a mention was invalidated
    by the replaceText() function +1 is added to indexBlock which prevents it from being
    selected on the next iteration.
    */
    var textnodes = nativeSelector()
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
    //This function selects all child nodes that are classified as text.
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
    /*This function is responsible for finding the possible numeral amount of dollars
    in text. The core idea is to start iterating over characters leftward from the found
    string until encountering numbers decimal points. The maximum reach is 20 characters.
    This 20 character limit is overriden if numbers are found and they extend beyond it.
    On certain string such as "$", "usd" and "¢" the special case of left to right search
    is unlocked. If a numeral value is found on each sides of the mention, both values are
    then validated to be proper numbers and then compared which is closer to the index of
    the string. All these operations will be done with the string split in to two parts 
    which made coding replaceTextFromString() and iterating the strings easier.

    The winning number's side will be selected to be replaced in the original string. The 
    number first is inverted if it's right to left, then fed to the function convertNumber()
    along with foundString which returns a string with the numerical amount converted to RAI. 
    We can then piece this all together by giving the function replaceTextFromString() the
    winning side's split string, the number to replace it, the index of this number found, 
    length of the found number and if the string found was right to left. We then piece
    together the start, end (the winning one of them being modified to contain the new number with
    the found string removed) and "RAI" or " RAI" depending on if there originally was a space
    between the found number and string or not. If the number was found left to right then the
    addStr() function is used to replace text from the string in a bit more custom fashion.

    The end result is the final string which is returned. If something in this process fails
    or the string is deemed as not valid for replacement then false is returned.
    */
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
            if (pageEnd.length >= i && pageEnd.length > 0) {
                charIter = pageEnd.charAt(i)
            } else {
                charIter = ""
                isDone = true
            }
        } else {
            if (pageStart.length > i >= 0 && pageStart.length > 0) {
                charIter = pageStart.charAt(pageStart.length - i)
            } else {
                charIter = ""
                if (foundString.includes("$") || foundString.toLowerCase() == "usd" || foundString == "¢") {
                    searchBackwards = true
                    i = 0
                    continue
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
                    continue
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
                    continue
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
                if (Math.abs(foundIndex - indexOf ) == 1) {
                    returnString = numberReplaced + " RAI" + pageEnd
                } else {
                    returnString = numberReplaced + "RAI" + pageEnd
                }
                
            }
            return returnString
        }
        
    }
    
}
function addStr(str, index, stringToAdd){
    //Replaces text from a string in a custom position.
    return str.substring(0, index) + stringToAdd + str.substring(index, str.length);
}

function replaceTextFromString(input, replacement, index, length, isBackwards) {
    //Replaces text from a string in a custom position. Also supports inverted indexes.
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
    /* The purpose of this function is to take a number input,
    sanitize it, convert it in to RAI, round it to the same amount of 
    decimals as before +2 or until zero's stop with a maximum of 30 and 
    lastly add the things we sanitized out previously. 
    100,000.69 ($) -> 100000.69 ($) -> 33333.56123123 (RAI) -> 33,333.56 (RAI)
    If the string is about cents, the value of the found number is divided
    by a hundred to correspond the USD/RAI ratio.
    If the value either goes too small, is not a number (e.g. 192.168.1.1) then return false.
    */
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
    //This function adds the commas to a comma separated number.
    while (/(\d+)(\d{3})/.test(val.toString())){
      val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
    }
    return val;
  }