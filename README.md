### RAI-chrome-ext

This Chrome extension will convert all mentions of any USD values to the cryptocurrency RAI. The search happens in a dynamic manner which makes the rules a lot more flexible compared to a basic regex search. Every function contains documentation of what the function does and what variables it passes on to the next function. The format of the original number is also retained. (e.g. $100,000.69 -> 33,333.56 RAI)

#### How does the dynamic search work?

Child nodes that are classified as text content (nodeType == 3) are selected and iterated over each search term. For each term found a search of +-20 characters of the term's location will commence. The search results will then compete on validity and proximity to be selected in case results are found on each side. 

#### How to install the extension?
chrome://extensions/
-> "Load unpacked"
  -> select this folder
  
#### Demo:
This is a screenshot of test.html at the testhtml folder:
Notice how the dynamic text search does not get fooled by such mentions as "centimeter" or "percents" even though it supports "cent" and "cents". 
![Extension in action](https://github.com/Stormle/RAI-chrome-ext/blob/master/readme-resources/rai-ext-example.png?raw=true)
DISCLAIMER: The colors and the before and after boxes at top are added by me in post to highlight areas of relevance and make it more clear. The content is real and the product of a live running version of the extension.
