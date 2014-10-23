require([
          
	"dojo/ready",
	"dojo/dom",
	
	"dojo/on",
	"dojo/_base/window",
	
	"js/VeldWerkCalls",

  ], function (
	
	ready,
	dom,
	
	on,
	wind,
	
	VeldWerkCalls
  ) {
	 
	  var debug = true;
	  
	  var vCalls;

	  ready(function () {
		  //search when enter key is pressed or button is clicked
		  on(dom.byId('loginLink'), 'click', GetWebMap);   
		  on(wind.doc, ".btn-select-this-webmap:click", function(e){
		    //var webmapid = $(this).data('webmapid');
			$('.webmap-selected-wrap .selected-webmap').html($('.col-webmap-'+$(this).data('webmapid')).html()).show();
			$('.webmap-list-container').hide();
			$('.webmap-selected-wrap').show();
			store.set('veldwerkWorkflowProgress', { webmapid: $(this).data('webmapid'), userdata: 'CSV/XLSX content' })
			/*$.smoothScroll({
      			scrollElement: $('div.scrollme'),
      			scrollTarget: '#findme'
    		});*/
		  });
		  on(wind.doc, ".btn-select-different-webmap:click", function(e){
		    $('.webmap-selected-wrap').hide();
			$('.webmap-list-container').show();
			store.set('veldwerkWorkflowProgress', { webmapid: ''})
		  });
		  vCalls = new VeldWerkCalls();

	  });
	  
	  /*///////////
	  //Functions//
	  ///////////*/
	  function GetWebMap()
	  {
		  LogMessage("Start getting info");

		  vCalls.signIn().then(function (loggedInUser) {
			  LogMessage("vCalls.signIn().then");
			  var userString = loggedInUser.fullName + " {" + loggedInUser.portal.name + "}";
			  dom.byId('userNameLabel').innerHTML = userString;//setting username in the UI
			  //getting all webmaps for this user and add them to the list
			  vCalls.getWebMapsForUser().then(function (response) {
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
						
                        LogMessage("now using webmap id: " + e.id + " (" + e.title + ")");  
                      });
				  }else{
					//@TODO ERROR: geen webmaps gevonden
				  }

			  });
		  });



	  }


	  function GetLayer()
	  {
		  logMessage('start GetLayer');
		  var webMapID = dom.byId('txtWebMapId').value;
		  vCalls.getLayersForWebMap(webMapID).then(function (resonse) {


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
