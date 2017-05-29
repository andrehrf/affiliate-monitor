/**
 * Affiliate Monitor 
 * @author André Ferreira <andrehrf@gmail.com>
 */

var storage = chrome.storage.local || storage.StorageArea;
var stores = {};

storage.get('stores', function (item){
    var now = new Date().getTime();
    now = parseInt(now/1000);

    var storesCache = item['stores'];            
    var Timeout = (storesCache) ? storesCache.timeout : 0;

    if(!storesCache || now > Timeout){
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(){
            if(xhr.readyState == 4){    
                var data = JSON.parse(xhr.responseText);
                data["timeout"] = now+300;
                storage.set({'stores': data}); 
                stores = data;
                loadTemplate();
            }
        }; 

        xhr.open("GET", "https://itssimple.com.br/api2/stores", true);
        xhr.send(); 
    }
    else{
        stores = storesCache;
        loadTemplate();
    }
});

function loadTemplate(){
    for(var key in stores){
        var regexUrl = new RegExp(stores[key].domain, "i");
        
        if(location.hostname == stores[key].domain || location.hostname == "www." + stores[key].domain || regexUrl.test(window.location.href)){
            //Get Template
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function(){
                if(xhr.readyState == 4){    
                    //document.body.style.marginRight = "300px"; 
                    var contents = Mustache.render(xhr.responseText, {});

                    var s = document.createElement('div');
                    s.id = "acm-console";
                    s.style.position = "fixed";
                    s.style.left = "0px";
                    s.style.bottom = "0px";
                    s.style.top = "0px";
                    s.style.width = "200px";
                    s.style.zIndex = "9999999999";
                    s.style.border = "1px solid #CCC";
                    s.style.backgroundColor = "#FFF";
                    s.innerHTML = contents;
                    document.body.appendChild(s);
                    
                    document.body.style.marginLeft = "200px"; 
                    document.body.style.display = "block"; 
                }
            }; 

            xhr.open("GET", chrome.extension.getURL("tpl/trackings.mst"), true);
            xhr.send();
            break;
        }
    }
}

