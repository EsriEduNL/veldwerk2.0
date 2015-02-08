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
        
        getGroupsForMap: function(mapid){
            //return json object with groupid's
        },
        
        
        
        getGroup: function(id)
        {
            //return info about group: group members, group name, group webmapps
        },
        
        
        createGroup: function(groupName)
        {
            //Create a new AOL group
            //return newgroupid
            var requestUrl = portalUrl + "/sharing/rest/community/createGroup";
            var itemRequest = esriRequest({
                    url: requestUrl,
                    content: { f: "json", access: 'private', tags: 'Veldwerk', title: groupName, description: 'Groep aangemaakt tbv Veldwerk'},
                    handleAs: "json"
            }, {usePost: true});
            
            /**/
            
            //itemRequest.then(function(data) {
            //  console.log("Data: ", data); // print the data to browser's console
            //  return data;
            //}
            //,
            //function (error) {
            //  console.log("Error: ", error.message);
            //  return error;
            //});

            return itemRequest;
            
            
        },
        
        
        deleteGroup: function(groupid)
        {
            //Delete AOL group
            return true;//Return true if function has finished succesfully 
        },
        
        
        getStudentUser: function(userid)
        {
            //return name, groups, webmapps of leerling
        },
        
        
        createStudentUser: function(data)
        {
//invitationList	{"invitations":[{"username":"dennis_develstein","password":"ssdfsdfsd56464","firstname":"Dennis","lastname":"Test","fullname":"Dennis Test","email":"dennis@testmij.nl","role":"account_user"}]}
//Looks like a user will be added without recieving a mail, when a password is set
			var contentStr = JSON.stringify({
				f: "json", 
				invitationList: {"invitations": [
				  {"username": data.username, "password": data.password, "firstname": "", "lastname": "", "fullname": data.fullname, "email": data.email, "role":"account_user"}
				] }
			});
			
			var contentStr = "f=json&invitationList={invitations=[{username=dennis_develstein&password=sssdasadasdadja&firstname=Dennis&lastname}]}";
			
			console.log(contentStr);
			var requestUrl = portalUrl + "/sharing/rest/portal/self/invite";
            var itemRequest = esriRequest({
                    url: requestUrl,
					conent: {f:"json"},
                    handleAs: "json",
					usePost: true
            }, {usePost: true});

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
        },
        
        
        addStudentUserToGroup: function(userid, groupid)
        {
            //Provide user with userid access to group with groupid
            return true;//Return true if function has finished succesfully 
        },
        
        
        removeStudentUserFromGroup: function(userid, groupid)
        {
            //Invoke access of user with userid to group with groupid
            return true;//Return true if function has finished succesfully 
        },
        
        
        getMapsForGroup: function(groupid)
        {
            //Return: list with all maps (id+name+thumb+layers) that the group with groupid has access to
            //return json object
        },
        
        
        createMap: function(mastermapid, groupid)
        {
            //Create a duplicate of mastermapid
            //return newmapid;
        },
        
        
        addMapToGroup: function (mapid, groupid)
        {
            //Give group with groupid access to map with mapid
            return true;//Return true if function has finished succesfully 
        },
        
        
        removeMapForGroup: function(groupid, mapid)
        {
            //Remove access to map with mapid for group with groupid
            return true;//Return true if function has finished succesfully 
        },
        
        
        deleteMap: function(mapid)
        {
            //Delete map with mapid from AOL
            return true;//Return true if function has finished succesfully 
        }
        
        


    });
}
);

