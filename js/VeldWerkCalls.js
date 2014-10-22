define([
  "dojo/_base/declare",
  "dojo/_base/lang",

  "esri/request",
  "esri/arcgis/Portal",
  "esri/config"
], function (
  declare,
  lang,

  esriRequest,
  arcgisPortal,
  config

) {

    return declare([], {
        portal:null,
        portalUrl: null,
        credCookieName:"veldwerk_identmanager",
        constructor: function(options){
            portalUrl = document.location.protocol + '//www.arcgis.com';
            //create the portalObject
            portal = new arcgisPortal.Portal(portalUrl);
            
            var idJson = cookie(credCookieName);



            if (idJson)
            {
                var idObject = JSON.parse(idJson);
                esri.id.initialize(idJson);

                var cred = esri.id.findCredential(portalUrl)
                if (!cred) {
                    portal.signIn();
                }
            }
        },
    
    
        getUser: function()
        {
            return portal.user;
        }
    
        signIn: function()
        {
           var def = portal.signIn();
            def.then(function (result)
            {
                
                syncCredsToCookie();
                
            });
            return def;

        },
        
        signOut:function()
        {
            portal.signOut();
            esri.id.destroyCredentials();
            syncCredsToCookie();
        }

        syncCredsToCookie:function()
        {
            var json = JSON.stringify(esri.id.toJson());

            cookie(credCookieName, json, { expires: 5 });
        }
        
        getWebMapsForUser:function()
        {
            if(portal.user)
            {
                var requestUrl = portalUrl + "/sharing/rest/search";
                var query = 'owner:'+ portal.user.username + ' AND type:"Web Map"'
                var params = {q: query,
                                num:100,  
                                sortField: 'modified',
                                sortOrder: 'desc'}
                return portal.queryItems(params);
            }
        }
        ,
        getLayersForWebMap: function(webMapId)
        {
            if (portal.user) {
                var requestUrl = portalUrl + "/sharing/rest/search";
                var query = 'owner:' + portal.user.username + ' AND type:"Web Map"'
                var itemRequest = esriRequest({
                    url: requestUrl,
                    content: { f: "json", q: query, num: 100 },
                    handleAs: "json"

                });
                return itemRequest;
            }
        }


    });
}
);

