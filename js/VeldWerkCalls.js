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
		credStoreKey:null,
        constructor: function(options){
            portalUrl = document.location.protocol + '//www.arcgis.com';
            //create the portalObject
            portal = new arcgisPortal.Portal(portalUrl);
	
			credStoreKey="veldwerk_identmanager";
						
			var idjson = store.get(credStoreKey);

            if (idjson)
            {
                
             esri.id.initialize(idjson);

              var cred = esri.id.findCredential(portalUrl)
              if (!cred) 
			  {
				store.remove("veldwerk_identmanager");//Remove any LS credentials and do nothing; login only on user click
              }else{ 
			    portal.signIn(); //We can sign this user in, based on the LS
			  }
            }
        },
    
        signIn: function()
        {
		
			var idJson = store.get(credStoreKey);
            var def = portal.signIn();
			def.then(function (result)
            {
                var json = esri.id.toJson();

                store.set(credStoreKey, json);
                
            });
            return def;

        },
		
		
		getUser: function()
        { 
            return portal.user;
        },
		
		
        signOut:function()
        {
            portal.signOut();
            esri.id.destroyCredentials();
            store.remove(credStoreKey);
        },

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
        },
        
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

