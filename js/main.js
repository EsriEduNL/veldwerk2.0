console.clear();



require([
          
    "dojo/ready",
	"dojo/Deferred",
    "dojo/dom-class",
    "dojo/dom",
    "dojo/query",
	"dojo/dom-form",
	"dojo/dom-style",
    
    "dojo/on",
    "dojo/_base/window",
	"dojo/promise/all",
    
    "esri/config",
    
    "js/VeldWerkCalls.js"

  ], function (
    
    ready,
	deferred,
    domClass,
    dom,
    query,
	domForm,
	domStyle,
    
    on,
    wind,
	All,
    
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
		  $('span.currentYear').html( new Date().getFullYear() );
          
		  
          vCalls = new VeldWerkCalls();
		  //esri.config.defaults.io.proxyUrl = "proxy.php";
		  esri.config.defaults.io.proxyUrl = "http://dennishunink.nl/playground/veldwerk/proxy.php";

          if(vCalls.signInCheck()) {
              logIn();/*Handels login, get webmaps, get users*/
          };
          
          //POC:
//heeft niet uit gezet
//          on(dom.byId('btnPOCDuplicatMap'), 'click', PocDuplicateMap);
          
          //search when enter key is pressed or button is clicked
          on(dom.byId('loginLink'), 'click', logIn);
          on(dom.byId('logoutLink'), 'click', logOut);

          //Toggle introduction tekst
		  $('#toggleIntroduction').on('click', function(){
			  $('#introduction-text').toggle();
			  if( $(this).html() == 'Verberg' ){
				  $(this).html('Toon');
			  }else{
				  $(this).html('Verberg');
			  }
		  });
          
          //Select webmapp, show it and scroll to it
          on(wind.doc, ".btn-select-this-webmap:click", function(e){
              selectWebmap($(this).data('webmapid'));
          });
          
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
		  
		  //Handle getting group details
		  $('#groups-list').on('show.bs.collapse', function (el) 
		  {
			var groupid = (el.target.id).replace(/group-/, '');
			vCalls.getUsersForGroup(groupid)
			.then(
			  function(response)
			  { 
				var nUsers = (response.users).length;
				if(nUsers > 0)
				{
					addGroupUsersToUI(response.users, groupid);
				}else
				{
					$('ul#group-'+groupid).html('<li><strong>Geen</strong> gebruikers gevonden voor deze groep</li>');
				}
			  }
			);

		  })
		  
		  //On opening edit group modal: copy group name and groupid
		  $('#modal-edit-group').on('show.bs.modal', function(e){
			  var groupname = $(e.relatedTarget).parent('li').data('groupname');
			  var groupid = $(e.relatedTarget).parent('li').data('groupid');
	
			  $('#modal-edit-group input[name=groupname]').val(groupname);
			  $('#modal-edit-group input[name=groupid]').val(groupid);
		  });
		  
		  //On opening delete group modal: copy group name and groupid
		  $('#modal-delete-group').on('show.bs.modal', function(e){
			  $('#deleteGroup-resultArea').html('');
			  var groupname = $(e.relatedTarget).parent('li').data('groupname');
			  var groupid = $(e.relatedTarget).parent('li').data('groupid');
	
			  $('#modal-delete-group span.groupname').text(groupname);
			  $('#modal-delete-group input[name=groupid]').val(groupid);
		  });
		  
		  //On opening delete user modal: copy group name and username
		  $('#modal-delete-user').on('show.bs.modal', function(e){
			  var groupname = $(e.relatedTarget).parent().parent().parent().data('groupname');
			  var groupid = $(e.relatedTarget).parent().parent().parent().data('groupid');
			  var username = $(e.relatedTarget).parent('li').data('username');
	
	
				console.log($(e.relatedTarget).parent().parent().parent());
				console.log('' + groupname + '-' + groupid + '-' + username);
	
			  $('#modal-delete-user span.groupname').html(groupname);
			  $('#modal-delete-user input[name=groupid]').val(groupid);
			  $('#modal-delete-user span.username').html(username);
			  $('#modal-delete-user input[name=username]').val(username);
		  });
		  
		  
		  

          
          //////////
          //MODALS//
          //////////
		  
		  ///////////////////
          //Modal add-users//
          $('.add-users-single-toggle-email').on('click', function(e){ e.preventDefault();
            $('.add-users-single-toggle-email-text, input[type=email]').toggleClass('hidden');
			$('.add-users-single-toggle-email').toggleClass('hidden');
          });
		  
		  $('form#form-add-single-user').on( "submit", function(event){
		    event.preventDefault();
			console.log( $(this).serializeArray() );
			vCalls.createStudentUser( $( this ).serializeArray() );
		  });
		  
		  //AOL users search
		  $('#users-aol-search input').on('keyup', null, function() {
			var rex = new RegExp($(this).val(), 'i');
			$('#users-aol-all li').hide();
			$('#users-aol-all li').filter(function() {
				return rex.test($(this).text());
			}).show();
		  });
		  
		  //AOL users add to selection
		  $("#users-aol-all").on('click', 'li a', function(event){
			event.preventDefault();
		    var parent = $(this).parent('li');
			$(this).children('small').text('annuleer');
			$('#users-aol-selected').append(parent);
		  });
		  
		  //AOL users remove from selection
		  $("#users-aol-selected").on('click', 'li a', function(event){
			event.preventDefault();
		    var parent = $(this).parent('li');
			$(this).children('small').text('toevoegen');
			$('#users-aol-all').append(parent);
		  });
		  
		  
		  ////////////////////
		  //Modal: add-group, tab add-groups-single//
          $('#modal-add-groups #add-groups-single .btn-primary').on('click', function() {
          	createNewGroupAndDependencies($('#modal-add-groups #add-groups-single input[name=groupname]').val());
          	$('#modal-add-groups').modal('hide');
          });
		  
		  /////////////////////////////////////////
		  //Modal: add-group, tab add-groups-file//
		  //$('#initAssiningUsersToGroup').on('click', function(){ initAssiningUsersToGroup(); });
	  	  $('#manageUsersDragdrop').on('click', function()
		  {
			  initAssiningUsersToGroup(); 
		  });
		  $("#groupBulkExcelDropArea").on('dragenter', function (e) 
		  {
			  e.stopPropagation();
			  e.preventDefault();
			  $(this).css('border', '2px dashed #0B85A1');
			  e.originalEvent.dataTransfer = 'copy';
		  });
		  $("#groupBulkExcelDropArea").on('dragover', function (e) 
		  {
			   e.stopPropagation();
			   e.preventDefault();
			   e.originalEvent.dataTransfer.dropEffect = 'copy';
		  });
		  $("#groupBulkExcelDropArea").on('drop', function (e) 
		  {
			  $(this).css('border', '2px dashed #0B85A1');
			  e.stopPropagation();
			  e.preventDefault();
			  var files = e.originalEvent.dataTransfer.files;
			  readExcelFile(files);
		  });
		  $('#groupBulkExcelInput').on('change', function(e){
			  e.stopPropagation();
			  e.preventDefault();
			  var files = e.target.files;
			  readExcelFile(files);
		  });
		  
		  $('form#groupBulkExcel-formGroupsColumn').on('submit', function(e){
		    e.preventDefault();
			if(!$('#groupBulkExcelColumnGroups').val()){
				alert('Selecteer de kolom die de aan te maken groepen bevat om door te gaan.');
				return false;
		    }
			createGroupsFromExcel();
		  });
		  
		  $('input[name=wantToAddUsersToGroup]').on('change', function() 
		  {
			if($('input[name=wantToAddUsersToGroup]:checked').val() == 'yes') 
			{
				$('#groupBulkExcelGroups-step4').show();
				$('#groupBulkExcelGroups-stepFinal').hide();
			}else 
			{
				$('#groupBulkExcelGroups-stepFinal').show();
				$('#groupBulkExcelGroups-step4').hide();
			}
		  });
	  	  $('a#toggleColumnsUserDetails').on('click', function()
		  {
			  $('#groupBulkExcelColumnsUserDetails').toggle();
		  });
		  
		  $('form#groupBulkExcel-formUsersColumn').on('submit', function(e){
		    e.preventDefault();
			if(!$('#groupBulkExcelColumnUsers').val()){
				alert('Selecteer de kolom die de gebruikersnamen bevat om door te gaan.');
				return false;
		    }
			createUsersFromExcel();
		  });

		  ////////////////////
		  //Modal edit group//
		  $('#modal-edit-group .btn-primary').on('click', function(){
			var newGroupName = $('#modal-edit-group input[name=groupname]').val();
			var groupid = $('#modal-edit-group input[name=groupid]').val();
			
			vCalls.updateGroup(groupid, newGroupName)
			.then(
			  function(result){ 
			    $('li[data-groupid='+groupid+'] a').text(newGroupName);
				$('#modal-edit-group').modal('hide');
			  }
			);  
		  });//End #modal-edit-group on click


		  ////////////////////
		  //Modal delete user//
		  $('#modal-delete-user .btn-primary').on('click', function(){
			  var group = $('#modal-delete-user input[name=groupid]').val();
			  var user = $('#modal-delete-user input[name=username]').val();
			  console.log('remove user ' + user + ' from group ' + group);
			vCalls.removeStudentUserFromGroup(user, group).then(
			  function(result){ 
				  $('#' + group).children('li[data-username='+user+']').remove();
				  
				  $('#modal-delete-user').modal('hide');
				  $("ul[data-groupid='"+group+"'] li[data-username='"+user+"']").remove();

			  }
			);  
			
		  });//End #modal-edit-group on click
		  
		  //////////////////////
		  //Modal delete group//
		  $('#modal-delete-group .btn-primary').on('click', function(){

//@TODO: check if all radio's have a :checked; since autocomplete="off" the don't have on by default	
			  
			  $('#deleteGroup-resultArea').html('<ul class="list-group"><li class="list-group-item list-group-item-info">Gestart. Dit venster sluit automatisch na afronding.</li></ul>');
			  
			  var groupid = $('#modal-delete-group input[name=groupid]').val();
			  var groupname = $('#modal-delete-group span.groupname').html();
			  var lsVeldwerk = store.get('veldwerkWorkflowProgress');
			  var qLayerUrl = lsVeldwerk.questionsLayerUrl;
			  
			  
			  
			  All([vCalls.getUsersForGroup(groupid), vCalls.getMapsForGroup(groupid)])
			  .then(
			    function(results)
			    {
				  console.log(results);
				
				  var getUsersForGroupResp = results[0],
				  getMapsForGroupResp = results[1]
				
				  //We will always delete the group itself	  
			      vCalls.deleteGroup(groupid).then(
				  	function(deleteGroupResults)
					{
 						$('#deleteGroup-resultArea ul').append('<li class="list-group-item list-group-item-success">Groep <strong>'+groupname+'</strong> is verwijderd.</li>');
						console.log('deleteGroup is done. Result:', deleteGroupResults)
					},
					function(deleteGroupError)
					{
						$('#deleteGroup-resultArea ul').append('<li class="list-group-item list-group-item-warning">Er is een fout opgetreden bij het verwijderen van groep <strong>'+groupname+'</strong>. <small>Technische details: '+deleteGroupError+'</small></li>');
					}
				  );
				  
				  //If we should delete the map(s), do so
				  console.log('should we delete maps: ' + $('#modal-delete-group input[name=delete-map]:checked').val() );
				  if( $('#modal-delete-group input[name=delete-map]:checked').val() == 'yes' )
				  {
				    $(getMapsForGroupResp.items).each(function(i, item)
				    {
						  vCalls.deleteMap(item.id).then(
						    function(deleteMapResult)
							{ 
							  $('#deleteGroup-resultArea ul').append('<li class="list-group-item list-group-item-success">Kaart van groep <strong>'+groupname+'</strong> is verwijderd.</li>');						
							  console.log('deleteMap is done. Result:', deleteMapResult); 
							},
							function(deleteMapError)
							{
								$('#deleteGroup-resultArea ul').append('<li class="list-group-item list-group-item-warning">Er is een fout opgetreden bij het verwijderen van de kaart van groep <strong>'+groupname+'</strong>. <small>Technische details: '+deleteGroupError+'</small></li>');
							}
						  );
                    });
				  }
				  
				  //If we should delete questions, do so
				  console.log('should we delete questions: ' + $('#modal-delete-group input[name=delete-questions]:checked').val() );
				  if($('#modal-delete-group input[name=delete-questions]:checked').val() == 'yes')
				  {
					  vCalls.deleteQuestionsForGroup(qLayerUrl, groupid).then(
					  	  function(deleteQuestionsForGroupResult)
					      {
							  $('#deleteGroup-resultArea ul').append('<li class="list-group-item list-group-item-success">Vragen van groep <strong>'+groupname+'</strong> zijn verwijderd.</li>');						
						      console.log('deleteQuestionsForGroup is done. Result:', deleteQuestionsForGroupResult);
					      },
						  function(deleteQuestionsError)
						  {
							  $('#deleteGroup-resultArea ul').append('<li class="list-group-item list-group-item-warning">Er is een fout opgetreden bij het verwijderen van de vragen van groep <strong>'+groupname+'</strong>. <small>Technische details: '+deleteQuestionsError+'</small></li>');
						  }
					  );
				  }
				  
				  //If we should delete users, do so
				  console.log('should we delete users: ' + $('#modal-delete-group input[name=delete-users]:checked').val());
				  if($('#modal-delete-group input[name=delete-users]:checked').val() == 'yes')
				  {  
				     $(getUsersForGroupResp.users).each(function(i, username)
				     {
						  vCalls.deleteUser(username).then(
						    function(deleteUserResult)
							{
								$('#deleteGroup-resultArea ul').append('<li class="list-group-item list-group-item-success">Gebruiker met gebruikersnaam <strong>'+username+'</strong> is verwijderd.</li>');						
						      console.log('deleteQuestionsForGroup is done. Result:', deleteUserResult);
							},
							function(deleteUserError)
						    {
							  $('#deleteGroup-resultArea ul').append('<li class="list-group-item list-group-item-warning">Er is een fout opgetreden bij het verwijderen van de gebruiker met gebruikersnaam <strong>'+username+'</strong>. <small>Technische details: '+deleteUserError+'</small></li>');
						    }
						  );
                     }
				     );
				  }
				  
				  //UI update
				  $('#modal-delete-group').modal('hide');
				  $('#groups-list li[data-groupid='+groupid+']').remove();
				  $('select[name=add-to-group] option[data-groupid='+groupid+']').remove();
  
				 
			    },
				function(err)
				{
					alert('Er is een fout opgetreden. Error details: ', err);
				}
			  )
			  
		  });//End #modal-add-group on click
		  
		  //////////////////////
		  //Modal export layer//
		  $('#modal-export-item .btn-primary').on('click', function(){
			  $(this).button('loading');
			  
			  $("#modal-export-item p.msg-job-success, #modal-export-item p.msg-job-failed").addClass('hidden');
			  $("#modal-export-item p.msg-job-working").removeClass('hidden');
			  
			  var stored = store.get('veldwerkWorkflowProgress');
              if(stored.webmapid)
              {
				  
              	vCalls.exportItem(stored.webmapid)
				.then(function(response){
				  	console.log(response);
				  	$("#modal-export-item p.msg-job-working").addClass('hidden');
				  	$("#modal-export-item p.msg-job-success").removeClass('hidden');
				},
				function(err){
					$("#modal-export-item p.msg-job-working").addClass('hidden');
					$("#modal-export-item p.msg-job-failed").removeClass('hidden');
				});
				
              }else{
			  	alert("Er is geen webmap geselecteerd");
			  }
			  
			  $(this).button('reset');
			  
		  });//End #modal-add-group on click

      });//End ready
      
      
      
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
			getPortalUsers();
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
          vCalls.getMapsForTeacher()
		  .then(function (response) 
		  {
            LogMessage("Aantal webmaps found: " + response.total);
            if (response.total > 0)
            {
                $(response.results).each(function(i, e) {

					if($.inArray('veldwerk-childmap', e.tags) > -1){
					  return true; //If childmap, don't show this
					}
					
					
					
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
    
                    //LogMessage("just added to the UI: webmap with id: " + e.id + " (" + e.title + ")");  
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
	  
	  function getPortalUsers()
	  {  
		  vCalls.getPortalUsers()
		  .then(
		    function(response)
			{
				//construct the user-list in the modal-add-users -> tab users-aol
				var userList = '';
				$(response.users).each(function(i, e) {
					userList += '<li class="list-group-item">' + e.fullName + ' <a href="#" class="pull-right" data-username="' + e.username + '" data-user-fullname="' + e.fullName + '"><small>toevoegen</small></a></li>';
				});
				if(!userList)
				  userList = 'Geen AOL gebruikers gevonden';
				  
				$('#users-aol-all').html(userList);
			}
		  );
	  }

		

      function selectWebmap(webmapid)
      {
      
          currentWebmapId = webmapid;
          
		  vCalls.getVragenLayerUrl(webmapid)
		  .then(
		    function(getVragenLayerUrlResponse)
			{
				console.log(getVragenLayerUrlResponse);
				if(!getVragenLayerUrlResponse){
				  alert('De geselecteerde webmap bevat geen laag met het woord \'vragen\' in de titel. Selecteer een andere webmap of pas de gekozen webmap aan in ArcGIS Online.');
				  throw 'No questions layer found, cancelling deferred chain';
				}else{
				  store.set('veldwerkWorkflowProgress', { webmapid: webmapid, questionsLayerUrl: getVragenLayerUrlResponse })
				  return vCalls.getGroupsForMap(webmapid);
				}
			},
			function(err)
			{
				alert('Er is een fout opgetreden');
			}
		  ).then(
		    function(getGroupsForMapResponse)
			{ 
			  if(getGroupsForMapResponse.total == 0)
			  {
				  $('ul#groups-list').html('<li data-listSearchValue=""><strong>Geen</strong> groepen gevonden voor deze webmap</li>');
			  }else
			  {
				  //Add the groups to the UI
				  var objForUI = {};
				  $(getGroupsForMapResponse.results).each(function(i, e) 
				  {
					  objForUI[i] = {groupid: e.id, groupname: e.title};
				  });
				  addGroupsToUI(objForUI);
				  
				  //Get users for groups
				  //initAssiningUsersToGroup();//FOR NOW!!! This function should be moved to here, since several calls in that funtion are already done here
//@TODO: load users and assign them to groups; the getGroupsForMap result is available as getGroupsForMapResponse();
//We possibly have to add vCalls.getPortalUsers().then as a call that needs to be performed in the start of this function(use All([]))
//Niels: maybe we should wait to fix this nice-to-have-things untill we have AngularJs:)
				  
			  }
			  query(".webmap-list-container").style("display", 'none');
			  $.smoothScroll({
				  offset: -220,
				  scrollTarget: '#col-selected-webmapp'
			  });
			  
			  $('.webmap-selected-wrap .selected-webmap-map').html( $('.col-webmap-'+webmapid).html() );
			  $('.selected-webmap-title').html( $('.col-webmap-'+webmapid+' h3').html() );
			}
		  );

          
      }
	  
	  function addGroupsToUI(obj, removeAllOthers)
	  {
		  //Each sub-object need at least has variables: groupid and groupname
		  var listForCollapseView = ''; var listForAddAOLusers = '';
		  for (var key in obj) 
		  {
			if (obj.hasOwnProperty(key)) 
			{
			  listForCollapseView += '<li data-listSearchValue="'+obj[key].groupname+obj[key].groupid+'" data-groupid="'+obj[key].groupid+'" data-groupname="'+obj[key].groupname+'"><a href="#group-'+obj[key].groupid+'" data-parent="groups-list" data-toggle="collapse" > '+obj[key].groupname+'</a> <span class="glyphicon glyphicon-pencil" aria-hidden="true" data-toggle="modal" data-target="#modal-edit-group"></span> <span class="glyphicon glyphicon-remove" aria-hidden="true" data-toggle="modal" data-target="#modal-delete-group"></span><ul id="group-'+obj[key].groupid+'" class="collapse" data-groupid="'+obj[key].groupid+'"><li><span class="glyphicon glyphicon-repeat spin-icon"></span> Bezig...</li></ul></li>';
			  listForAddAOLusers += '<option data-groupid="'+obj[key].groupid+'" value="' + obj[key].groupid + '">' + obj[key].groupname + '</option>';
			}
		  }
		  
		  if(typeof removeAllOthers == "undefined" || removeAllOthers == true) {
			  $('ul#groups-list').html(listForCollapseView);
			  $('select[name=add-to-group]').html(listForAddAOLusers);
			}
			else {
			  $('ul#groups-list').html($('ul#groups-list').html() + listForCollapseView);
			  $('select[name=add-to-group]').html($('select[name=add-to-group]').html() + listForAddAOLusers);
			}
	  }
	  

	  
	  function addGroupUsersToUI(users, groupid)
	  {
		  var nUsers = (users).length;
		  $('ul#group-'+groupid+' li span.glyphicon-repeat').parent('li').show();
		  for (var i = 0; i < nUsers; i++) 
		  {
			  //only do this if a li element with data-username="username" doesn't exist
			  if($("ul#group-"+groupid+" li[data-username="+users[i]+"]").length == 0) 
			  {
				vCalls.getUserByUsername(users[i])
				.then(
				  function(userDetails)
				  {  
					var userString = '<li data-username="'+userDetails.username+'">'+userDetails.fullName+' ('+userDetails.username+') <span class="glyphicon glyphicon-remove" aria-hidden="true" data-toggle="modal" data-target="#modal-delete-user"></span></li>';
					  $('ul#group-'+groupid).append(userString);
					
				  }
				);
			  }
		  }
		  $('ul#group-'+groupid+' li span.glyphicon-repeat').parent('li').hide();
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
      
      function createNewGroupAndDependencies(groupName){
		$(this).button('loading');
			  
		var name = groupName;
		var groupid = '';
			  
		if(!name)
		{
		  alert('U heeft geen naam ingevoerd');
		  $(this).button('reset');
		}else 
		{
		  var stored = store.get('veldwerkWorkflowProgress');
			  
		  vCalls.createGroup(name, stored.webmapid)
		  .then(
			function(createGroupResults) 
			{ 			
			  groupid = createGroupResults.group.id
			  console.log('createGroup done, proceeding to createMap');
			  
			  //update UI
			  var objForUI = {};
			  objForUI[0] = {groupid: createGroupResults.group.id, groupname: createGroupResults.group.title};
			  addGroupsToUI(objForUI, false);
		 	  
			  //Create a map for this group
			  return vCalls.createMap(stored.webmapid, stored.questionsLayerUrl, createGroupResults.group.id, createGroupResults.group.title); 
			  $('#groups-list').append('<li data-listSearchValue="'+createGroupResults.group.title + createGroupResults.group.id+'" data-groupid="'+createGroupResults.group.id+'" data-groupname="'+createGroupResults.group.title+'><a href="#group-'+createGroupResults.group.id+'" data-parent="#groups-list" data-toggle="collapse" data-groupid="'+createGroupResults.group.id+'">'+createGroupResults.group.title+' <span class="glyphicon glyphicon-pencil" aria-hidden="true" data-toggle="modal" data-target="#modal-edit-group"></span> <span class="glyphicon glyphicon-remove" aria-hidden="true" data-toggle="modal" data-target="#modal-delete-group"></span></a><ul id="group-'+createGroupResults.group.id+'" class="collapse" data-groupid="'+createGroupResults.group.id+'"></ul></li>');
				  
			  //Add to the dropdown buttons
			  $('select[name=add-to-group]').append('<option value="'+createGroupResults.group.id+'">'+createGroupResults.group.title+'</option>');
			  $('select[name=group-to-delete]').append('<option value="'+createGroupResults.group.id+'">'+createGroupResults.group.title+'</option>');
			}
		  ).then(
			function(createMapResult) 
			{  
			  return vCalls.duplicateQuestions(groupid, stored.webmapid);	
			}, 
			function (error) 
			{
			  if(error.messageCode == 'COM_0044'){
//@TODO: Check if a map and a set of questions exists for the group
			    /*vCalls.getMapsForGroup(groupid).then(
				  function(getMapsForGroup)
				  {
					  //@TODO: if none of the maps for this group is a child of the current mastermap, we should create the map
				  }
				);	*/
				alert('Fout: er bestaat al een groep met deze naam. Kies een andere naam.');			
			  }else{
				alert('Er is een fout opgetreden. Details: '+error.details);
			  }
			}
		  ).then(
			  /*
				function(duplicateQuestionsResult)
				{
					console.log('duplicateQuestionsResult:', duplicateQuestionsResult);
  
				}
				*/	
		  ).then(
			function () {
				  //Close the modal
	  
			}
		  );
			  
		}
		return groupid;
      };//end function createNewGroupAndDependencies
		  
      //var initAssiningUsersToGroup = function() {
	  function initAssiningUsersToGroup()
	  {
      	console.log('lets go initAssiningUsersToGroup');
      	$('#assiningUsersToGroupUsers').html('gebruikers laden...');
		
		allTheUsers = {};
		usersInAGroup = [];
		
		//put users in array
      	vCalls.getPortalUsers().then(
		  function(response) 
		  {
			  console.log('getPortalUsers:', response);
			allTheUsers = {};
			$.each( response.users, function( key, value ) 
			{
				allTheUsers[value.username] = value;
			});
		  },
		  function(respError){
		  	console.log('error:', respError);
		  }
		).then( 
		  function() {
		    //put other users in UI
		    $('#assiningUsersToGroupUsers').html(null);	
		    console.log('usersInGroup:',usersInAGroup);
		    $.each( allTheUsers, function( key, value ) 
		    {
			$('#assiningUsersToGroupUsers').html($('#assiningUsersToGroupUsers').html() + '<li class="list-group-item" data-user-id="'+ value.username +'" data-listSearchValue="' + value.fullName + '" style="z-index: 1051">' + value.fullName + '</li>');
		    });	

			vCalls.getGroupsForMap(currentWebmapId).then(
			  function(response) 
			  {
			  //put groups in UI
			  $('#assiningUsersToGroupGroups').html(null);
			  $.each( response.results, function( key, value ) 
			  {
			    vCalls.getUsersForGroup(value.id).then(
				  function(result1){
				    usersInThisGroupHtml = '';
					$.each( result1.users, function( key1, value1 ) 
					{	
					  usersInAGroup.push(value1);
				      usersInThisGroupHtml = usersInThisGroupHtml + '<li data-group-id-prev="'+ value.id +'" class="list-group-item" data-user-id="'+ allTheUsers[value1].username +'" style="z-index: 1051">' + allTheUsers[value1].fullName + '</li>';
					  $('#assiningUsersToGroupUsers').children('li[data-user-id=' + allTheUsers[value1].username + ']').remove();
								
					});

//@TODO: number of users per group as <span class="badge">' + 1234 + '</span>
					$('#assiningUsersToGroupGroups').html($('#assiningUsersToGroupGroups').html() + '<li class="list-group-item assiningUsersToGroupGroup" data-group-id="'+ value.id +'" data-listSearchValue="' + value.title + '">' + value.title + '<ul>' +usersInThisGroupHtml +'</ul></li>');

					$("#assiningUsersToGroupGroups .assiningUsersToGroupGroup").droppable(
					{
					  tolerance: "intersect",
					  accept: ".list-group-item",
//						activeClass: "ui-state-default",
//						hoverClass: "ui-state-hover",

					  drop: function(event, ui) 
					    {
					      //remove user from group
						  if(ui.draggable.attr("data-group-id-prev")) {
						  	console.log('should remove user ' + ui.draggable.attr("data-user-id") + ' from group '+ ui.draggable.attr("data-group-id-prev"));
						  	vCalls.removeStudentUserFromGroup(ui.draggable.attr("data-user-id"), ui.draggable.attr("data-group-id-prev"));
						  }
							ui.draggable.attr("data-group-id-prev",  $(this).attr("data-group-id"));
						 //add user to group
						  var tmp = $(this).children()[0];
						  $(tmp).append($(ui.draggable));
						  //vCalls.doesUserHasPrivilege(ui.draggable.attr("data-user-id"));
						  vCalls.addStudentUserToGroup(ui.draggable.attr("data-user-id"), $(this).attr("data-group-id"));


					    }
					});
							
					$("#assiningUsersToGroupGroups .assiningUsersToGroupGroup .list-group-item").draggable(
					{
								appendTo: "body",
								cursor: "move",
								helper: 'clone',
								revert: "invalid"
					});
				  });
				});
			  });

			$("#assiningUsersToGroupUsers .list-group-item").draggable(
			{
				appendTo: "body",
				cursor: "move",
				helper: 'clone',
				revert: "invalid"
			});
		
		});

		$("#assiningUsersToGroupUsers").droppable(
		{
			tolerance: "intersect",
			accept: ".list-group-item",
//			activeClass: "ui-state-default",
//			hoverClass: "ui-state-hover",
			drop: function(event, ui) 
			{
				$("#assiningUsersToGroupUsers").append($(ui.draggable));
			  if(ui.draggable.attr("data-group-id-prev")) {
				//hiero
				console.log('should remove user ' + ui.draggable.attr("data-user-id") + ' from group '+ ui.draggable.attr("data-group-id-prev"));
				vCalls.removeStudentUserFromGroup(ui.draggable.attr("data-user-id"), ui.draggable.attr("data-group-id-prev"));
			  }
				ui.draggable.attr("data-group-id-prev",  null);
				console.log('should have removed data-group-id-prev: ' + ui.draggable.attr("data-group-id-prev"));
			}
		});

      }//End ??

	  //toto niels test stukje hiero onder
	  $('#ikbenniels').bind('click', initAssiningUsersToGroup);
      
      
	  var listSearch = function() 
	  {
		  var string = $(this).val().toLowerCase();
		  $.each($('#'+$(this).attr('data-listSearch')).children(), function( key, value ) 
		  {
			  if($(value).attr('data-listSearchValue').toLowerCase().indexOf(string) >= 0) 
			  {
				  $(value).css('display', 'block');
			  }
			  else 
			  {
				  $(value).css('display', 'none');
			  }
		  
		  });
	  }
	  $('.listSearch').keyup(listSearch);

	  function readExcelFile(files)
	  {
		  var i,f;
		  for (i = 0, f = files[i]; i != files.length; ++i) 
		  {
			  var reader = new FileReader();
			  var name = f.name;
			  reader.onload = function(e) 
			  {
				  var data = e.target.result;
	  
				  // if binary string, read with type 'binary'
				  if(name.substring(name.length-5).toLowerCase() == '.xlsx') 
				  {
					  workbook = XLSX.read(data, {type: 'binary'});
				  }
				  else if(name.substring(name.length-4).toLowerCase() == '.xls')
				  {
					  workbook = XLS.read(data, {type: 'binary'});
				  }else
				  {
					  alert("Het bestand wordt niet herkend als een Excel bestand.");
					  return false;
				  }
				  
				  $('#groupBulkExcelLoaded').css('visibility', 'visible');
				  $('#groupBulkExcelLoadedName').html(name);
				  $('#groupBulkExcelGroups-step2').show();
				  $('#groupBulkExcelGroups-resultArea').html('');
				  $('#groupBulkExcelGroups-step3').hide();
				  $('#groupBulkExcelGroups-step4').hide();
				  $('#groupBulkExcelUsers-resultArea').html('');
				  $('#groupBulkExcelGroups-stepFinal').hide();
				  
				  columns = [];
				  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
				  numberOfCols = alphabet.indexOf(workbook.Sheets[workbook.SheetNames[0]]['!ref'].split(':')[1].match(/[a-zA-Z]+/)[0]) + 1;
				  for(var i=1; i<=numberOfCols; i++) 
				  {
					  columns.push({
						  id: i,
						  name: workbook.Sheets[workbook.SheetNames[0]][alphabet[i-1]+'1'].v
					  });
					  
					  $('#groupBulkExcelColumnGroups, #groupBulkExcelColumnUsers, #groupBulkExcelColumnUsersFirstname, #groupBulkExcelColumnUsersLastname, #groupBulkExcelColumnUsersPassword, #groupBulkExcelColumnUsersEmail, #groupBulkExcelColumnUsersRole').html('<option value="">Selecteer...</option>');
					  
					  $.each(columns, function( key, value) 
					  {
						  $('#groupBulkExcelColumnGroups, #groupBulkExcelColumnUsers, #groupBulkExcelColumnUsersFirstname, #groupBulkExcelColumnUsersLastname, #groupBulkExcelColumnUsersPassword, #groupBulkExcelColumnUsersEmail, #groupBulkExcelColumnUsersRole').html($('#groupBulkExcelColumnGroups').html() + '<option value='+value.id+'>'+value.name+'</option>');  
					  });
				  }
				  //console.log(columns);
			  };
			  reader.readAsBinaryString(f);
		  }
		}//End function readExcelFile

  		/*function groupBulkExcelColumnSelectDone() {
		  $('#groupBulkExcelCheckTable tbody').html('');
		  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
			
		  numberOfRows = workbook.Sheets[workbook.SheetNames[0]]['!ref'].split(':')[1].match(/\d+/)[0];
		  for(var i=2; i<=numberOfRows; i++) 
		  {
		    var user = workbook.Sheets[workbook.SheetNames[0]][alphabet[$('#groupBulkExcelColumnUsers').val()-1]+i].v;
		    var group = workbook.Sheets[workbook.SheetNames[0]][alphabet[$('#groupBulkExcelColumnGroups').val()-1]+i].v;

		    $('#groupBulkExcelCheckTable tbody').html($('#groupBulkExcelCheckTable tbody').html() + '<tr><td>'+user+'</td><td>'+group+'</td></tr>');
		  }
		}//End function groupBulkExcelColumnSelectDone*/

		function createGroupsFromExcel(){
		  var currentGroups = {};
		  var groupsJustCreated = {};
		  $('#groupBulkExcel-resultList').html('');
		  vCalls.getGroupsForMap(currentWebmapId).then(function(response) {
		    $.each( response.results, function( key, value ) 
		    {
			  currentGroups[value.title] = value.id;
		    });
			
			numberOfRows = workbook.Sheets[workbook.SheetNames[0]]['!ref'].split(':')[1].match(/\d+/)[0];
			console.log(numberOfRows);
			$('#groupBulkExcelGroups-resultArea').show();
			$('#groupBulkExcelGroups-resultArea').html('<ul class="list-group" id="groupBulkExcelGroups-resultList"><li class="list-group-item"><strong><span class="groupBulkExcelGroups-resultListAmount"></span> groepen gevonden om aan te maken</strong></li>');
			var groupBulkExcelGroupsResultListAmount = 0;
			for(var i=2; i<=numberOfRows; i++) {//i=1 = first row with column headings, therefore i =2
				var groupName = workbook.Sheets[workbook.SheetNames[0]][alphabet[$('#groupBulkExcelColumnGroups').val()-1]+i].v;
				
				//create new groups if needed
				if(!(groupName in currentGroups)) {
				  console.log('have to create a new group: ' + groupName);
				  tmp = createNewGroupAndDependencies(groupName);
				  //console.log('tmp:',tmp);
				  //currentGroups[group] = tmp;
				  //console.log('currentGroups:', currentGroups);
				  currentGroups[groupName] = 1; //1 means just created
				  groupsJustCreated[groupName] = 1;
				  //('+(i-1)+' van <span class="groupBulkExcelGroups-resultListAmount"></span>)
				  $('#groupBulkExcelGroups-resultList').append('<li class="list-group-item list-group-item-success">Groep <strong>'+groupName+'</strong> is aangemaakt.</li>');
				  groupBulkExcelGroupsResultListAmount = groupBulkExcelGroupsResultListAmount + 1
				}else
				{
					if(!(groupName in groupsJustCreated)) {
					  console.log('Group not created, because it already exists: ', groupName);
					  //('+(i-1)+' van <span class="groupBulkExcelGroups-resultListAmount"></span>)
					  $('#groupBulkExcelGroups-resultList').append('<li class="list-group-item list-group-item-warning">Groep <strong>'+groupName+'</strong> bestaat al en is daarom niet aangemaakt.</li>');
					}
				}
			}
			$('.groupBulkExcelGroups-resultListAmount').html(groupBulkExcelGroupsResultListAmount);
			$('#groupBulkExcelGroups-resultList').append('<li class="list-group-item"><strong><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Alle groepen uit uw Excel bestand zijn verwerkt.</strong></li></ul>');
			$('#groupBulkExcelGroups-step3').show();
		  });
		  
		  /*
		  //make a fresh list of all current groups so we can use it it in createUsersFromExcel() later on
		  window.currentGroups = {};
		  vCalls.getGroupsForMap(currentWebmapId).then(function(response) 
		  {
			$.each( response.results, function( key, value ) 
			{
				window.currentGroups[value.title] = value.id;
			});
		  });
		  */
		  
		}//end function createGroupsFromExcel
		

		function createUsersFromExcel() {
		//make a fresh list of all current groups so we can use it it in createUsersFromExcel() later on
		  window.currentGroups = {};
		  vCalls.getGroupsForMap(currentWebmapId).then(function(response) 
		  {
			$.each( response.results, function( key, value ) 
			{
				window.currentGroups[value.title] = value.id;
			});
		  });
		  console.log('we do have a fresh overview of the groups: ', window.currentGroups);
		  //and now, link some users to groups
		  createUsersFromExcel1();
		
		}
		

		function createUsersFromExcel1() 
		{
		console.log('and now, link some users to groups');
		  numberOfRows = workbook.Sheets[workbook.SheetNames[0]]['!ref'].split(':')[1].match(/\d+/)[0];
		  
		  $('#groupBulkExcelUsers-resultArea').show();
		  $('#groupBulkExcelUsers-resultArea').html('<ul class="list-group" id="groupBulkExcelUsers-resultList"><li class="list-group-item"><strong>' + (numberOfRows-1) + ' gebruikers gevonden om toe te wijzen aan een groep</strong></li>');
		  var groupBulkExcelUsersResultList = {};
		  vCalls.getPortalUsers()
		  .then(function(response) 
		  {
			allTheUsers = [];
			$.each( response.users, function( key, value ) 
			{
				allTheUsers.push(value.username);
			});
		  })
		  .then(function() 
		  {
			for(var i=2; i<=numberOfRows; i++) 
			{
			  var user = workbook.Sheets[workbook.SheetNames[0]][alphabet[$('#groupBulkExcelColumnUsers').val()-1]+i].v;
			  var groupName = workbook.Sheets[workbook.SheetNames[0]][alphabet[$('#groupBulkExcelColumnGroups').val()-1]+i].v;
			  console.log('link user ' + user + ' to group ' + groupName + ' ' + window.currentGroups[groupName]);

			  if(allTheUsers.indexOf(user) > -1) 
			  {
			    //add user to groep if group exsists
				if(groupName in window.currentGroups)
				{
				  vCalls.addStudentUserToGroup(user, window.currentGroups[groupName]);
				  //$('#groupBulkExcelUsers-resultList').append('<li class="list-group-item list-group-item-success">('+(i-1)+' van ' + (numberOfRows-1) + ') Gebruiker <strong>'+user+'</strong> is toegevoegd aan groep <strong>'+groupName+'</strong>.</li>');
				  groupBulkExcelUsersResultList[i] = '<li class="list-group-item list-group-item-success">('+(i-1)+' van ' + (numberOfRows-1) + ') Gebruiker <strong>'+user+'</strong> is toegevoegd aan groep <strong>'+groupName+'</strong>.</li>';
				}else 
				{
				  //group of user not found
				  //$('#groupBulkExcelUsers-resultList').append('<li class="list-group-item list-group-item-danger">('+(i-1)+' van ' + (numberOfRows-1) + ') Gebruiker <strong>'+user+'</strong> is niet toegevoegd aan de groep '+groupName+' omdat deze groep niet bestaat.</li>');
				  groupBulkExcelUsersResultList[i] = '<li class="list-group-item list-group-item-danger">('+(i-1)+' van ' + (numberOfRows-1) + ') Gebruiker <strong>'+user+'</strong> is niet toegevoegd aan de groep '+groupName+' omdat deze groep niet bestaat.</li>';
				}
			  }else 
			  {
				//user does not exist in arcgis
//@TODO: we should create it. Therefore, we DO need to ask a bit more details from the user, to identify the correct excel columns
//createStudentUser([username: '..', password: '..', fisrtname:'..', lastname: '..', email: '..', role: '..']);				
				//$('#groupBulkExcelUsers-resultList').append('<li class="list-group-item list-group-item-danger">('+(i-1)+' van ' + (numberOfRows-1) + ') Gebruiker <strong>'+user+'</strong> is niet toegevoegd aan groep <strong>'+groupName+'</strong> omdat de gebruiker niet bestaat in ArgGisOnline.</li>');
				groupBulkExcelUsersResultList[i] = '<li class="list-group-item list-group-item-danger">('+(i-1)+' van ' + (numberOfRows-1) + ') Gebruiker <strong>'+user+'</strong> is niet toegevoegd aan groep <strong>'+groupName+'</strong> omdat de gebruiker niet bestaat in ArgGisOnline.</li>';
			  }
			}//End for loop
			
			for(var i=2; i<=numberOfRows; i++) {
				$('#groupBulkExcelUsers-resultList').append(groupBulkExcelUsersResultList[i]);
			}
			
			$('#groupBulkExcelUsers-resultList').append('<li class="list-group-item"><strong><span class="glyphicon glyphicon-ok" aria-hidden="true"></span> Alle gebruikers uit uw Excel bestand zijn verwerkt.</strong></li></ul>');
		  });//End .then
		  $('#groupBulkExcelGroups-stepFinal').show();
		}//End function  createUsersFromExcel


});