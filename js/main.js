require([
          
    "dojo/ready",
    "dojo/dom-class",
    "dojo/dom",
    "dojo/query",
	"dojo/dom-form",
	"dojo/dom-style",
    
    "dojo/on",
    "dojo/_base/window",
    
    "esri/config",
    
    "js/VeldWerkCalls",

  ], function (
    
    ready,
    domClass,
    dom,
    query,
	domForm,
	domStyle,
    
    on,
    wind,
    
    esriConfig,
    
    VeldWerkCalls
  ) {
     
      var debug = true;

      var vCalls;
    
      ready(function () { 
	  	  
		  $("#intro-carousel, #intro-carousel .item").css('height', (0.6 * window.innerHeight));
		  resizeCarouselImages();
		  
		  $( window ).resize(function() {
			LogMessage("resize container naar 0.6*"+window.innerHeight);
			$("#intro-carousel, #intro-carousel .item").css('height', (0.6 * window.innerHeight));
		    resizeCarouselImages();
		  });
		  
		  //SmoothScroll from menu
		  $('ul.navbar-nav li a').on('click', function(e){
			e.preventDefault();
		    $.smoothScroll({
                offset: -75,
                scrollTarget: $(this).attr('href')
            });
		  });
		  
		  /*Initialize some UI stuff*/
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
			  store.set('veldwerkWorkflowProgress', { webmapid: $(this).data('webmapid')});
          });
          
          //Select different webmapp
          /*on(wind.doc, ".btn-select-different-webmap:click", function(e){
			query('#col-selected-webmapp').style('display', 'none');
            query('.webmap-list-container').style('display', 'block');
            store.set('veldwerkWorkflowProgress', { webmapid: ''})
          });*/
		  $('.btn-toggle-webmap-details').click(function(){
		    $('#col-selected-webmapp').toggle();
		  });
		  
		  $('.btn-select-different-webmap').click(function(){
			$('.webmap-list-container').toggle();
		  });
          
          //Scroll to add-users
          $('.btn-goto-add-users').on('click', function(e){
            $.smoothScroll({
                offset: -75,
                scrollTarget: '#section-define-users'
            });
          });
          
          

          
          //
          //MODALS
          //
		  //Modal: add-group
          $('#modal-add-group .btn-primary').on('click', function(){
    //@TODO: move all stuff below regarding vCalls.createGroup to a seperate function in main.js (so it can also be triggered by different actions)
            $(this).button('loading');
            var name = $('#modal-add-group input[name=groupname]').val();
            if(name){
              vCalls.createGroup(name).then(function(response){
                  console.log(response);
	//@TODO: Grant access to the featureservice of the selected webmap
	
	//@TODO: create questions for this group
	
    //@TODO: copy the webmap for this new group (vCalls.createMap(mastermapid, groupid))
	
	//@TODO: grant access to the new webmap for this group
	 
    //@TODO: provide a success message
                  //Add to the list
                  $('#groups-list').append('<li><a href="#group-'+response.group.id+'" data-parent="#groups-list" data-toggle="collapse" data-groupid="'+response.group.id+'">'+response.group.title+'</a><ul id="group-'+response.group.id+'" class="collapse" data-groupid="'+response.group.id+'"></ul></li>');
                  
                  //Add to the dropdown buttons
                  $('select[name=add-to-group]').append('<option value="'+response.group.id+'">'+response.group.title+'</option>');
                  
                  //Close the modal
                  $('#modal-add-group').modal('hide');
                  
              }, function (error) {
                  console.log(error);
                  alert('someone f*cked up');
              });
			  
			  $(this).button('reset');
			  
            }else{
        //@TODO: better UI for the error report
              alert('U heeft geen naam ingevoerd');
              $(this).button('reset');
            }
          });//End modal-add-group .btn-primary .on click
		  
		  //
          //Section add-users
          //
          $('.add-users-single-toggle-email').on('click', function(e){ e.preventDefault();
            $('.add-users-single-toggle-email-text, input[type=email]').toggleClass('hidden');
			$(this).toggleClass('hidden');
          });
          
	//@TODO: function below doens't respond on submit
		  dojo.connect(dom.byId("form-add-single-user"), "onsubmit", function(event){
			  event.preventDefault();
			  var formObj = domForm.toObject(this);
			  console.log(formObj);
	//@TODO: form validation
	//@TODO: if password empty, generate one AND force amils to teacher and user to be send
			  vCalls.createStudentUser(formObj);
			  //vCalls.addStudentUserToGroup(userid, groupid);
    //@TODO: if 'email me' is selected: email details to teacher
    //@TODO: if 'email student' is selected: email details to student
		  });

      });
      
      
      
      /*///////////
      //Functions//
      ///////////*/
	  function resizeCarouselImages(){
		var cW = $('#intro-carousel').outerWidth();
		var cH = $('#intro-carousel').outerHeight();
		var cA = cW / cH;
		
		$("#intro-carousel img").each(function()
		{
			
    	  var imgW = $(this).get(0).width;
		  var imgH = $(this).get(0).height;
		  var imgA = imgW / imgH;
		  
		  if ( cA < imgA ){
			$(this).css({
              width: 'auto',
              height: cH,
              top:0,
			  left: ( cW - cH / imgH * imgW ) / 2
            });
			//LogMessage("containerRatio < imgRatio, nieuwe w=aut0, h="+cH+', top=0, left='+( cW - cH / imgH * imgW ) / 2);
		  }else{
			$(this).css({
              width: cW,
              height: 'auto',
              top: ( cH - cW / imgW * imgH ) / 2,
              left:0
            });
			//LogMessage("containerRatio < imgRatio, nieuwe w="+cW+", h=auto, top="+( cH - cW / imgW * imgH ) / 2+", left=0");
		  }//end if else
		});//end for each
	  }//end function
	  
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
		  query(".section-public-only").style("display", "block");
		  window.location.reload(true);//Refresh browser to make sure no traces are left in the UI
      }
      
      
      function loggedInUI(loggedInUser)
      {
        //dom.byId('userNameLabel').innerHTML = '<span class="glyphicon glyphicon-user"></span> '+loggedInUser.fullName;//setting username in the UI
		//query('.userNameLabel').innerHTML = '<span class="glyphicon glyphicon-user"></span> '+loggedInUser.fullName;//setting username in the UI
		$('.userNameLabel').html('<span class="glyphicon glyphicon-user"></span> '+loggedInUser.fullName);
        //dom.byId('userOrgLabel').innerHTML = loggedInUser.portal.name;
		$('.userOrgLabel').html('<span class="glyphicon glyphicon-briefcase"></span> '+loggedInUser.portal.name);
        domClass.toggle("login-link-wrap", "hidden");
        domClass.toggle("user-menu-dropdown-wrap", "hidden");
        query(".section-private").style("display", "block");
		query(".section-public-only").style("display", "none");
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
		  $('.selected-webmap-title').html( $('.col-webmap-'+webmapid+' h3').html() );
        //@TODO: make the function below work
            /*vCalls.getGroupsForMap( $(this).data('webmapid') ).then(function(groups){
                dojo.forEach(groups, function(groupid, i){
                  vCalls.getGroup(groupid).then(function(groepobj){
                      //write to ul: name of the groups and the li's with users of the group
                  });
                });
            });*/
            query(".webmap-list-container").style("display", 'none');
            store.set('veldwerkWorkflowProgress', { webmapid: webmapid, userdata: 'CSV/XLSX content' })
            $.smoothScroll({
                offset: -220,
                scrollTarget: '#col-selected-webmapp'
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
