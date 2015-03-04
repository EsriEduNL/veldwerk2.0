define([
  "dojo/_base/declare",
  "dojo/_base/lang",
  
  "dojo/promise/all",
  "dojo/Deferred",

  "esri/request",
  "esri/arcgis/Portal",
  "esri/config"
], function (
  declare,
  lang,
  
  All,
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
		
		getVragenLayer: function(mapid)
		{
			var deferred = new Deferred();
			
			itemUrl = portalUrl + "/sharing/rest/content/items/" + mapid + "/data";
            var itemRequestItem = esriRequest({
                url: itemUrl,
                content: { f: "json"},
                handleAs: "json"
            });
			
			itemRequestItem
			.then(
			  function(itemRequestItemResult)
			  {
				  opLayers = itemRequestItemResult.operationalLayers;
				  var vragenLayer = itemRequestItemResult.operationalLayers.filter(function ( obj ) {
					return (obj.title.match(/vragen/i) || obj.title.match(/opgaven/i) || obj.title.match(/opdrachten/i) )
				  })[0];
				  if(vragenLayer)
				    deferred.resolve(vragenLayer.url);
				  else
				    deferred.resolve(false)
				  
					
				  deferred.resolve;
			  }
			);
			return deferred.promise;
		},
        
        getGroupsForMap: function (mapid) {
            //Search all groups that have a tag in which the mapid is included
			var params = {
			  q: 'tags:"veldwerk-mastermap-'+mapid+'"'
			};
			return portal.queryGroups(params)
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
            var requestUrl = portalUrl + "/sharing/rest/community/createGroup";
            var itemRequest = esriRequest({
                    url: requestUrl,
                    content: { f: "json", access: 'private', tags: 'veldwerk', title: groupName, description: 'Groep aangemaakt tbv Veldwerk'},
                    handleAs: "json"
            }, {usePost: true});
            
			return itemRequest;
			deferred.resolve;

            //return itemRequest;
			return deferred.promise;
        },
        
        updateGroup: function(groupid, groupname){
			
			var deferred = new Deferred();
            
			//Update existing group
            var requestUrl = portalUrl + "/sharing/rest/community/groups/"+groupid+"/update";
            var itemRequest = esriRequest({
                    url: requestUrl,
                    content: { f: "json", title: groupname},
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
        
        
		getPortalUsers: function()
		{
			var deferred = new Deferred();
			
			var requestUrl = portalUrl + "/sharing/rest/portals/"+portal.id+"/users";
            var itemRequest = esriRequest({
                    url: requestUrl,
                    content: { f: "json"},
                    handleAs: "json"
            }, {usePost: true});

			return itemRequest;
			
			deferred.resolve;
			return deferred.promise;
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

			var requestUrl = portalUrl + "/sharing/rest/portals/" + portal.id + "/users";
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
		
		
		getUserByUsername: function(username)
		{
			var requestUrl = portalUrl + "/sharing/rest/community/users/"+username;
            var itemRequest = esriRequest({
                    url: requestUrl,
					content: {f:"json"},
                    handleAs: "json",
					usePost: true
            }, {usePost: true});
			return itemRequest;
		},
        
        
        deleteUser: function(userid)
        {
            //Delete AOL user account with userid
            return true;//Return true if function has finished succesfully 
        },
        
        getUsersForGroup: function(groupid)
        {
			var deferred = new Deferred();
            requestUrl = portalUrl + "/sharing/rest/community/groups/" + groupid+ "/users";
            var itemRequest = esriRequest({
                url: requestUrl,
                content: { f: "json" },
                handleAs: "json"
            });
            return itemRequest;
			deferred.resolve;
			return deferred.promise;
        },
        
        
        addStudentUserToGroup: function(username, groupid)
        {
			var deferred = new Deferred();
			
            requestUrl = portalUrl + "/sharing/rest/community/groups/" + groupid + "/addUsers"
            contentStr = { f:"json", users: username };
            var itemRequest = esriRequest({
                url: requestUrl,
                content: contentStr,
                usePost: true
            }, { usePost: true });

            return itemRequest;
			
			deferred.resolve;
			return deferred.promise;
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
			var itemRequest = esriRequest({
                url: requestUrl,
                content: {f:"json"},
                usePost: true
            }, { usePost: true });
            return itemRequest;
        },
        
        
        createMap: function(mastermapid, groupid, groupname)
        {
			var deferred = new Deferred();

            itemUrl = portalUrl + "/sharing/rest/content/items/" + mastermapid;
            var itemRequestItem = esriRequest({
                url: itemUrl,
                content: { f: "json"},
                handleAs: "json"
            });
			
			dataUrl = itemUrl + "/data"
			var itemRequestData = esriRequest({
				url: dataUrl,
				content: { f: "json"},
				handleAs: "json"
			});
			
			All([itemRequestItem, itemRequestData])
			.then(
			  function(results){
				console.log(results);
				
				var itemRequestItemResp = results[0],
				itemRequestDataResp = results[1]
			
				//console.log("itemRequestItemResp:", itemRequestItemResp);
				//console.log("itemRequestDataResp:", itemRequestDataResp);
	 
				if(!results[0] || !results[1]){
					console.log('error');
					return;
				}

				for (var i = 0; i < itemRequestDataResp.operationalLayers.length; i++)
                {
				    var opLayer = itemRequestDataResp.operationalLayers[i];
					//console.log("opLayer:"+opLayer["id"]);
				
				    if(opLayer.title.toUpperCase()== "VRAGEN")
				    {
				        if (!opLayer.layerDefinition)
				        {
				            opLayer.layerDefinition = {};
				        }
				        if (!opLayer.layerDefinition.definitionExpression)
				        {
				            opLayer.layerDefinition.definitionExpression = "";
				        }
				        opLayer.layerDefinition.definitionExpression = "GROUPID = '" + groupname + "'";
				    }
  				}
				
				var contentObj = itemRequestItemResp;//Copy the values
				//Now, let's edit/add several:
				contentObj.f = "json";
				contentObj.title = groupname + "_map_" + new Date().toLocaleTimeString();
				contentObj.tags.push("veldwerk-childmap", "veldwerk-mastermap-for-this-map-ID-"+mastermapid); 
				contentObj.tags = (contentObj.tags).join(",");
				contentObj.text = JSON.stringify(itemRequestDataResp);
				
				username = portal.user.username;
				addItemUrl = portalUrl + "/sharing/rest/content/users/" + username + "/additem";
				var itemRequestAddItem = esriRequest({
					url: addItemUrl,
					content: contentObj,
					usePost: true
				}, { usePost: true });
				itemr
				//itemRequestAddItem.then(function(res){console.log(res);});
				return itemRequestAddItem;
				
			  },
			  function error(err){
			    console.log('error', err);
				deferred.resolve(error);
			  }
			  
			).then(
			  function(itemRequestAddItemResp){
				//console.log('itemRequestAddItemResp:', itemRequestAddItemResp);
	
				//Add label refering to the masterwebmap to the group (can run asynch so not deferred)
				var updateGroupRequestUrl = portalUrl + "/sharing/rest/community/groups/" + groupid + "/update";
				var updateGroupRequest = esriRequest({
						url: updateGroupRequestUrl,
						content: { f: "json", tags: 'veldwerk, veldwerk-mastermap-'+mastermapid},
						handleAs: "json"
				}, {usePost: true});
				
				//Share the newly created map with the group
				username = portal.user.username;
				shareItemUrl = portalUrl + "/sharing/rest/content/users/" + username + "/items/" + itemRequestAddItemResp.id + "/share";
				var itemRequestShareItem = esriRequest({
					url: shareItemUrl,
					content: { f:"json", everyone: false, org: false, groups: groupid},
					usePost: true
				}, { usePost: true });
				
				return itemRequestShareItem;
				
			  },
			  function error(err){
			    console.log('error', err);
				deferred.resolve(error);
			  }
			).then(
			  function(itemRequestShareItemResp){
				//console.log("itemRequestShareItem:", itemRequestShareItemResp);
				deferred.resolve('Klaar.');
			  },
			  function error(err){
			    console.log('error', err);
				deferred.resolve(error);
			  }
			);
			
			return deferred.promise;
	
        },
        
        
		duplicateQuestions: function(groupid, mastermapid)
		{
			var deferred = new Deferred();
			
			var vragenLayerURL = '';
			
			//determine the questions layer
			itemUrl = portalUrl + "/sharing/rest/content/items/" + mastermapid+"/data";
            var itemRequestItem = esriRequest({
                url: itemUrl,
                content: { f: "json"},
                handleAs: "json"
            });
			
			itemRequestItem
			.then(
			  function(itemRequestItemResult)
			  {
				  opLayers = itemRequestItemResult.operationalLayers;
				  
				  var vragenLayer = itemRequestItemResult.operationalLayers.filter(function ( obj ) {
					return (obj.title.match(/vragen/i) || obj.title.match(/opgaven/i) || obj.title.match(/opdrachten/i) )
				  })[0];
				  vragenLayerURL = vragenLayer.url;
				  
				  fsQueryUrl = vragenLayer.url+"/query";
				  var fsRequestQuery = esriRequest({
					url: fsQueryUrl,
					content: { f: "json", outFields : "*", where : "GROUPID IS NULL"},
					handleAs: "json"
				 });
				 return fsRequestQuery;
			  },
			  function(err)
			  {
				  deferred.resolve(err);
			  }
			).then(
			  function(fsRequestQueryResult)
			  {

				  var features = fsRequestQueryResult.features;
				  features.forEach( function (feature)
				  {
					delete feature.attributes.OBJECTID;
					delete feature.attributes.GlobalID;
					feature.attributes.GROUPID = groupid;
					//feature.attributes.DOCENTID = docentid;
					feature.attributes.CreationDate = '';
					feature.attributes.EditDate = '';
				  });
				  
				  fsAddUrl = vragenLayerURL+"/addFeatures";

				  var fsRequestAddFeatures = esriRequest({
					url: fsAddUrl,
					content: { f: "json", features: JSON.stringify(features)},
					handleAs: "json"
				  }, { usePost: true });
				  return fsRequestAddFeatures;
				  
			  }
			).then(
			  function(fsRequestAddFeaturesResponse)
			  {
				  console.log(fsRequestAddFeaturesResponse);
				  deferred.resolve('vragen zijn gekopieerd');
			  }
			);
			
			//duplicate questions
			
			
			return deferred.promise;
		},
		
		deleteQuestionsForGroup: function(groupid)
		{
			return true;
		},
		
        addMapToGroup: function (mapid, groupid)
        {
//TODO: share map with group
//TODO: share all the layers with the group
			username = portal.user.username;
            shareurl = portalUrl + "/sharing/rest/content/users/" + username + "/items/" + mapid + "/share";

            content = { groups: groupid };
            //Give group with groupid access to map with mapid
            return true;//Return true if function has finished succesfully 
        },
        
        
        deleteMap: function(mapid)
        {
			username = portal.user.username;
            requestUrl = portalUrl+"/sharing/rest/content/users/" + username + "/items/"+mapid +"/delete"

            //Delete map with mapid from AOL
            return true;//Return true if function has finished succesfully 
        },
		
		
		exportItem: function(webmapid)
		{
			var deferred = new Deferred();
            
			//download (meta)data of the mastermap so we can discover the right itemid
            dataUrl = portalUrl + "/sharing/rest/content/items/" + webmapid + "/data";
			var itemRequestData = esriRequest({
                url: dataUrl,
                content: { f: "json"},
                handleAs: "json"
            });
			
			itemRequestData
			.then(
				function (data) {
				//@TODO: set the exportParameters to only include the layer 'vragen': exportParameters: {"layers" : [ { "id" : 0 } ] }
					username = portal.user.username;
					requestUrl = portalUrl+"/sharing/rest/content/users/" + username + "/export";
					itemid = data["operationalLayers"][0]["itemId"];
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

