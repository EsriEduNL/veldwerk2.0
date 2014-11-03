require([
          
    "dojo/ready",
    "dojo/dom-class",
    "dojo/dom",
    "dojo/query",
    
    "dojo/on",
    "dojo/_base/window",
    
    "esri/config",
    
    "js/VeldWerkCalls",

  ], function (
    
    ready,
    domClass,
    dom,
    query,
    
    on,
    wind,
    
    esriConfig,
    
    VeldWerkCalls
  ) {
     
      var debug = true;

      var vCalls;
    
    //esriConfig.defaults.io.proxyUrl = "http://dennishunink.nl/playground/veldwerk/proxy.php";
    
      ready(function () { 
          $('input[type=password]').hidePassword(true);
          $("input.style-as-switch").bootstrapSwitch();
          
          vCalls = new VeldWerkCalls();

          if(vCalls.signInCheck()) {
              logIn();
          };
          
          
          //search when enter key is pressed or button is clicked
          on(dom.byId('loginLink'), 'click', logIn);
          on(dom.byId('logoutLink'), 'click', logOut); 
          
          //Select webmapp, show it and scroll to it
          on(wind.doc, ".btn-select-this-webmap:click", function(e){
              selectWebmap($(this).data('webmapid'));
          });
          
          //Select different webmapp
          on(wind.doc, ".btn-select-different-webmap:click", function(e){
            query('#row-selected-webmapp').style('display', 'none');
            query('.webmap-list-container').style('display', 'block');
            store.set('veldwerkWorkflowProgress', { webmapid: ''})
          });
          
          //Scroll to add-users
          $('.btn-goto-add-users').on('click', function(e){
            $.smoothScroll({
                offset: -75,
                scrollTarget: '#section-define-users'
            });
          });
          
          //
          //Section add-users
          //
          $('.single-toggle-email-username').on('click', function(e){ e.preventDefault();
            $('.single-toggle-email-username').closest('div.form-group').toggleClass('hidden');
          });
          
          $('#form-add-single-user').submit(function(e){
              e.preventDefault();
              //vCalls.createStudentUser(fullname, email, password);
              //vCalls.addStudentUserToGroup(userid, groupid);
    //@TODO: if 'email me' is selected: email details to teacher
    //@TODO: if 'email student' is selected: email details to student
          });
          
          //
          //MODALS
          //
          $('#modal-add-group .btn-primary').on('click', function(){
    //@TODO: move all stuff below regarding vCalls.createGroup to a seperate function in main.js (so it can also be triggered by different actions)
            $(this).button('loading');
            var name = $('#modal-add-group input[name=groupname]').val();
            if(name){
    //@TODO: create a deffered version to handle the response in the UI (eq, display error messages etc, see https://github.com/EsriEduNL/veldwerk2.0/issues/13)
              vCalls.createGroup(name).then(function(response){
                  console.log(response);
     
    //@TODO: provide a success message
    
                  //Add to the list
                  $('#groups-list').append('<li><a href="#group-'+response.group.id+'" data-parent="#groups-list" data-toggle="collapse" data-groupid="'+response.group.id+'">'+response.group.title+'</a><ul id="group-'+response.group.id+'" class="collapse" data-groupid="'+response.group.id+'"></ul></li>');
                  
                  //Add to the dropdown buttons
                  $('select[name=add-to-group]').append('<option value="'+response.group.id+'">'+response.group.title+'</option>');
                  
                  
    //@TODO: copy the webmap for this new group (vCalls.createMap(mastermapid, groupid))
                  
                  //Close the modal
                  $('#modal-add-group').modal('hide');
                  
                  $(this).button('reset');
                  
              }, function (error) {
                  console.log(error);
                  alert('someone f*cked up');
              });
            }else{
        //@TODO: better UI for the error report
              alert('U heeft geen naam ingevoerd');
              $(this).button('reset');
            }
          });//End modal-add-group .btn-primary on click

      });
      
      
      
      /*///////////
      //Functions//
      ///////////*/
      function logIn()
      {
        vCalls.signIn().then(function(loggedInUser){
            loggedInUI(loggedInUser);
            GetWebMaps();
        });
      }
      
      function logOut()
      {	  LogMessage('Start singout');
          vCalls.signOut();
          domClass.toggle("user-menu-dropdown-wrap", "hidden");
          domClass.toggle("login-link-wrap", "hidden");
          query(".section-private").style("display", "none");
      }
      
      
      function loggedInUI(loggedInUser)
      {
        dom.byId('userNameLabel').innerHTML = loggedInUser.fullName;//setting username in the UI
        dom.byId('userOrgLabel').innerHTML = '<span class="glyphicon glyphicon-briefcase"></span> '+loggedInUser.portal.name;
        domClass.toggle("login-link-wrap", "hidden");
        domClass.toggle("user-menu-dropdown-wrap", "hidden");
        query(".section-private").style("display", "block");
      }
      
      function GetWebMaps()
      {
          LogMessage("function GetWebMaps: Start getting info");
          //getting all webmaps for this user and add them to the list
          vCalls.getMapsForTeacher().then(function (response) {
            LogMessage("Aantal webmaps found: " + response.total);
            if (response.total > 0)
            {
                $(response.results).each(function(i, e) {
                    if(!e.thumbnailUrl)
                      e.thumbnailUrl = ''
                        
                    if(!e.description)
                      e.description = '<em>geen</em>'
                    
                    if(e.access == 'public')
                      var access = 'iedereen'
                    else if(e.access == 'private')
                      var access = 'niemand'
                    else if(e.access == 'org')
                      var access = 'organisatie'
                    else if(e.access == 'shared')
                      var access = 'groep(en)'
                      
                    created = new Date(parseInt(e.created));
                    modified = new Date(parseInt(e.modified));
                    
                    $('.webmap-list-container').append('<div class="col-sm-6 col-md-4 col-lg-3 col-webmap-'+e.id+'"><div class="thumbnail"><img src="'+e.thumbnailUrl+'" width="200" height="133" alt="Afbeelding voor webmap '+e.title+'"><div class="caption"><h3 id="map1Title">'+e.title+'</h3><p>Omschrijving: '+e.description+'</p><ul class="webmap-meta"><li>Gedeeld met: '+access+'</li><li>Aangemaakt op '+created+'</li><li>Laatst bewerkt op '+modified+'</li></ul><p><a href="#" data-webmapid="'+e.id+'" class="btn btn-default btn-select-this-webmap" data-webmapid="'+e.id+'" role="button">Selecteer</a></p></div></div></div>');
                    
    //@TODO: get all groups that hold a copy of this webmapp, add that one to the UI lists, get there members and display those as well
    
                    LogMessage("just added to the UI: webmap with id: " + e.id + " (" + e.title + ")");  
                  });//End response each
                  //Let's check if any webmapp has been stored in localstorage
                  var stored = store.get('veldwerkWorkflowProgress');
                  if(stored.webmapid)
                  {
                      selectWebmap(stored.webmapid);
                  }//end if storedID
              }else{
                //@TODO ERROR: geen webmaps gevonden
              }

          });
      }


      function GetLayer()
      {
          logMessage('start GetLayer');
          var webMapID = dom.byId('txtWebMapId').value;
          vCalls.getLayersForWebMap(webMapID).then(function (resonse) {


          });
      }

      function selectWebmap(webmapid)
      {
          $('.webmap-selected-wrap .selected-webmap-map').html($('.col-webmap-'+webmapid).html());
        //@TODO: make the function below work
            /*vCalls.getGroupsForMap( $(this).data('webmapid') ).then(function(groups){
                dojo.forEach(groups, function(groupid, i){
                  vCalls.getGroup(groupid).then(function(groepobj){
                      //write to ul: name of the groups and the li's with users of the group
                  });
                });
            });*/
            query("#row-selected-webmapp").style('display', 'block');
            query(".webmap-list-container").style("display", 'none');
            store.set('veldwerkWorkflowProgress', { webmapid: webmapid, userdata: 'CSV/XLSX content' })
            $.smoothScroll({
                offset: -220,
                scrollTarget: '#row-selected-webmapp'
            });
      }

      function LogMessage(msg)
      {
          if(debug){
          //var logTxt = dom.byId('txtContent')
          //var txt = logTxt.value;
          var d  = new Date();
          var newtxt = d.toLocaleTimeString()+'-'+ msg;// + '\r\n' + txt;
          console.log(newtxt);//logTxt.value = newtxt;
          }
      }



  });
