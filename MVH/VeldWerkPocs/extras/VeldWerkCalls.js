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

        constructor: function(options){
            portalUrl = document.location.protocol + '//www.arcgis.com';
            //create the portal
            portal = new arcgisPortal.Portal(portalUrl);
        },
    
    
        signIn: function()
        {
            return portal.signIn();

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

