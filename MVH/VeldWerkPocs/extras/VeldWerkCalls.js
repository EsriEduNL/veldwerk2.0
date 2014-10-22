define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  "dojo/cookie",
  "esri/request",
  "esri/arcgis/Portal",
  "esri/config"
], function (
  declare,
  lang,
  cookie,
  esriRequest,
  arcgisPortal,
  config

) {

    return declare([], {
        portal:null,
        portalUrl: null,

        constructor: function(options){
            //portalUrl = document.location.protocol + '//www.arcgis.com';
            portalUrl = document.location.protocol + '//www.arcgis.com';
            //create the portal
            portal = new arcgisPortal.Portal(portalUrl);

     

            var idJson = cookie('veldwerk_identmanager2');



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
    


    
        signIn: function()
        {
            var def = portal.signIn();
            def.then(function (result)
            {
                var json = JSON.stringify(esri.id.toJson());

                cookie('veldwerk_identmanager2', json, { expires: 5 });
                
            });
            return def;
        },

        
        getWebMapsForUser:function()
        {
            if(portal.user)
            {
                var requestUrl = portalUrl + "/sharing/rest/search";
                var query = 'owner:'+ portal.user.username + ' AND type:"Web Map"'
                var itemRequest = esriRequest({
                    url: requestUrl,
                    content: { f: "json", q: query,num:100},
                    handleAs: "json"
                   
                });
                return itemRequest;
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
        ,

        getHello: function ()
        {
            return "Hello world";
        }
        ,
        
        getSla: function()
        {
            return "sladiebla" + portalUrl;

        }


    });
}
);

