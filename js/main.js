require([
          
	"dojo/ready",
	"dojo/dom",
	
	"dojo/on",
	
	"js/VeldWerkCalls",

  ], function (
	
	ready,
	dom,
	
	on,
	
	VeldWerkCalls
  ) {
	 
	  var debug = true;
	  
	  var vCalls;

	  ready(function () {
		  //search when enter key is pressed or button is clicked
		  on(dom.byId('loginLink'), 'click', GetWebMap);    

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
						//var firstWebMap = e;
					    var tUrl = e.thumbnailUrl || '';
					    //var img = dom.byId('map1Image');
					    //img.src=tUrl;
					    //dom.byId('map1Title').innerHTML = e.title;
					  
					    //var webMapid = e.id;
						
						//Set description
						if(!e.description)
						  e.description = '<em>geen</em>'
						
						//Translate the access string
						if(e.access == 'public')
						  var access = 'iedereen'
						else if(e.access == 'private')
						  var access = 'niemand'
						else if(e.access == 'org')
						  var access = 'organisatie'
						else if(e.access == 'shared')
						  var access = 'groep(en)'
						  
						//Set the time variables
						created = new Date(parseInt(e.created));
						modified = new Date(parseInt(e.modified));
						
						$('.webmapp-list-container').append('<div class="col-sm-6 col-md-4 col-webmapp-'+e.id+'"><div class="thumbnail"><img src="'+e.thumbnailUrl+'" width="200" height="133" alt="Afbeelding voor webmapp '+e.title+'"><div class="caption"><h3 id="map1Title">'+e.title+'</h3><p>Omschrijving: '+e.description+'</p><ul class="webmapp-meta"><li>Gedeeld met: '+access+'</li><li>Aangemaakt op '+created+'</li><li>Laatst bewerkt op '+modified+'</li></ul><p><a href="#" data-webmappid="'+e.id+'" class="btn btn-primary" role="button">Geselecteerd</a></p></div></div></div>');
						
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