function AffiliateCookie(cookie, cookies){    
    if(/_pk_ref/i.test(cookie.name)){
        var arr = JSON.parse(urldecode(cookie.value));
        
        if(arr[0].toLowerCase() == "parcerias_actionpay"){
            document.querySelector("#actionpayTracking").innerHTML = "Sim";
            document.querySelector("#actionpayID").innerHTML = arr[2];
            document.querySelector("#actionpayExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
        }
        else if(arr[1].toLowerCase() == "parcerias_afilio"){
            document.querySelector("#afilioTracking").innerHTML = "Sim";
            document.querySelector("#afilioID").innerHTML = arr[2];
            document.querySelector("#afilioExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
        }
        else if(arr[1].toLowerCase() == "parcerias_cityads"){
            document.querySelector("#cityadsTracking").innerHTML = "Sim";
            document.querySelector("#cityadsID").innerHTML = arr[2];
            document.querySelector("#cityadsExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
        }
        else if(arr[1].toLowerCase() == "parcerias_rakuten"){
            document.querySelector("#rakutenTracking").innerHTML = "Sim";
            document.querySelector("#rakutenID").innerHTML = arr[2];
            document.querySelector("#rakutenExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
        }
        else if(arr[1].toLowerCase() == "parcerias_zanox"){
            document.querySelector("#zanoxTracking").innerHTML = "Sim";
            document.querySelector("#zanoxID").innerHTML = arr[2];
            document.querySelector("#zanoxExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
        }
        else if(arr[1].toLowerCase() == "parcerias_lomadee"){
            document.querySelector("#lomadeeTracking").innerHTML = "Sim";
            document.querySelector("#lomadeeID").innerHTML = arr[5];
            document.querySelector("#lomadeeExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
        }
        else if(arr[1].toLowerCase() == "parcerias_weach"){
            document.querySelector("#weachTracking").innerHTML = "Sim";
            document.querySelector("#weachID").innerHTML = arr[5];
            document.querySelector("#weachExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
        }
        else if(/tracker.lomadee.com/.test(arr[3])){
            document.querySelector("#lomadeeTracking").innerHTML = "Sim";
            document.querySelector("#lomadeeID").innerHTML = arr[2];
            document.querySelector("#lomadeeExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
        }
        else{
            document.querySelector("#outerTracking").innerHTML = "Sim";
            document.querySelector("#outerAffname").innerHTML = arr[1];
            document.querySelector("#outerID").innerHTML = arr[5];
            document.querySelector("#outerExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
        }
    }
    
    if(/s_eVar/i.test(cookie.name)){//Walmart
        var list = JSON.parse(str_replace("'", '"', urldecode(cookie.value)));
        
        console.log(list);
        
        for(var keyWalmart in list){
            switch(list[keyWalmart][0].toLowerCase()){
                case "actionpay": 
                    document.querySelector("#actionpayTracking").innerHTML = "Sim";
                    if(list[keyWalmart][1]) document.querySelector("#actionpayID").innerHTML = list[keyWalmart][1];
                break;
                case "afilio": 
                    document.querySelector("#afilioTracking").innerHTML = "Sim";
                    if(list[keyWalmart][1]) document.querySelector("#afilioID").innerHTML = list[keyWalmart][1];
                break;
                case "cityads": 
                    document.querySelector("#cityadsTracking").innerHTML = "Sim";
                    if(list[keyWalmart][1]) document.querySelector("#cityadsID").innerHTML = list[keyWalmart][1];
                break;
                case "lomadee": 
                    document.querySelector("#lomadeeTracking").innerHTML = "Sim";
                    if(list[keyWalmart][1]) document.querySelector("#lomadeeID").innerHTML = list[keyWalmart][1];
                break;
                case "zanox": 
                    document.querySelector("#zanoxTracking").innerHTML = "Sim";
                    if(list[keyWalmart][1]) document.querySelector("#zanoxID").innerHTML = list[keyWalmart][1];
                break;
                case "home": break;
                default: 
                    document.querySelector("#outerTracking").innerHTML = "Sim";
                    if(list[keyWalmart][0]) document.querySelector("#outerAffname").innerHTML = list[keyWalmart][0];
                    if(list[keyWalmart][1]) document.querySelector("#outerID").innerHTML = list[keyWalmart][1];
                    if(value) document.querySelector("#outerExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
            }
        }
    }
        
    switch(cookie.name.toLowerCase()){
        case "b2wepar": //Afiliados B2W
            switch(cookie.value.toLowerCase()){
                case "afilio": 
                    document.querySelector("#afilioTracking").innerHTML = "Sim";
                    document.querySelector("#afilioExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
                case "b2wafiliados": 
                    document.querySelector("#afiliadosTracking").innerHTML = "Sim";
                break;
                case "lomadee": 
                    document.querySelector("#lomadeeTracking").innerHTML = "Sim";
                break;
                default: 
                    document.querySelector("#afiliadosTracking").innerHTML = "Sim";
                    document.querySelector("#afiliadosID").innerHTML = cookie.value;
                    document.querySelector("#afiliadosExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
            }
        break;
        case "acomepar": //Americanas Parceiro
            switch(cookie.value.toLowerCase()){
                case "afilio": 
                    document.querySelector("#afilioTracking").innerHTML = "Sim";
                    document.querySelector("#afilioExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
                case "b2wafiliados": 
                    document.querySelector("#afiliadosTracking").innerHTML = "Sim";
                break;
                case "lomadee": 
                    document.querySelector("#lomadeeTracking").innerHTML = "Sim";
                break;
                default: 
                    document.querySelector("#afiliadosTracking").innerHTML = "Sim";
                    document.querySelector("#afiliadosID").innerHTML = cookie.value;
                    document.querySelector("#afiliadosExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
            }
        break;
        case "b2wfranq": //Pixel B2W Afiliados
            document.querySelector("#afiliadosTracking").innerHTML = "Sim";
            document.querySelector("#afiliadosID").innerHTML = cookie.value;
            document.querySelector("#afiliadosExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
        break;
        case "clickcityadsid": //Pixel Cityads
        case "click_id":
        case "clickid":
        case "_cityads_clickid":
        case "cityads_click_id":
        case "ctad_clkid":
        case "cityadsclickidv2":
        case "ctad_clickid":
            document.querySelector("#cityadsTracking").innerHTML = "Sim";
            document.querySelector("#cityadsID").innerHTML = cookie.value;
            document.querySelector("#cityadsExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
        break;
        case "lomadee_traffic": //Pixel Lomadee
            document.querySelector("#lomadeeTracking").innerHTML = "Sim";
        break;
        case "zanox": //Pixel Zanox
            document.querySelector("#zanoxTracking").innerHTML = "Sim";                    
            document.querySelector("#zanoxID").innerHTML = getCookie("zanpid", cookies);
            document.querySelector("#zanoxExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
        break;
        case "zanpid": //Pixel Zanox
        case "cea_zanpid":
        case "sitemetadata.zanpid":
        case "qdzanoxid":
        case "yzanpid":
        case "znx_zanpid":
        case "zx_pid":
        case "zanox__session":
            document.querySelector("#zanoxTracking").innerHTML = "Sim";                    
            document.querySelector("#zanoxID").innerHTML = cookie.value;
        break;
        case "zanox_cookie":
            var divv = cookie.value.split("#");
            document.querySelector("#zanoxTracking").innerHTML = "Sim";                    
            document.querySelector("#zanoxID").innerHTML = divv[1];
        break;
        case "rakuten": //Pixel Rakuten
            document.querySelector("#rakutenTracking").innerHTML = "Sim";                    
            document.querySelector("#rakutenID").innerHTML = getCookie("linkshare_siteid", cookies);
            document.querySelector("#rakutenExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
        break;
        case "linkshare_siteid": //Pixel Rakuten
            document.querySelector("#rakutenTracking").innerHTML = "Sim";                    
            document.querySelector("#rakutenID").innerHTML = cookie.value.split("-")[0];
            document.querySelector("#rakutenExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
        break;
        case "actionpay": //Picel Actionpay
            var divv = cookie.value.split(".");      
            document.querySelector("#actionpayTracking").innerHTML = "Sim";                    
            document.querySelector("#actionpayID").innerHTML = divv[1];
            document.querySelector("#actionpayExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
        break;
        case "origem": //Padrão de algumas lojas
        case "source":
        case "cookieorigem":
        case "canal":
        case "_sdsat_utm_source":
            var value = getCookie("AFFILIATEID", cookies) || getQuery(getCookie("Parceiro_Click", cookies), "Id");
            switch(cookie.value.toLowerCase()){
                case "actionpay": 
                    document.querySelector("#actionpayTracking").innerHTML = "Sim";
                    if(value) document.querySelector("#actionpayID").innerHTML = value;
                break;
                case "afilio": 
                    document.querySelector("#afilioTracking").innerHTML = "Sim";
                    if(value) document.querySelector("#afilioID").innerHTML = value;
                break;
                case "cityads": 
                    document.querySelector("#cityadsTracking").innerHTML = "Sim";
                    if(value) document.querySelector("#cityadsID").innerHTML = value;
                break;
                case "lomadee": 
                    document.querySelector("#lomadeeTracking").innerHTML = "Sim";
                    if(value) document.querySelector("#lomadeeID").innerHTML = value;
                break;
                case "zanox": 
                    document.querySelector("#zanoxTracking").innerHTML = "Sim";
                    if(value) document.querySelector("#zanoxID").innerHTML = value;
                break;
                default: 
                    document.querySelector("#outerTracking").innerHTML = "Sim";
                    document.querySelector("#outerAffname").innerHTML = cookie.value;
                    document.querySelector("#outerID").innerHTML = value;
                    if(value) document.querySelector("#outerExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
            }
        break;
        case "__utmz": //Google Adsense
        case "_utmz":        
            var divv = cookie.value.split("|");
            var program = divv[0].replace(/(.*?utmcsr=).*?/, "").replace("B2C_Afiliados_", "").replace("_Kangoolu", "");
             
            switch(program.toLowerCase()){
                case "actionpay": 
                    document.querySelector("#actionpayTracking").innerHTML = "Sim";
                    document.querySelector("#actionpayExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
                case "afilio": 
                    document.querySelector("#afilioTracking").innerHTML = "Sim";
                    document.querySelector("#afilioExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
                case "cityads": 
                case "cityadsgeral": 
                    document.querySelector("#cityadsTracking").innerHTML = "Sim";
                    document.querySelector("#cityadsExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
                case "lomadee": 
                case "aff_lomadee": 
                    document.querySelector("#lomadeeTracking").innerHTML = "Sim";
                    document.querySelector("#lomadeeExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
                case "rakuten": 
                    document.querySelector("#rakutenTracking").innerHTML = "Sim";
                    document.querySelector("#rakutenExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
                case "zanox": 
                case "aff_zanox": 
                    document.querySelector("#zanoxTracking").innerHTML = "Sim";                    
                    document.querySelector("#zanoxExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
                case "(direct)": break;
                default: 
                    document.querySelector("#outerTracking").innerHTML = "Sim";
                    document.querySelector("#outerAffname").innerHTML = program;
                    document.querySelector("#outerExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
            }
        break;
        case "_utm": //Padrão Google Adsense
        case "yutmsource": //vTex
        case "utm_campaign_banner":
        case "last_utm_source":
            switch(cookie.value.toLowerCase()){
                case "actionpay": 
                    document.querySelector("#actionpayTracking").innerHTML = "Sim";
                    document.querySelector("#actionpayID").innerHTML = getCookie("_utmMedium", cookies) || "";
                    document.querySelector("#actionpayExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
                case "afilio": 
                    document.querySelector("#afilioTracking").innerHTML = "Sim";
                    document.querySelector("#afilioID").innerHTML = getCookie("_utmMedium", cookies) || "";
                    document.querySelector("#afilioExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
                case "cityads": 
                    document.querySelector("#cityadsTracking").innerHTML = "Sim";
                    document.querySelector("#cityadsID").innerHTML = getCookie("_utmMedium", cookies) || "";
                    document.querySelector("#cityadsExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
                case "lomadee": 
                    document.querySelector("#lomadeeTracking").innerHTML = "Sim";
                    document.querySelector("#lomadeeID").innerHTML = getCookie("_utmMedium", cookies) || "";
                    document.querySelector("#lomadeeExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
                case "rakuten": 
                    document.querySelector("#rakutenTracking").innerHTML = "Sim";
                    document.querySelector("#rakutenID").innerHTML = getCookie("_utmMedium", cookies) || "";
                    document.querySelector("#rakutenExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
                case "zanox": 
                    document.querySelector("#zanoxTracking").innerHTML = "Sim";                    
                    document.querySelector("#zanoxID").innerHTML = getCookie("_utmMedium", cookies) || "";
                    document.querySelector("#zanoxExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
                default: 
                    document.querySelector("#outerTracking").innerHTML = "Sim";
                    document.querySelector("#outerAffname").innerHTML = cookie.value;
                    document.querySelector("#outerID").innerHTML = getCookie("_utmMedium", cookies) || "";
                    document.querySelector("#outerExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
            }
        break;
        case "_mkt"://Elo 7
            try{
                var mkt = JSON.parse(JSON.parse(cookie.value));

                switch(mkt.source.toLowerCase()){
                    case "actionpay": 
                        document.querySelector("#actionpayTracking").innerHTML = "Sim";
                        document.querySelector("#actionpayID").innerHTML = mkt.clickId;
                        document.querySelector("#actionpayExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                    break;
                    case "afilio": 
                        document.querySelector("#afilioTracking").innerHTML = "Sim";
                        document.querySelector("#afilioID").innerHTML = mkt.clickId;
                        document.querySelector("#afilioExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                    break;
                    case "cityads": 
                        document.querySelector("#cityadsTracking").innerHTML = "Sim";
                        document.querySelector("#cityadsID").innerHTML = mkt.clickId;
                        document.querySelector("#cityadsExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                    break;
                    case "lomadee": 
                        document.querySelector("#lomadeeTracking").innerHTML = "Sim";
                        document.querySelector("#lomadeeID").innerHTML = mkt.clickId;
                        document.querySelector("#lomadeeExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                    break;
                    case "rakuten": 
                        document.querySelector("#rakutenTracking").innerHTML = "Sim";
                        document.querySelector("#rakutenID").innerHTML = mkt.clickId;
                        document.querySelector("#rakutenExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                    break;
                    case "zanox": 
                        document.querySelector("#zanoxTracking").innerHTML = "Sim";                    
                        document.querySelector("#zanoxID").innerHTML = mkt.clickId;
                        document.querySelector("#zanoxExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                    break;
                    default: 
                        document.querySelector("#outerTracking").innerHTML = "Sim";
                        document.querySelector("#outerAffname").innerHTML = mkt.source;
                        document.querySelector("#outerID").innerHTML = mkt.clickId;
                        document.querySelector("#outerExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                    break;
                }
            }
            catch(e){}
        break;
        case "oppuz_src"://Elo 7
            try{
                var src = JSON.parse(urldecode(cookie.value));

                switch(src.utm.source.toLowerCase()){
                    case "actionpay": 
                        document.querySelector("#actionpayTracking").innerHTML = "Sim";
                        document.querySelector("#actionpayID").innerHTML = src.utm.content || src.utm.medium;
                        document.querySelector("#actionpayExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                    break;
                    case "afilio": 
                        document.querySelector("#afilioTracking").innerHTML = "Sim";
                        document.querySelector("#afilioID").innerHTML = src.utm.content || src.utm.medium;
                        document.querySelector("#afilioExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                    break;
                    case "cityads": 
                        document.querySelector("#cityadsTracking").innerHTML = "Sim";
                        document.querySelector("#cityadsID").innerHTML = src.utm.content || src.utm.medium;
                        document.querySelector("#cityadsExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                    break;
                    case "lomadee": 
                        document.querySelector("#lomadeeTracking").innerHTML = "Sim";
                        document.querySelector("#lomadeeID").innerHTML = src.utm.content || src.utm.medium;
                        document.querySelector("#lomadeeExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                    break;
                    case "linkshare":
                    case "rakuten": 
                        document.querySelector("#rakutenTracking").innerHTML = "Sim";
                        document.querySelector("#rakutenID").innerHTML = src.utm.content || src.utm.medium;
                        document.querySelector("#rakutenExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                    break;
                    case "zanox": 
                        document.querySelector("#zanoxTracking").innerHTML = "Sim";                    
                        document.querySelector("#zanoxID").innerHTML = src.utm.term || src.utm.medium;
                        document.querySelector("#zanoxExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                    break;
                    default: 
                        document.querySelector("#outerTracking").innerHTML = "Sim";
                        document.querySelector("#outerAffname").innerHTML = src.utm.source;
                        document.querySelector("#outerID").innerHTML = src.utm.medium;
                        document.querySelector("#outerExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                    break;
                }
            }
            catch(e){}
        break;
        case "utm_campaign": //Netshoes     
            if(/rkten/.test(cookie.value)){
                var program = cookie.value.replace("me-s_", "");
                document.querySelector("#rakutenTracking").innerHTML = "Sim";
                document.querySelector("#rakutenID").innerHTML = program.split("_")[1];
                document.querySelector("#rakutenExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
            }
            else{
                var affiliate = cookie.value.split("-_-");
                var program = affiliate[0].replace("me-s_", "");
                var id = affiliate[3].replace("_var_me__afiliados___", "").split("_")[0];
            
                switch(program.toLowerCase()){
                    case "zanx": 
                        document.querySelector("#zanoxTracking").innerHTML = "Sim";  
                        document.querySelector("#zanoxID").innerHTML = id;
                        document.querySelector("#zanoxExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                    break;
                    case "lmde": 
                        document.querySelector("#lomadeeTracking").innerHTML = "Sim";
                        document.querySelector("#lomadeeID").innerHTML = id;
                        document.querySelector("#lomadeeExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                    break;
                    default: 
                        document.querySelector("#outerTracking").innerHTML = "Sim";
                        document.querySelector("#outerAffname").innerHTML = affiliate;
                        document.querySelector("#outerExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                    break;
                }
            }            
        break;
        case "ips"://VTEX
            try{
                var affiliate = getQuery(cookie.value, "Parceiro");
                
                if(affiliate == "public")
                    var affiliate = getQuery(cookie.value, "Campanha");

                switch(affiliate.toLowerCase()){
                    case "actionpay": 
                        document.querySelector("#actionpayTracking").innerHTML = "Sim";
                        document.querySelector("#actionpayExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                    break;
                    case "afilio": 
                        document.querySelector("#afilioTracking").innerHTML = "Sim";
                        document.querySelector("#afilioExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                    break;
                    case "cityads": 
                        document.querySelector("#cityadsTracking").innerHTML = "Sim";
                        document.querySelector("#cityadsExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                    break;
                    case "indexa": 
                        document.querySelector("#indexaTracking").innerHTML = "Sim";                    
                        document.querySelector("#indexaExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                    break;
                    case "lomadee": 
                        document.querySelector("#lomadeeTracking").innerHTML = "Sim";
                        document.querySelector("#lomadeeExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                    break;
                    case "rakuten": 
                        document.querySelector("#rakutenTracking").innerHTML = "Sim";
                        document.querySelector("#rakutenExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                    break;
                    case "weach": 
                        document.querySelector("#weachTracking").innerHTML = "Sim";                    
                        document.querySelector("#weachExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                    break;
                    case "zanox": 
                        document.querySelector("#zanoxTracking").innerHTML = "Sim";                    
                        document.querySelector("#zanoxExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                    break;
                    default: 
                        document.querySelector("#outerTracking").innerHTML = "Sim";
                        document.querySelector("#outerAffname").innerHTML = affiliate;
                        document.querySelector("#outerExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                    break;
                }
            }
            catch(e){}
        break;
        case "ips-casasbahia":
        case "ips-pontofrio.com":
        case "ips-extra.com":
            var affiliate = getQuery(cookie.value, "Parceiro");
            
            switch(affiliate.toLowerCase()){
                case "actionpay": 
                    document.querySelector("#actionpayTracking").innerHTML = "Sim";
                    document.querySelector("#actionpayExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
                case "afilio": 
                    document.querySelector("#afilioTracking").innerHTML = "Sim";
                    document.querySelector("#afilioExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
                case "cityads": 
                    document.querySelector("#cityadsTracking").innerHTML = "Sim";
                    document.querySelector("#cityadsExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
                case "indexa": 
                    document.querySelector("#indexaTracking").innerHTML = "Sim";                    
                    document.querySelector("#indexaExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
                case "lomadee": 
                    document.querySelector("#lomadeeTracking").innerHTML = "Sim";
                    document.querySelector("#lomadeeExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
                case "rakuten": 
                    document.querySelector("#rakutenTracking").innerHTML = "Sim";
                    document.querySelector("#rakutenExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
                case "weach": 
                    document.querySelector("#weachTracking").innerHTML = "Sim";                    
                    document.querySelector("#weachExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
                case "zanox": 
                    document.querySelector("#zanoxTracking").innerHTML = "Sim";                    
                    document.querySelector("#zanoxExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
                default: 
                    document.querySelector("#outerTracking").innerHTML = "Sim";
                    document.querySelector("#outerAffname").innerHTML = affiliate;
                    document.querySelector("#outerExpiration").innerHTML = moment(cookie.expirationDate).format('DD/MM/YY, hh:mm:ss');
                break;
            }
        break;
    }
}

function getCookie(name, cookies){
    for(var key in cookies){
        if(cookies[key].name == name){
            return (cookies[key].value !== undefined && cookies[key].value !== "undefined") ? cookies[key].value : "";
            break;
        }
    }
}

function getQuery(query, key){
    if(typeof query === "string"){
        var query_string = {};
        var vars = query.split("&");

        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");

            if (typeof query_string[pair[0]] === "undefined") {
                query_string[pair[0]] = decodeURIComponent(pair[1]);
            } else if (typeof query_string[pair[0]] === "string") {
                var arr = [query_string[pair[0]], decodeURIComponent(pair[1])];
                query_string[pair[0]] = arr;
            } else {
                query_string[pair[0]].push(decodeURIComponent(pair[1]));
            }
        } 

        return query_string[key]; 
    }
    else{
        return null;
    }
}

function checkPoint(){
    storage.get('tracking-'+location.hostname, function (item){
        var trackingCache = item['tracking-'+location.hostname];            
        
        if(trackingCache){
            if(trackingCache.actionpay.tracking !== "Sim")
                document.querySelector("#actionpay").style.display = "none";
            else
                document.querySelector("#actionpay").style.display = "block";
            
            if(trackingCache.afiliados.tracking !== "Sim")
                document.querySelector("#afiliados").style.display = "none";
            else
                document.querySelector("#afiliados").style.display = "block";
            
            if(trackingCache.afilio.tracking !== "Sim")
                document.querySelector("#afilio").style.display = "none";
            else
                document.querySelector("#afilio").style.display = "block";
            
            if(trackingCache.cityads.tracking !== "Sim")
                document.querySelector("#cityads").style.display = "none";
            else
                document.querySelector("#cityads").style.display = "block";
            
            if(trackingCache.indexa.tracking !== "Sim")
                document.querySelector("#indexa").style.display = "none";
            else
                document.querySelector("#indexa").style.display = "block";
            
            if(trackingCache.lomadee.tracking !== "Sim")
                document.querySelector("#lomadee").style.display = "none";
            else
                document.querySelector("#lomadee").style.display = "block";
            
            if(trackingCache.rakuten.tracking !== "Sim")
                document.querySelector("#rakuten").style.display = "none";
            else
                document.querySelector("#rakuten").style.display = "block";
            
            if(trackingCache.weach.tracking !== "Sim")
                document.querySelector("#weach").style.display = "none";
            else
                document.querySelector("#weach").style.display = "block";
            
            if(trackingCache.zanox.tracking !== "Sim")
                document.querySelector("#zanox").style.display = "none";
            else
                document.querySelector("#zanox").style.display = "block";
            
            if(trackingCache.outer.tracking !== "Sim")
                document.querySelector("#outer").style.display = "none";
            else
                document.querySelector("#outer").style.display = "block";
            
            if(trackingCache.actionpay.tracking !== "Sim" && 
               trackingCache.afiliados.tracking !== "Sim" && 
               trackingCache.cityads.tracking !== "Sim" && 
               trackingCache.indexa.tracking !== "Sim" && 
               trackingCache.lomadee.tracking !== "Sim" && 
               trackingCache.rakuten.tracking !== "Sim" && 
               trackingCache.weach.tracking !== "Sim" && 
               trackingCache.zanox.tracking !== "Sim" && 
               trackingCache.outer.tracking !== "Sim")
                document.querySelector("#empty").style.display = "block";
            else
                document.querySelector("#empty").style.display = "none";
            
            //Diferenças 
            
            //Actionpay
            if(trackingCache.actionpay.tracking !== document.querySelector("#actionpayTracking").innerHTML){
                document.querySelector("#actionpayTracking").style.backgroundColor = "#FF0000";
                
                if(document.querySelector("#actionpayTracking").innerHTML == "Sim")
                    message("Alteração em cookie", "O tracking da Actionpay foi ativado");
                else
                    message("Alteração em cookie", "O tracking da Actionpay foi removido");
            }
            
            if(trackingCache.actionpay.id !== document.querySelector("#actionpayID").innerHTML){
                document.querySelector("#actionpayID").style.backgroundColor = "#FF0000";
                message("Alteração em cookie", "O ID de afiliado da Actionpay foi alterado de '"+trackingCache.actionpay.id+ "' para '"+document.querySelector("#actionpayID").innerHTML+"'");
            }
            
            //Afiliados
            if(trackingCache.afiliados.tracking !== document.querySelector("#afiliadosTracking").innerHTML){
                document.querySelector("#afiliadosTracking").style.backgroundColor = "#FF0000";
                
                if(document.querySelector("#afiliadosTracking").innerHTML == "Sim")
                    message("Alteração em cookie", "O tracking da Afiliados B2W foi ativado");
                else
                    message("Alteração em cookie", "O tracking da Afiliados B2W foi removido");
            }
            
            if(trackingCache.afiliados.id !== document.querySelector("#afiliadosID").innerHTML){
                document.querySelector("#afiliadosID").style.backgroundColor = "#FF0000";
                message("Alteração em cookie", "O ID de afiliado da Afiliados B2W foi alterado de '"+trackingCache.afiliados.id+ "' para '"+document.querySelector("#afiliadosID").innerHTML+"'");
            }
            
            //Afilio
            if(trackingCache.afilio.tracking !== document.querySelector("#afilioTracking").innerHTML){
                document.querySelector("#afilioTracking").style.backgroundColor = "#FF0000";
                
                if(document.querySelector("#afilioTracking").innerHTML == "Sim")
                    message("Alteração em cookie", "O tracking da Afilio foi ativado");
                else
                    message("Alteração em cookie", "O tracking da Afilio foi removido");
            }
            
            if(trackingCache.afilio.id !== document.querySelector("#afilioID").innerHTML){
                document.querySelector("#afilioID").style.backgroundColor = "#FF0000";
                message("Alteração em cookie", "O ID de afiliado da Afilio foi alterado de '"+trackingCache.afilio.id+ "' para '"+document.querySelector("#afilioID").innerHTML+"'");
            }
            
            //Cityads
            if(trackingCache.cityads.tracking !== document.querySelector("#cityadsTracking").innerHTML){
                document.querySelector("#cityadsTracking").style.backgroundColor = "#FF0000";
                
                if(document.querySelector("#cityadsTracking").innerHTML == "Sim")
                    message("Alteração em cookie", "O tracking da CityAds foi ativado");
                else
                    message("Alteração em cookie", "O tracking da CityAds foi removido");
            }
            
            if(trackingCache.cityads.id !== document.querySelector("#cityadsID").innerHTML){
                document.querySelector("#cityadsID").style.backgroundColor = "#FF0000";
                message("Alteração em cookie", "O ID de afiliado da CityAds foi alterado de '"+trackingCache.cityads.id+ "' para '"+document.querySelector("#cityadsID").innerHTML+"'");
            }
            
            //Indexa Network
            if(trackingCache.indexa.tracking !== document.querySelector("#indexaTracking").innerHTML){
                document.querySelector("#indexaTracking").style.backgroundColor = "#FF0000";
                
                if(document.querySelector("#indexaTracking").innerHTML == "Sim")
                    message("Alteração em cookie", "O tracking da Indexa Network foi ativado");
                else
                    message("Alteração em cookie", "O tracking da Indexa Network foi removido");
            }
            
            if(trackingCache.indexa.id !== document.querySelector("#indexaID").innerHTML){
                document.querySelector("#indexaID").style.backgroundColor = "#FF0000";
                message("Alteração em cookie", "O ID de afiliado da Indexa Network foi alterado de '"+trackingCache.indexa.id+ "' para '"+document.querySelector("#indexaID").innerHTML+"'");
            }
            
            //Lomadee
            if(trackingCache.lomadee.tracking !== document.querySelector("#lomadeeTracking").innerHTML){
                document.querySelector("#lomadeeTracking").style.backgroundColor = "#FF0000";
                
                if(document.querySelector("#lomadeeTracking").innerHTML == "Sim")
                    message("Alteração em cookie", "O tracking da Lomadee foi ativado");
                else
                    message("Alteração em cookie", "O tracking da Lomadee foi removido");
            }
            
            if(trackingCache.lomadee.id !== document.querySelector("#lomadeeID").innerHTML){
                document.querySelector("#lomadeeID").style.backgroundColor = "#FF0000";
                message("Alteração em cookie", "O ID de afiliado da Lomadee foi alterado de '"+trackingCache.lomadee.id+ "' para '"+document.querySelector("#lomadeeID").innerHTML+"'");
            }
            
            //Rakuten
            if(trackingCache.rakuten.tracking !== document.querySelector("#rakutenTracking").innerHTML){
                document.querySelector("#rakutenTracking").style.backgroundColor = "#FF0000";
                
                if(document.querySelector("#rakutenTracking").innerHTML == "Sim")
                    message("Alteração em cookie", "O tracking da Rakuten foi ativado");
                else
                    message("Alteração em cookie", "O tracking da Rakuten foi removido");
            }
            
            if(trackingCache.rakuten.id !== document.querySelector("#rakutenID").innerHTML){
                document.querySelector("#rakutenID").style.backgroundColor = "#FF0000";
                message("Alteração em cookie", "O ID de afiliado da Rakuten foi alterado de '"+trackingCache.rakuten.id+ "' para '"+document.querySelector("#rakutenID").innerHTML+"'");
            }
            
            //Weach
            if(trackingCache.weach.tracking !== document.querySelector("#weachTracking").innerHTML){
                document.querySelector("#weachTracking").style.backgroundColor = "#FF0000";
                
                if(document.querySelector("#weachTracking").innerHTML == "Sim")
                    message("Alteração em cookie", "O tracking da Weach foi ativado");
                else
                    message("Alteração em cookie", "O tracking da Weach foi removido");
            }
            
            if(trackingCache.weach.id !== document.querySelector("#weachID").innerHTML){
                document.querySelector("#weachID").style.backgroundColor = "#FF0000";
                message("Alteração em cookie", "O ID de afiliado da Weach foi alterado de '"+trackingCache.weach.id+ "' para '"+document.querySelector("#weachID").innerHTML+"'");
            }
               
            //Zanox
            if(trackingCache.zanox.tracking !== document.querySelector("#zanoxTracking").innerHTML){
                document.querySelector("#zanoxTracking").style.backgroundColor = "#FF0000";
                
                if(document.querySelector("#zanoxTracking").innerHTML == "Sim")
                    message("Alteração em cookie", "O tracking da Zanox foi ativado");
                else
                    message("Alteração em cookie", "O tracking da Zanox foi removido");
            }
            
            if(trackingCache.zanox.id !== document.querySelector("#zanoxID").innerHTML){
                document.querySelector("#zanoxID").style.backgroundColor = "#FF0000";
                message("Alteração em cookie", "O ID de afiliado da Zanox foi alterado de '"+trackingCache.zanox.id+ "' para '"+document.querySelector("#zanoxID").innerHTML+"'");
            }
            
            //Outer
            if(trackingCache.outer.tracking !== document.querySelector("#outerTracking").innerHTML){
                document.querySelector("#outerTracking").style.backgroundColor = "#FF0000";
                
                if(document.querySelector("#outerTracking").innerHTML == "Sim")
                    message("Alteração em cookie", "O tracking desconhecido foi ativado");
                else
                    message("Alteração em cookie", "O tracking desconhecido foi removido");
            }
            
            if(trackingCache.outer.affname !== document.querySelector("#outerAffname").innerHTML){
                document.querySelector("#outerID").style.backgroundColor = "#FF0000";
                message("Alteração em cookie", "O Nome do afiliado desconhecido foi alterado de '"+trackingCache.outer.affname+ "' para '"+document.querySelector("#outerAffname").innerHTML+"'");
            }
            
            if(trackingCache.outer.id !== document.querySelector("#outerID").innerHTML){
                document.querySelector("#outerID").style.backgroundColor = "#FF0000";
                message("Alteração em cookie", "O ID de afiliado desconhecido foi alterado de '"+trackingCache.outer.id+ "' para '"+document.querySelector("#outerID").innerHTML+"'");
            }
        }
        
        var data = {
            actionpay: {
                tracking: document.querySelector("#actionpayTracking").innerHTML,
                id: document.querySelector("#actionpayID").innerHTML
            },
            afiliados: {
                tracking: document.querySelector("#afiliadosTracking").innerHTML,
                id: document.querySelector("#afiliadosID").innerHTML
            },
            afilio: {
                tracking: document.querySelector("#afilioTracking").innerHTML,
                id: document.querySelector("#afilioID").innerHTML
            },
            cityads: {
                tracking: document.querySelector("#cityadsTracking").innerHTML,
                id: document.querySelector("#cityadsID").innerHTML
            },
            indexa: {
                tracking: document.querySelector("#indexaTracking").innerHTML,
                id: document.querySelector("#indexaID").innerHTML
            },
            lomadee: {
                tracking: document.querySelector("#lomadeeTracking").innerHTML,
                id: document.querySelector("#lomadeeID").innerHTML
            },
            rakuten: {
                tracking: document.querySelector("#rakutenTracking").innerHTML,
                id: document.querySelector("#rakutenID").innerHTML
            },
            zanox: {
                tracking: document.querySelector("#zanoxTracking").innerHTML,
                id: document.querySelector("#zanoxID").innerHTML
            },
            weach: {
                tracking: document.querySelector("#weachTracking").innerHTML,
                id: document.querySelector("#weachID").innerHTML
            },
            outer: {
                tracking: document.querySelector("#outerTracking").innerHTML,
                affname: document.querySelector("#outerAffname").innerHTML,
                id: document.querySelector("#outerID").innerHTML
            }
        };

        var s = {};
        s['tracking-' + location.hostname] = data;            
        storage.set(s);
    });
}

function checkInjectionPixel(){
    $(".injectionPixel").css("display", "none");
    
    $("script").each(function(){
        var src = $(this).attr("src");
        
        if(/googletagmanager.com/i.test(src))
            $("#injectionPixelGoogleTagManager").css("display", "block");
        if(/facebook.com\/tr/i.test(src))
            $("#injectionPixelFacebook").css("display", "block");
        if(/uol.com.br/i.test(src) || /jsuol.com.br/i.test(src))
            $("#injectionPixelUolTagManager").css("display", "block");
        if(/soclminer.com.br/i.test(src))
            $("#injectionPixelSocialMiner").css("display", "block");
        if(/chaordicsystems/i.test(src))
            $("#injectionPixelChaordic").css("display", "block");
        if(/shopconvert.com.br/i.test(src) || /shoptarget.com.br/i.test(src) || /sback.tech/i.test(src) || /rest.sback.tech/i.test(src))
            $("#injectionPixelShopback").css("display", "block");
        if(/trustvox.com.br/i.test(src))
            $("#injectionPixelTrustvox").css("display", "block");
        if(/boostbox.com.br/i.test(src))
            $("#injectionPixelBoostbox").css("display", "block");
        if(/biggylabs.com/i.test(src))
            $("#injectionPixelBiggyLabs").css("display", "block");
        if(/laas.neemu.com/i.test(src))
            $("#injectionPixelNeemu").css("display", "block");
        if(/criteo.net/i.test(src))
            $("#injectionPixelCriteo").css("display", "block");
        if(/mouseflow.com/i.test(src))
            $("#injectionPixelMouseFlow").css("display", "block");
        if(/crazyegg.com/i.test(src))
            $("#injectionPixelCrazyEgg").css("display", "block");
        if(/percycle.com/i.test(src))
            $("#injectionPixelPercycle").css("display", "block");
        if(/btg360.com.br/i.test(src))
            $("#injectionPixelBTG360").css("display", "block");
        if(/curtivendi.com.br/i.test(src))
            $("#injectionPixelCurtiVendi").css("display", "block");
        if(/inspectlet.com/i.test(src))
            $("#injectionPixelInspectlet").css("display", "block");
        if(/smartlook.com/i.test(src))
            $("#injectionPixelSmartlook").css("display", "block");
        if(/mediamath.com/i.test(src) || /aprtn.com/i.test(src))
            $("#injectionPixelMediaMath").css("display", "block");
        if(/perfectaudiencertg.com/i.test(src))
            $("#injectionPixelPerfectAudienceRetargeting").css("display", "block");
        if(/hotjar.com/i.test(src))
            $("#injectionPixelHotjar").css("display", "block");
        if(/veinteractive.com/i.test(src))
            $("#injectionPixelVeInteractive").css("display", "block");
        if(/navdmp.com/i.test(src))
            $("#injectionPixelNavegg").css("display", "block");
        if(/voxus-targeting/i.test(src))
            $("#injectionPixelVorus").css("display", "block");
        if(/akna.com/i.test(src))
            $("#injectionPixelAkna").css("display", "block");
        if(/mediapostcommunication.net/i.test(src))
            $("#injectionPixelMediaPostCommunication").css("display", "block");
        if(/adschoom.com/i.test(src))
            $("#injectionPixelAdschoom").css("display", "block");
        if(/yourviews.com.br/i.test(src))
            $("#injectionPixelYourviews").css("display", "block");
        if(/hariken.co/i.test(src))
            $("#injectionPixelHariken").css("display", "block");
        if(/pensebig.com.br/i.test(src))
            $("#injectionPixelPensebig").css("display", "block");

        //Pixel
        if(/aprtx.com/i.test(src))
            $("#injectionPixelActionpay").css("display", "block");
        if(/afilio.com.br/i.test(src))
            $("#injectionPixelAfilio").css("display", "block");
        if(/cityads.com/i.test(src) || /cityadspix.com/i.test(src) || /nfemo.com/i.test(src))
            $("#injectionPixelAfilio").css("display", "block");
        if(/efiliacao.com.br/i.test(src))
            $("#injectionPixelEffiliation").css("display", "block");
        if(/publicidees.com/i.test(src))
            $("#injectionPixelTimeone").css("display", "block");
        if(/zanox.com/i.test(src))
            $("#injectionPixelZanox").css("display", "block");
    });
}

function message(tile, desc){
    chrome.runtime.sendMessage({msg: desc, title: tile});
}

function urldecode (str) {
  return decodeURIComponent((str + '')
    .replace(/%(?![\da-f]{2})/gi, function () {
        return '%25'
    })
    .replace(/\+/g, '%20'))
}

function str_replace (search, replace, subject, countObj) { // eslint-disable-line camelcase
  var i = 0
  var j = 0
  var temp = ''
  var repl = ''
  var sl = 0
  var fl = 0
  var f = [].concat(search)
  var r = [].concat(replace)
  var s = subject
  var ra = Object.prototype.toString.call(r) === '[object Array]'
  var sa = Object.prototype.toString.call(s) === '[object Array]'
  s = [].concat(s)

  var $global = (typeof window !== 'undefined' ? window : global)
  $global.$locutus = $global.$locutus || {}
  var $locutus = $global.$locutus
  $locutus.php = $locutus.php || {}

  if (typeof (search) === 'object' && typeof (replace) === 'string') {
    temp = replace
    replace = []
    for (i = 0; i < search.length; i += 1) {
      replace[i] = temp
    }
    temp = ''
    r = [].concat(replace)
    ra = Object.prototype.toString.call(r) === '[object Array]'
  }

  if (typeof countObj !== 'undefined') {
    countObj.value = 0
  }

  for (i = 0, sl = s.length; i < sl; i++) {
    if (s[i] === '') {
      continue
    }
    for (j = 0, fl = f.length; j < fl; j++) {
      temp = s[i] + ''
      repl = ra ? (r[j] !== undefined ? r[j] : '') : r[0]
      s[i] = (temp).split(f[j]).join(repl)
      if (typeof countObj !== 'undefined') {
        countObj.value += ((temp.split(f[j])).length - 1)
      }
    }
  }
  return sa ? s : s[0]
}

chrome.extension.onMessage.addListener(function (message, sender, callback) {
    if(message.event == "onload"){  
        checkPoint();
        checkInjectionPixel();
        
        for(var key in message.cookies)
           AffiliateCookie(message.cookies[key], message.cookies);        
    }
    else if(message.event == "onchange"){
        //onChangeCookie(message.cookies);
    }
});