define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  
  "dojo/Deferred",

  "esri/request",
  "esri/arcgis/Portal",
  "esri/config"
], function (
  declare,
  lang,
  
  Deferred,

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

        },
        
        signInCheck: function()
        {
            //Returns true of user can be logged in based on localstorage, false if not
            var idjson = store.get(credStoreKey);
            
            if (idjson)
            {
                
             esri.id.initialize(idjson);

              var cred = esri.id.findCredential(portalUrl)
              if (!cred) 
              {
                store.remove("veldwerk_identmanager");//Remove any LS credentials and do nothing; login only on user click
                return false;
              }else{
                return true;
              }
            }else{
                return false;
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
        
        
        signOut: function()
        {
            portal.signOut();
            esri.id.destroyCredentials();
            store.remove(credStoreKey);
        },
        

        getMapsForTeacher: function()
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
        },
        
        getGroupsForMap: function (mapid) {
            //TODO: impossible to detect
            //Also, would you want to?
            //return json object with groupid's
        },
        
        
        
        getGroup: function(id)
        {
            //return info about group: group members, group name, group webmapps
            requestUrl = portalUrl+"/sharing/rest/community/groups/" + id
            var itemRequest = esriRequest({
                url: requestUrl,
                content: { f: "json"},
                handleAs: "json"
            });
            //TODO: do something with the request?
            return itemRequest;
        },
        
        
        createGroup: function(groupName)
        {
			var deferred = new Deferred();
            //Create a new AOL group
            //return newgroupid
            var requestUrl = portalUrl + "/sharing/rest/community/createGroup";
            var itemRequest = esriRequest({
                    url: requestUrl,
                    content: { f: "json", access: 'private', tags: 'Veldwerk', title: groupName, description: 'Groep aangemaakt tbv Veldwerk'},
                    handleAs: "json"
            }, {usePost: true});
            
			return itemRequest;
			deferred.resolve;

            //return itemRequest;
			return deferred.promise;
        },
        
        
        deleteGroup: function(groupid)
        {
            requestUrl = portalUrl + "/sharing/rest/community/groups/"+groupid+"/delete"
            //Delete AOL group
            return true;//Return true if function has finished succesfully 
        },
        
        
        getStudentUser: function(username)
        {
            requestUrl = portalUrl + "/sharing/rest/community/users/" + username;
            //return name, groups, webmapps of leerling
        },
        
        
        createStudentUser: function(data)
        {
//Looks like a user will be added without recieving a mail, when a password is set
			
			var dataObj = { };
			$.each($(data), function() {
				dataObj[this.name] = this.value;
			});
		
			var contentStr = {
				f: "json", 
				invitationList: JSON.stringify({"invitations": [
				  {"username": data.username, "password": data.password, "firstname": dataObj.firstname, "lastname": dataObj.lastname, "fullname": dataObj.firstname+' '+dataObj.lastname, "email": dataObj.email, "role":"account_user"}
				] })
			};
			
			var requestUrl = portalUrl + "/sharing/rest/portal/self/invite";
            var itemRequest = esriRequest({
                    url: requestUrl,
					content: contentStr,
                    handleAs: "json",
					usePost: true
            }, {usePost: true});
            //TODO: do something with the request
            //Create new AOL user account
            //return newuserid
        },
        
        
        deleteStudentUser: function(userid)
        {
            //Delete AOL user account with userid
            return true;//Return true if function has finished succesfully 
        },
        
        getStudentUsersForGroup: function(groupid)
        {
            //return jsob object with all users with role=student
            requestUrl = portalUrl + "/sharing/rest/community/groups/" + groupid+ "/users";
            var itemRequest = esriRequest({
                url: requestUrl,
                content: { f: "json" },
                handleAs: "json"
            });
            //TODO: do something with the request?
            return itemRequest;
        },
        
        
        addStudentUserToGroup: function(username, groupid)
        {
            requestUrl = portalUrl + "/sharing/rest/community/groups/" + groupid + "/addUsers"
            contentStr = { users: username };
            var itemRequest = esriRequest({
                url: requestUrl,
                content: contentStr,
                handleAs: "json",
                usePost: true
            }, { usePost: true });

            //TODO: do something with the request
            //Provide user with userid access to group with groupid
            return true;//Return true if function has finished succesfully 
        },
        
        
        removeStudentUserFromGroup: function(username, groupid)
        {
            requestUrl = portalUrl + "/sharing/rest/community/groups/" + groupid + "/removeUsers"
            contentString = { users: username }
            //TODO: request
            //revoce access of user with userid to group with groupid
            return true;//Return true if function has finished succesfully 
        },
        
        
        getMapsForGroup: function(groupid)
        {
            
            requestUrl = portalUrl + "/sharing/rest/content/groups/" + groupid;
            //Return: list with all maps (id+name+thumb+layers) that the group with groupid has access to
            //return json object
        },
        
        
        createMap: function(mastermapid, groupid, groupname)
        {
			var deferred = new Deferred();
            
            //download description of the mastermap
            descriptionUrl = portalUrl + "/sharing/rest/content/items/" + mastermapid;
            var itemRequestDesc = esriRequest({
                url: descriptionUrl,
                content: { f: "json"},
                handleAs: "json"
            });
       //TODO: do something with the request?
            //return itemRequestDesc;
			
            //download (meta)data of the mastermap
            dataUrl = descriptionUrl + "/data"
			var itemRequestData = esriRequest({
                url: dataUrl,
                content: { f: "json"},
                handleAs: "json"
            });
			
        //TODO: do something with the request?
		
		//check if questions already exists for group
			//if already exists: do nothing
			//if not: duplicate
			

        //check if map already exists for group
			
            //if already exists: figure out the id and update
			
            //else: create
			for (var opLayer in itemRequestData["operationalLayers"]) {
				console.log("opLayer:"+opLayer["id"]);
   				//var obj = itemRequestData["url"];
				
			//TODO: IF layer = vragen -> add filter
			};
	
			//copyList = {"name","title","type","description","tags","snippet","thumbnail","documentation","extent","culture"}
			
			//newItemObj["typeKeywords"] = 'ArcGIS Online,Collector,Data Editing,Explorer Web Map,Map,Offline,Online Map,Web Map';
			console.log(itemRequestDesc["description"]);
			console.log(itemRequestData);
			
			var contentObj = {f: "json", title: groupname+"_map", text: JSON.stringify(itemRequestData)};
			
			addItemUrl = portalUrl + "/sharing/rest/content/users/dhunink/additem";
            var itemRequestAddItem = esriRequest({
                url: addItemUrl,
                //content: { f: "json", title: "testmij", type: "Web Map", text: itemRequestData, title: "groupname_test" },
				content: contentObj,
                usePost: true
            }, { usePost: true });
			
			return itemRequestAddItem;
		

            //return newmapid;
			return deferred.promise;
	
        },
        
        
        addMapToGroup: function (mapid, groupid)
        {
            shareurl = portalUrl + "/sharing/rest/content/users/" + username + "/items/" + mapid + "/share";

            content = { groups: groupid };
            //Give group with groupid access to map with mapid
            return true;//Return true if function has finished succesfully 
        },
        
        
        removeMapForGroup: function(groupid, mapid)
        {
            shareurl = portalUrl + "/sharing/rest/content/users/" + username + "/unshareItems";

            content = { items: mapid, groups: groupid };
            //Remove access to map with mapid for group with groupid
            return true;//Return true if function has finished succesfully 
        },
        
        
        deleteMap: function(mapid)
        {
            requestUrl = portalUrl+"/sharing/rest/content/users/" + username + "/items/"+mapid +"/delete"

            //Delete map with mapid from AOL
            return true;//Return true if function has finished succesfully 
        },
		
		
		exportItem: function(webmapid)
		{
			var deferred = new Deferred();
			
		//@TODO: get username of logged in user
			identMang = store.get("veldwerk_identmanager");
			//console.log(identMang.credentials);
			//Fails: console.log(identMang.credentials.userId);
			
			username = 'dhunink';
			
            //download (meta)data of the mastermap so we can discover the right itemid
            dataUrl = portalUrl + "/sharing/rest/content/items/" + webmapid + "/data"
			var itemRequestData = esriRequest({
                url: dataUrl,
                content: { f: "json"},
                handleAs: "json"
            });
			
			itemRequestData
			.then(
				function (data) {
					itemid = data["operationalLayers"][0]["itemId"];
					requestUrl = portalUrl+"/sharing/rest/content/users/" + username + "/export";
		
				//@TODO: set the exportParameters to only include the layer 'vragen': exportParameters: {"layers" : [ { "id" : 0 } ] }
					var itemRequestExportItem = esriRequest({
						url: requestUrl,
						content: { f: "json", itemId: itemid, exportFormat: "CSV" },
						usePost: true
					}, { usePost: true });
					return itemRequestExportItem;
				},
				function (error) {
					console.log("Error: ", error.message);
					deferred.resolve(error);
				}
			).then(function(exportResult){
				deferred.resolve(exportResult);
			});
			
			return deferred.promise;
			
		}
        
        


    });
}
);

