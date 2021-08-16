{
    "name": "USD to RAI",
    "version": "1.0",
    "manifest_version": 2,
    "description": "Changes all references of USD to RAI!",
    "background": {
        "scripts": ["background.js"]
    }
    "permissions": ["activeTab"],
    "browser_action": {}
}

const text = document.querySelectorAll('h1, h2, h3, h4, h5, p, li, td, caption, span, a')

var dollars = [
    "$usd",
    "$",
    "US Dollar",
    "",
    ""
]
for (let i = 0; i < text.length; i++) {
    if (text[i].innerHTML.includes("$usd")) {

    } else if (text[i].innerHTML.includes("$")) { 
        replaceText(text, "$")
    } else if (text[i].innerHTML.includes("US Dollar")) {
        replaceText(text, "US Dollar")
    } else if (text[i].innerHTML.includes("usd")) {
        replaceText(text, "usd")
    } else if (text[i].innerHTML.includes("dollars")) {
        replaceText(text, "dollars")
    }
}

function replaceText(text, foundString) {

}