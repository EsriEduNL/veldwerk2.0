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
	//fixed
	//esri.config.defaults.io.proxyUrl = "http://178.62.235.101/proxy.php";
	//use current server
	esri.config.defaults.io.proxyUrl = window.location.protocol + '//' + window.location.host + window.location.pathname + '/proxy.php';

    return declare([], {
		//questionLayerAllowedStrings: ['vragen', 'VRAGEN'];
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
		
		getVragenLayerUrl: function(mapid)
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
				  if(!opLayers)
				  {
					  deferred.resolve(false);
				  }
				  
				  var vragenLayer = itemRequestItemResult.operationalLayers.filter(function ( obj ) {
					return (obj.title.match(/vragen/i) || obj.title.match(/opgaven/i) || obj.title.match(/opdrachten/i) )
				  })[0];
				  if(vragenLayer)
				  {
				    deferred.resolve(vragenLayer.url);
				  }else
				  {
				    deferred.resolve(false)
				  }
					
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
        
        
        createGroup: function(groupName, mastermapid)
        {
			var deferred = new Deferred();
            
			//Create a new AOL group
            var requestUrl = portalUrl + "/sharing/rest/community/createGroup";
            var itemRequest = esriRequest({
                    url: requestUrl,
                    content: { f: "json", access: 'private', tags: 'veldwerk, veldwerk-mastermap-'+mastermapid, title: groupName, description: 'Groep aangemaakt tbv Veldwerk'},
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
        	console.log('group ' + groupid + 'is deleted');
            requestUrl = portalUrl + "/sharing/rest/community/groups/"+groupid+"/delete"
			var itemRequest = esriRequest({
                    url: requestUrl,
                    content: { f: "json"},
                    handleAs: "json"
            }, {usePost: true});
			return itemRequest;

        },
        
        
		getPortalUsers_old: function()
		{
			var deferred = new Deferred();
//@TODO: get ALL users, in chuncks of 100 per request, and return all the API responses			
			var requestUrl = portalUrl + "/sharing/rest/portals/"+portal.id+"/users";
            var itemRequest = esriRequest({
                    url: requestUrl,
                    content: { f: "json", num: 100, start:1},
                    handleAs: "json"
            }, {usePost: true});
			
			itemRequest.then(function(result)
			{
				for(var i=101; i<=result.nextStart; i=i+100)
				{
					console.log('we need to fetch again. i=', i);
					var itemRequest2 = esriRequest({
                    	url: requestUrl,
                    	content: { f: "json", num: 100, start:i},
                    	handleAs: "json"
            		}, {usePost: true});
					itemRequest2.then(function(result2)
					{
						console.log(result2)
					});
				}
				
				console.log(result.total, result.nextStart)
			});

			return itemRequest;
			
			deferred.resolve;
			return deferred.promise;
		},
		
		getPortalUsers: function()
		{
			var iniCall = function()
			{
				var deferred = new Deferred();
				var requestUrl = portalUrl + "/sharing/rest/portals/"+portal.id+"/users";
				var itemRequest = esriRequest({
						url: requestUrl,
						content: { f: "json", num: 100, start: 1},
						handleAs: "json",
						
				}, {usePost: true});
				return itemRequest;
				deferred.resolve;
				return deferred.promise;
			}
			
			function inLoop(nextStart) 
			{
				console.log(nextStart);
				var deferred = new Deferred();
				var requestUrl = portalUrl + "/sharing/rest/portals/"+portal.id+"/users";
				var itemRequest = esriRequest({
						url: requestUrl,
						content: { f: "json", num: 100, start: nextStart},
						handleAs: "json",
						
				}, {usePost: true});
			
				itemRequest.then(function(response)
				{
					//console.log('part', response.users);
				});
				return itemRequest;

				deferred.resolve;
				return deferred.promise;				
			}
						
			var users = new Object;
			users.users = [];
			var def = new Deferred();
	
			var currDef = def;
			
//@TODO: do one initial call to get the total number of users, then proceed to a for-loop comparing total and nextStart
			
			iniCall().then(function(iniResponse)
			{
				console.log('iniResponse:', iniResponse);
				var totalUsers = iniResponse.total;
				var nOfRuns = Math.round((totalUsers / 100))+1; 
				//The first run won't return any users, therefore we have to add 1 to the number of runs
				
				console.log(totalUsers, nOfRuns);
				
				for (var i = 0; i < nOfRuns; i++) 
				{
					currDef = currDef.then (function(response) 
					{
						console.log('currDef response:', response);
						users.users = users.users.concat(response.users);
						if(response.nextStart < 0) 
						{
							return users;
						}else 
						{
							return inLoop(response.nextStart);
						}
					});
				}
			});
			
			
	
			/*for (var i = 0; i < 10; i++) 
			{
				currDef = currDef.then (function(response) 
				{
					users.users = users.users.concat(response.users);
					if(response.nextStart < 0) 
					{
						return users;
					}else 
					{
						return inLoop(response.nextStart);
					}
				});
			}*/

			def.resolve(users);
			return (currDef);

		},
        
        
		getPortalRoles: function()
		{
			//Get all roles that have the right privelege: http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Get_Roles_By_Privilege/02r30000020q000000/ 
		},

        createStudentUser: function(data)
        {
//Looks like a user will be added without recieving a mail, when a password is set
			
			var dataObj = { };
			$.each($(data), function() {
				dataObj[this.name] = this.value;
			});
		    if(!data.role)
			{
				data.role = 'account_user';
			}else
			{
//@TODO: check if custom role existst for the organisation. If not, data.role = 'account_user';
//@TODO: check if role has the right priveleges
			}
			
			var contentStr = {
				f: "json", 
				invitationList: JSON.stringify({"invitations": [
				  {"username": data.username, "password": data.password, "firstname": dataObj.firstname, "lastname": dataObj.lastname, "fullname": dataObj.firstname+' '+dataObj.lastname, "email": dataObj.email, "role":dataObj.role}
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
        
		doesUserHasPrivilege: function(username, privilege)
		{
			//Since http://resources.arcgis.com/en/help/arcgis-rest-api/index.html#/Get_Privilege_For_User/02r3000001vs000000/ doens't work (return is not as expected) we have to use work-around.
			var requestUrl = portalUrl + "/sharing/rest/portals/"+portal.id+"/roles/getRolesForUser";
            var getRolesRequest = esriRequest({
                    url: requestUrl,
                    content: { f: "json", username: username},
                    handleAs: "json"
            }, {usePost: true});
			
			getRolesRequest.then(
				function(getRolesResult)
				{
					console.log(getRolesResult);
				}
			)
		},
        
        deleteUser: function(username)
        {
			var deferred = new Deferred();
			console.log('start delete user ', username);

			var requestUrl = portalUrl + "/sharing/rest/community/users/"+username+"/delete";
            var itemRequest = esriRequest({
                    url: requestUrl,
					content: {f:"json"},
                    handleAs: "json",
					usePost: true
            }, {usePost: true});
			return itemRequest;
			deferred.resolve;
			return deferred.promise;
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
        	console.log('assign user ' + username + ' to group ' + groupid);
        
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

        	console.log('remove user ' + username + ' to group ' + groupid);
        
			var deferred = new Deferred();
			
            requestUrl = portalUrl + "/sharing/rest/community/groups/" + groupid + "/removeUsers"
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
        
        
        createMap: function(mastermapid, questionsLayerUrl, groupid, groupname)
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
	 
				if(!results[0] || !results[1]){
					console.log('error');
					return;
				}
//@TODO: we are recieving questionsLayerUrl, therefore should not use the check below but benefit from the check that's already been performed and resulted in questionsLayerUrl (for example http://services3.arcgis.com/oecFpSTGbkyJV2e0/arcgis/rest/services/Veldwerk2_0_Template_kaartlaag/FeatureServer/1)
				for (var i = 0; i < itemRequestDataResp.operationalLayers.length; i++)
                {
				    var opLayer = itemRequestDataResp.operationalLayers[i];
				  
				    //if(opLayer.title.toUpperCase()== "VRAGEN" || opLayer.title.toUpperCase() == "OPGAVEN" || opLayer.title.toUpperCase() == "OPDRACHTEN" )
					if( opLayer.title.match(/vragen/i) || opLayer.title.match(/opgaven/i) || opLayer.title.match(/opdrachten/i) )
				    {
						console.log('vragenlayer gevonden. opLayer:', opLayer);
						console.log('questionsLayerId in localStorage:', questionsLayerId);
				        if (!opLayer.layerDefinition)
				        {
				            opLayer.layerDefinition = {};
				        }
				        if (!opLayer.layerDefinition.definitionExpression)
				        {
				            opLayer.layerDefinition.definitionExpression = "";
				        }
				        opLayer.layerDefinition.definitionExpression = "GROUPID = '" + groupid + "'";
				    }
	//@TODO: implement a check if a questions layers can be found
  				}
				
				var contentObj = itemRequestItemResp;//Copy the values
				//Now, let's edit/add several:
				contentObj.f = "json";
				//contentObj.title = groupname + "_map_" + new Date().toLocaleTimeString();
				contentObj.title = groupname + "_map";
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
				
				//itemRequestAddItem.then(function(res){console.log(res);});
				return itemRequestAddItem;
				
			  },
			  function error(err){
			    console.log('error', err);
				deferred.resolve(error);
			  }
			  
			).then(
			  function(itemRequestAddItemResp){
				console.log('item toegevoegd');
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
				  console.log('fsRequestQueryResult: ', fsRequestQueryResult)
				  var features = fsRequestQueryResult.features;
				  features.forEach( function (feature)
				  {
					delete feature.attributes.OBJECTID;
					delete feature.attributes.GlobalID;
					feature.attributes.GROUPID = groupid;
					feature.attributes.DOCENTID = portal.user.username;
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
				  console.log('fsRequestAddFeaturesResponse: ',fsRequestAddFeaturesResponse);
				  deferred.resolve('vragen zijn gekopieerd');
			  }
			);
			
			return deferred.promise;
		},
		
		deleteQuestionsForGroup: function(fLayerUrl, groupid)
		{
			var deferred = new Deferred();
			
			console.log('start function deleteQuestionsForGroup. fLayerUrl:', fLayerUrl);

			requestUrl = fLayerUrl+"/deleteFeatures";
			var itemRequest = esriRequest(
			  {
                url: requestUrl,
                content: { f: "json", where: "GROUPID='"+groupid+"'" },
                handleAs: "json",
				usePost: true
			  },
			  { usePost: true }
			);
			
			return itemRequest;
			deferred.resolve();
			return deferred.promise;
		},
        
        
        deleteMap: function(mapid)
        {
			var deferred = new Deferred();
			
			username = portal.user.username;
            requestUrl = portalUrl+"/sharing/rest/content/users/" + username + "/items/"+mapid +"/delete"
			var itemRequest = esriRequest({
                url: requestUrl,
                content: { f: "json"},
                handleAs: "json",
				usePost: true
				},
				{ usePost: true
			});
			return itemRequest;
			
			deferred.resolve();
			return deferred.promise;
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
			
		},
     


        


    });
}
);

