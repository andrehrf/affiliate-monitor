/**
 * Affiliate Cookie Monitor 
 * @author André Ferreira <andrehrf@gmail.com>
 */

setInterval(function(){
    chrome.tabs.query({"active": true, "currentWindow": true}, function(tabs){
        try{
            var domain = tabs[0].url.match(/^[\w-]+:\/{2,}\[?([\w\.:-]+)\]?(?::[0-9]*)?/)[1].replace("www", "")
                    
            if(domain.split(".").length >= 4)//Fix Subdomain
                domain = domain.replace(/.*?\..*?/, "");
                        
            chrome.cookies.getAll({domain: domain}, function(arr){
                chrome.tabs.sendMessage(tabs[0].id, {"event": "onload", cookies: arr});
            });            
        }catch(e){}
    });
}, 1000);

chrome.cookies.onChanged.addListener(function(arr) {
    chrome.tabs.query({"active": true, "currentWindow": true}, function(tabs){
        chrome.tabs.sendMessage(tabs[0].id, {"event": "onchange", cookies: arr});
    });
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    var funcObj = {
            type: "basic",
            title: request.title,
            message: request.msg,
            iconUrl: "img/icon.png"
    }
    
    var nID = getRandomToken();
    
    chrome.notifications.create(nID, funcObj,function(){
        pausecomp(10000);
        chrome.notifications.clear(nID, function(){});
    });
});

 function getRandomToken() {
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);

    var hex = '';

    for(var i = 0; i < randomPool.length; ++i) 
        hex += randomPool[i].toString(16);

    return hex;
}