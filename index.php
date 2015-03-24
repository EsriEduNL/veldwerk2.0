﻿<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js"> <!--<![endif]-->
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
        <title>Veldwerk 2.0 - Esri Nederland</title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="stylesheet" href="css/bootstrap.min.css">

        <!--<link rel="stylesheet" href="css/bootstrap-theme.min.css">-->
        <link rel="stylesheet" href="css/bootstrap-theme.css">
        <link rel="stylesheet" href="//js.arcgis.com/3.11/dgrid/css/skins/claro.css">
        <link rel="stylesheet" href="//js.arcgis.com/3.11/dijit/themes/claro/claro.css">
        <link rel="stylesheet" href="//js.arcgis.com/3.11/esri/css/esri.css">
        <link rel="stylesheet" href="css/bootstrap-switch.min.css">
        <link rel="stylesheet" href="css/main.css">

        <script src="js/vendor/modernizr-2.6.2-respond-1.1.0.min.js"></script>
    </head>
    <body class="claro">
    <!--[if lt IE 7]>
        <p class="browsehappy">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>
    <![endif]-->
    
    <div class="navbar navbar-fixed-top" role="navigation">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <a class="navbar-brand" href="#"><img src="img/logo_esri_nederland.png" alt="Esri Nederland" height="30"/></a>
        </div>
        <div class="navbar-collapse collapse">
          <ul class="nav navbar-nav">
            <li class="active"><a href="#">Home</a></li>
            <li><a href="#section-webmap-selection">Configureren</a></li>
            <li><a href="#section-tools">Tools</a></li>
            <li><a href="#col-section-about">Over ons</a></li>
            <li><a href="#col-section-contact">Contact</a></li>
            <!--<li class="dropdown section-private">
              <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown <span class="caret"></span></a>
              <ul class="dropdown-menu" role="menu">
                <li><a href="#">Action</a></li>
                <li><a href="#">Another action</a></li>
                <li><a href="#">Something else here</a></li>
              </ul>
            </li>
          </ul>-->
        </div><!--/.navbar-collapse -->
      </div><!-- end container -->
      
      <div class="sub-header">
        <div class="container">
          <div class="row">
            <div class="col-xs-9">
              <p>Veldwerk 2.0 <span class="label label-default">beta</span></p>
            </div>
            <div class="col-xs-3">
              <div id="login-link-wrap" class="pull-right">
                <a href="#" id="loginLink" ><span class="glyphicon glyphicon-user hidden-xs"></span> Inloggen</a>
              </div>
              
              <div class="dropdown pull-right hidden" id="user-menu-dropdown-wrap">  
                <a class="user-toggle-actions" id="user-menu-dropdown" data-toggle="dropdown">
                  <span class="hidden-xs userNameLabel" id="userNameLabel">Inloggen</span> <span class="caret hidden-xs"></span>
                  <span class="glyphicon glyphicon-user visible-xs"><span class="caret"></span></span>
                </a>
                <ul class="dropdown-menu dropdown-menu-left" role="menu" aria-labelledby="user-menu-dropdown">
                  <li role="presentation"><span class="userNameLabel"></span></li>
                  <li role="presentation"><span class="userOrgLabel"></span></li>
                  <li role="presentation" class="divider"></li>
                  <li role="presentation"><a role="menuitem" tabindex="-1" href="#" id="logoutLink">Uitloggen</a></li>
                </ul>
              </div><!-- end div.dropdown -->
            </div>
            <!--<div class="col-xs-3">
              <p class="pull-right"><a href="#" class="user-toggle-actions" id="loginLink"><span class="glyphicon glyphicon-user"></span> <span class="hidden-xs" id="userNameLabel">Inloggen</span> <span class="glyphicon glyphicon-chevron-down"></span><span id="userOrgLabel"></span></a></p>
            </div>-->
          </div>
        </div><!-- end container -->
      </div><!-- end row sub-header -->
    
    </div><!-- end navbar -->
  
  <section id="section-intro-carousel" class="section-public-only">
    <div id="intro-carousel" class="carousel slide">  
      <div class="carousel-inner">
        <div class="item active">
          <!--<img src="img/product-images/iphone/on-the-street-1-2500x1669.jpg" alt="Slide1">-->
          <img
          srcset="img/product-images/iphone/on-the-street-1-2500x1669.jpg 2500w, 
                  img/product-images/iphone/on-the-street-1-1200x801.jpg 1200w,
                  img/product-images/iphone/on-the-street-1-1024x684.jpg 1024w,
                  img/product-images/iphone/on-the-street-1-992x662.jpg 992w,
                  img/product-images/iphone/on-the-street-1-640x427.jpg 640w,
                  img/product-images/iphone/on-the-street-1-320x214.jpg 320w"
          src="img/product-images/iphone/on-the-street-1-992x662.jpg"
          alt="Veldwerk kan moderner!">
          
          <div class="container">
            <div class="carousel-caption">
              <h2>Veldwerk kan moderner!</h2>
            </p></div>
          </div>
        </div>
        <div class="item">
          <img 
          srcset="img/veldwerk-develstein/docent-instructie-2225x1669.jpg 2225w,
          		  img/veldwerk-develstein/docent-instructie-1200x900.jpg 1200w,
                  img/veldwerk-develstein/docent-instructie-1024x768.jpg 1024w,
                  img/veldwerk-develstein/docent-instructie-992x744.jpg 992w,
                  img/veldwerk-develstein/docent-instructie-640x480.jpg 640w,
                  img/veldwerk-develstein/docent-instructie-320x240.jpg 320w"
          src="img/veldwerk-develstein/docent-instructie-992x744.jpg" 
          alt="Voor Iedereen!">
          <div class="container">
            <div class="carousel-caption">
              <h2>Voor iedereen!</h2>
            </div>
          </div>
        </div>
        <div class="item">
          <img
          srcset="img/product-images/iphone/on-the-street-2-2500x1669.jpg 2500w, 
                  img/product-images/iphone/on-the-street-2-1200x801.jpg 1200w,
                  img/product-images/iphone/on-the-street-2-1024x684.jpg 1024w,
                  img/product-images/iphone/on-the-street-2-992x662.jpg 992w,
                  img/product-images/iphone/on-the-street-2-640x427.jpg 640w,
                  img/product-images/iphone/on-the-street-2-320x214.jpg 320w"
          src="img/product-images/iphone/on-the-street-2-992x662.jpg"
          alt="Helemaal van nu!">
          
          <div class="container">
            <div class="carousel-caption">
              <h2>Helemaal van nu</h2>
            </div>
          </div>
        </div>
      </div>
      <!-- Controls -->
      <a class="left carousel-control" href="#intro-carousel" data-slide="prev"><span class="glyphicon glyphicon-chevron-left"></span></a>
      <a class="right carousel-control" href="#intro-carousel" data-slide="next"><span class="glyphicon glyphicon-chevron-right"></span></a>  
    </div><!-- /.carousel -->
  </section><!-- end section-intro-carousel -->

  <section id="section-workflow" class="section-white section-public section-public-only">	
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <h3>In drie stappen online</h3>
        </div>
      </div>
      <div class="row">
        <div class="col-xs-12">
          <p>Een digitaal veldwerk maken voor uw leerlingen is eenvoudiger dan gedacht.</p>
        </div>
        
        <div class="col-sm-4">
          <div class="circle-tile ">
            <div class="circle-tile-heading dark-blue">1</div>
            <div class="circle-tile-content dark-blue">
              <div class="circle-tile-title">Toegang krijgen</div>
              <div class="circle-tile-description text-faded"> 
                <p>Om gebruik te maken van het digitale veldwerk gebruikt u een ArcGIS Online Organisatie account. Meer informatie daarover is te vinden op <a href="">deze pagina</a>.</p>
                <p>Nadat er een organisatie accounts voor uw school is geactiveerd kunt u aan de slag!</p>
              </div>
             
              <div class="circle-tile-footer" ></div>
            </div>
          </div>
        </div>
        
        <div class="col-sm-4">
          <div class="circle-tile ">
            <div class="circle-tile-heading dark-blue">2</div>
            <div class="circle-tile-content dark-blue">
              <div class="circle-tile-title">Kaart maken</div>
              <div class="circle-tile-description text-faded"> 
                <p>Wanneer u inlogt in de ArcGIS Online organisatie van uw school staan er standaard voorbeelden klaar waarmee u snel aan de slag kunt om een kaart te maken voor uw leerlingen.</p>
                <p>In de kaart kunt u vragen, tips en een route opnemen. Ook afbeeldingen kunnen worden toegevoegd. Om het maken van uw kaart eenvoudiger te maken helpen wij u graag via <a href="">deze Esri Online Training</a>.</p>
              </div>
             
              <div class="circle-tile-footer" ></div>
            </div>
          </div>
        </div>
        
        <div class="col-sm-4">
          <div class="circle-tile ">
            <div class="circle-tile-heading dark-blue">3</div>
            <div class="circle-tile-content dark-blue">
              <div class="circle-tile-title">Klaarzetten voor leerlingen</div>
              <div class="circle-tile-description text-faded"> 
                <p>Wanneer u helemaal tevreden bent met de door u gemaakte kaart gebruikt u deze website om eenvoudig de kaart klaar te zetten voor de dag(en) waarop uw leerlingen naar buiten gaan.</p>
                <p>Deze tool helpt u om automatisch gebruikers een te maken voor uw leerlingen, eventueel leerlingen in te delen in groepen en uiteindelijk elke groep (of leerling) een eigen versie van de kaart te geven.</p>
              </div>
             
              <div class="circle-tile-footer" ></div>
            </div>
          </div>
        </div>

      </div><!-- end row -->
    </div><!-- end container -->
  </section>
   
   <section id="section-webmap-selection" class="section-grey section-private"> 
    <div class="container container-webmap-selection">
      <div class="row">
        
        <div class="col-xs-12">
          <h3>Veldwerk Webmap</h3>
        </div><!-- end col-xs-12 -->
        
        <div class="col-xs-12">
          <p>Geselecteerde webmap voor dit veldwerk: <strong><span class="selected-webmap-title"></span></strong>. <button type="button" class="btn btn-default btn-xs btn-toggle-webmap-details">Details</button> <button type="button" class="btn btn-default btn-xs btn-select-different-webmap">Kies een andere</button></p>
        </div>
        
        <div class="webmap-list-container">
          <!-- JS will place all webmaps's from the portal here after singin -->
        </div><!-- end webmap-list-container -->
        
        <div class="col-sm-12" id="col-selected-webmapp">
          <div class="webmap-selected-wrap">
            <div class="selected-webmap-map"><!-- JS will place the details of a user-selected webmap here --></div>
          </div>
        </div><!-- end col-sm-6 #selected-webmapp -->
        
        
        
        
      </div><!-- end row -->
    </div><!-- end container webmap-selection -->
  </section><!-- end section webmap-selection -->  

  <section id="section-define-users" class="section-white section-private">
    <div class="container">
      <div class="row">
        <div class="col-xs-12">
          <h3>Groepen en gebruikers beheren</h3>
        </div><!-- end col-xs-12 -->
      </div><!-- end row -->
      <div class="row">
        <div class="col-xs-12">
          <p>Voor aangemaakte groepen worden automatisch nieuwe webmaps met de juiste filters aangemaakt.</p>
        </div>
      </div><!-- end row -->
      
      <div class="row">


        <div class="col-xs-8">
        <h4>Bestaade groepen</h4>
        
                    <div class="input-group custom-search-form">
                      <input type="text" class="form-control listSearch" data-listSearch="groups-list" placeholder="Zoek op groepsnaam">
                      <span class="input-group-btn">
                        <button class="btn btn-default" type="button">
                          <span class="glyphicon glyphicon-search"></span>
                        </button>
                      </span>
                    </div>
          <div class="selected-webmap-groups thumbnail">

            <ul class="" id="groups-list">
            </ul>
          </div><!-- end selected-webmap-groups thumbnail -->
        </div><!-- end col-xs-12 -->

        <div class="col-xs-4">
        <h4>Bewerken</h4>
            <p><button type="button" class="btn btn-default" data-toggle="modal" data-target="#modal-add-group">Groep toevoegen</button></p>
            <p><button type="button" class="btn btn-default" data-toggle="modal" data-target="#modal-add-groups">Groep toevoegen in bulk</button></p>
            <p><button type="button" class="btn btn-default btn-goto-add-users" data-toggle="modal" data-target="#modal-add-users" id="manageUsersDragdrop">Gebruikers beheren</button></p>
        </div>

            
      </div>


      
    </div><!-- end container -->
  </section>
  
<!-- start section-tools -->  
  <section id="section-tools" class="section-blue section-private">
    <div class="container">
      
      <div class="row">
        <div class="col-xs-12">
          <h3>Tools</h3>
        </div><!-- end col-xs-12 -->
      </div><!-- end row -->
      
      <div class="row">
        
        <div class="col-sm-6 col-md-4">
          <div class="thumbnail">
            <div class="caption">
              <h3><span class="glyphicon glyphicon-export" aria-hidden="true"></span> Exporteer CSV</h3>
              <p>Hebben uw leerlingen vragen beantwoord? Gebruik deze tool om alle kaartlagen van de webmap te exporteren naar een CSV bestand en de antwoorden te bekijken.</p>
              <p><button class="btn btn-primary" data-toggle="modal" data-target="#modal-export-item">Tool openen</button></p>
            </div><!-- end caption -->
          </div><!-- end thumbnail -->
        </div><!-- end col-sm-6 col-md-4 -->
      
      </div><!-- end row -->

    </div><!-- end container -->
  </section>
<!-- end section-tools -->

<!-- start section-contact-and-about -->
  <section id="section-contact-and-about" class="section-white">
   	<div class="container">
      <div class="row">
        <div class="col-md-6" id="col-section-contact">
          <h3>Contact</h3>
          <form role="form">
            <div class="form-group">
              <label for="name">Naam</label>
              <input type="text" name="name" class="form-control" placeholder="Uw naam"/>
            </div>
            
            <div class="form-group">
              <label for="email">E-mailadres</label>
              <input type="email" name="email" class="form-control" placeholder="Waar mag onze reactie naartoe?"/>
            </div>
            
            <div class="form-group">
              <label for="message">Bericht</label>
              <textarea class="form-control" name="message" rows="3"></textarea>
            </div>
            <button type="submit" class="btn btn-default">Verstuur</button>
          </form>
        </div><!-- end col-md-6 -->
        <div class="col-md-6" id="col-section-about">
          <h3>Wie maken Veldwerk 2.0?</h3>
          <p>Het concept voor Veldwerk 2.0 is tot stand gekomen door een samenwerking tussen Esri Nederland en een enthiousaste aardrijkskunde docent.</p>
          <h3>Esri Nederland</h3>
          <p>Esri Nederland is een dynamisch IT-bedrijf en marktleider in geografische informatiesystemen (GIS). Organisaties en bedrijven kunnen succesvoller zijn als ze informatie geografisch benaderen. Onskwalitatief hoogwaardige GIS-product leveren we in combinatie met een uitgebreide tak dienstverlening. Uiteraard bieden we support aan, verzorgen we een breed scala aan opleidingen en organiseren we jaarlijks twee grote GIS-evenementen. Onze organisatie beschikt over een wereldwijd netwerk aan kennis en ervaring op GIS-gebied!</p>
          <h3>De docent</h3>
          <p>Dennis Hunink is werkzaam als aardrijkskunde docent op een middelbare school in Zwijndrecht. Naast passie voor zijn vak in het algemeen heeft hij een voorliefde voor GIS. Eerder ontwikkelde hij de website <a href="https://topografieindeklas.nl">topografieindeklas.nl</a>, waar leerlingen gratis gemakkelijk topografie kunnen leren. </p>
        </div><!-- end col-md-6 -->
      </div><!-- end row -->
    </div><!-- end container -->
  </section><!-- end section-contact -->
  
  <section id="section-footer" class="section-blue">  
    <div class="container">
      <hr>

      <footer>
        <p>&copy; Esri Nederland, 2014</p>
      </footer>
    </div> <!-- /container --> 
  </section>  
<!-- end section-contact-and-about -->
  
  <!-- MODALS -->
  <!--
  START MODAL ADD GROUP
  -->
  <div class="modal fade" id="modal-add-group" tabindex="-1" role="dialog" aria-labelledby="Groep toevoegen" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Sluit</span></button>
          <h4 class="modal-title">Nieuwe groep aanmaken</h4>
        </div>
        <div class="modal-body">
          
          <label>Naam van de groep</label>
          <input type="text" name="groupname"/>
          <p class="help-block">Hou de naam kort en krachtig</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Annuleer</button>
          <button type="button" class="btn btn-primary" data-loading-text="<span class='glyphicon glyphicon-repeat spin-icon'></span> Bezig..." autocomplete="off">Aanmaken</button>
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div><!-- /.modal -->   
  
  <!-- MODALS -->
  <!--
  START MODAL EDIT GROUP
  -->
  <div class="modal fade" id="modal-edit-group" tabindex="-1" role="dialog" aria-labelledby="Groep bewerken" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Sluit</span></button>
          <h4 class="modal-title">Groep bewerken</h4>
        </div>
        <div class="modal-body">
          
          <input type="hidden" name="groupid"/>
          
          <label>Naam van de groep</label>
          <input type="text" name="groupname"/>
          <p class="help-block">Hou de naam kort en krachtig</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Annuleer</button>
          <button type="button" class="btn btn-primary" data-loading-text="<span class='glyphicon glyphicon-repeat spin-icon'></span> Bezig..." autocomplete="off">Opslaan</button>
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div><!-- /.modal -->   
  
  <!-- 
  START MODAL DELETE GROUP
  -->
  <div class="modal fade" id="modal-delete-group" tabindex="-1" role="dialog" aria-labelledby="Groep verwijderen" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Sluit</span></button>
          <h4 class="modal-title">Groep verwijderen</h4>
        </div>
        <div class="modal-body">
          
          <input type="hidden" name="groupid"/>
          <p>U staat op het punt om de groep <em><span class="groupname"></span></em> te verwijderen uit ArcGIS Online.</p>
          
          <label>Wilt u de kaart die hoort bij deze groep verwijderen?</label>
          <div class="radio">
            <label>
              <input type="radio" name="delete-map" id="donot-delete-map" value="no">
              Nee
            </label>
          </div>
          <div class="radio">
            <label>
              <input type="radio" name="delete-map" id="do-delete-map" value="yes">
              Ja, verwijder de kaart van deze groep
            </label>
          </div>
          
          <label>Wilt u de gebruikers van deze groep verwijderen?</label>
          <div class="radio">
            <label>
              <input type="radio" name="delete-users" id="donot-delete-users" value="no" checked>
              Nee
            </label>
          </div>
          <div class="radio">
            <label>
              <input type="radio" name="delete-users" id="do-delete-users" value="yes">
              Ja, verwijder de gebruikers van deze groep
            </label>
          </div>
          
          <label>Wilt u de beantwoorde vragen van deze groep verwijderen?</label>
          <div class="radio">
            <label>
              <input type="radio" name="delete-questions" id="donot-delete-questions" value="no" checked>
              Nee
            </label>
          </div>
          <div class="radio">
            <label>
              <input type="radio" name="delete-questions" id="do-delete-questions" value="yes">
              Ja, verwijder de gebruikers van deze groep
            </label>
          </div>
          
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Annuleer</button>
          <button type="button" class="btn btn-primary" data-loading-text="<span class='glyphicon glyphicon-repeat spin-icon'></span> Bezig..." autocomplete="off">Verwijderen</button>
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div><!-- /.modal -->   
  
  <!-- 
  START MODAL ADD USERS
  -->
  <div class="modal fade" id="modal-add-users" tabindex="-1" role="dialog" aria-labelledby="Gebruiker(s) toevoegen" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Sluit</span></button>
          <h4 class="modal-title">Gebruikers beheren</h4>
        </div>
        <div class="modal-body">
 
                <div class="row">
                  <div class="col-xs-12">
                  	<!--<span class="btn btn-default" id="initAssiningUsersToGroup">Start</span>-->
                    <div class="alert alert-info">Sleep gebruikers uit de rechterkolom naar de groep in de rechterkolom waaraan u de gebruiker toe wilt voegen. Aanpassingen worden direct uitgevoerd en opgeslagen.</div>
                  </div>
                </div>
                <div class="row">
                  
                  <div class="col-xs-6">
                    <label>Alle groepen</label>
                    <div class="input-group custom-search-form" id="groups-aol-search">
                      <input type="text" class="form-control listSearch" data-listSearch="assiningUsersToGroupGroups" placeholder="Zoek op groepsnaam">
                      <span class="input-group-btn">
                        <button class="btn btn-default" type="button">
                          <span class="glyphicon glyphicon-search"></span>
                        </button>
                      </span>
                    </div><!-- /input-group -->
                    
                    <ul class="list-group" id="assiningUsersToGroupGroups">
                    </ul>
                  </div><!-- end col-xs-6 -->
                
                  <div class="col-xs-6 with-bg-grey">
                    <label>Alle gebruikers</label>
                    <div class="input-group custom-search-form" id="users-aol-search">
                      <input type="text" class="form-control listSearch" data-listSearch="assiningUsersToGroupUsers" placeholder="Zoek op naam">
                      <span class="input-group-btn">
                        <button class="btn btn-default" type="button">
                          <span class="glyphicon glyphicon-search"></span>
                        </button>
                      </span>
                    </div><!-- /input-group -->
                     
                    <ul class="list-group" id="assiningUsersToGroupUsers">
                    </ul>
        
                  </div><!-- end col-xs-6 -->    
                </div><!-- end div row -->
                
          
          
        </div><!-- end #modal-body -->
        
        <div class="modal-footer">
          
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div><!-- /.modal --> 
  
  <!--
  START MODAL DELETE USER
  -->
  <div class="modal fade" id="modal-delete-user" tabindex="-1" role="dialog" aria-labelledby="Gebruiker verwijderen" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Sluit</span></button>
          <h4 class="modal-title">Gebruiker verwijderen</h4>
        </div>
        <div class="modal-body">
          
          <input type="hidden" name="groupid"/>
          <input type="hidden" name="username"
          <p>U staat op het punt om gebruiker <em><span class="username"></span></em> uit groep <em><span class="groupname"></span></em> te verwijderen </p>
          
          <label>Wilt u het account van deze gebruiker ook verwijderen uit ArcGIS Online?</label>
          <div class="radio">
            <label>
              <input type="radio" name="delete-users" id="donot-delete-users" value="no" checked>
              Nee
            </label>
          </div>
          <div class="radio">
            <label>
              <input type="radio" name="delete-users" id="do-delete-users" value="yes">
              Ja, verwijder de gebruiker uit ArcGIS Online
            </label>
          </div>
          
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Annuleer</button>
          <button type="button" class="btn btn-primary" data-loading-text="<span class='glyphicon glyphicon-repeat spin-icon'></span> Bezig..." autocomplete="off">Verwijderen</button>
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div><!-- /.modal -->   
  
  
  <!-- 
  //START #modal-export-item//
  -->
  <div class="modal fade" id="modal-export-item" tabindex="-1" role="dialog" aria-labelledby="Exporteren" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Sluit</span></button>
          <h4 class="modal-title">Exporteren</h4>
        </div>
        <div class="modal-body">
          
          <p><button type="button" class="btn btn-primary" data-loading-text="<span class='glyphicon glyphicon-repeat spin-icon'></span> Bezig..." autocomplete="off">Start exporteren</button></p>
          <p class="msg-job-working hidden"><span class='glyphicon glyphicon-repeat spin-icon'></span> Bezig...</p>
          <p class="msg-job-success hidden">Exporteren is geslaagd! Het CSV bestand is beschikbaar in uw ArcGIS Online Account op de pagina <strong>Mijn Content</strong>.<br/><br/>
          <strong>TIP!</strong> Lees <a href="https://support.office.com/en-za/article/Import-or-export-text-txt-or-csv-files-5250ac4c-663c-47ce-937b-339e391393ba" target="_blank">hier</a> hoe u een CSV bestand kunt converteren naar een Microsoft Excel bestand.</p>
          <p class="msg-job-failed hidden"><strong>Mislukt</strong> Er is iets misgegaan bij het exporteren. Probeer opnieuw.</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-default" data-dismiss="modal">Sluit venster</button>
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div><!-- /.modal --> 
  
  <!-- 
  START MODAL ADD USERS
  -->
  <div class="modal fade" id="modal-add-groups" tabindex="-1" role="dialog" aria-labelledby="Maak groepen" aria-hidden="true">
    <div class="modal-dialog modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Sluit</span></button>
          <h4 class="modal-title">Maak groepen</h4>
        </div>
        <div class="modal-body">
        	<div class="well well-lg" id="groupBulkExcelDropArea">
        		<p>Drop hier een .xls (Excel) bestand. <a href="/files/exampleUsersGroups.xls" target="_blank">Een voorbeeld is hier te downloaden.</a></p>
        		<p id="groupBulkExcelLoaded" style="visibility: hidden">Het bestand <em id="groupBulkExcelLoadedName"></em> is geladen.</p>
        	</div>
        	
        	<div id="groupBulkExcelColumnselectArea" style="display:none">


				<table class="table table-hover" id="groupBulkExcelCheckTable">
					<thead>
						<tr><th>Gebruikersnaam</th><th>Groepsnaam</th></tr>
						<tr><td colspan="2"><p>In welke kolom staan de gebruikersnamen (inlognamen) en en welke kolom de groepsnamen?</p></td></tr>
						<tr><td><select id="groupBulkExcelColumnUsers"></select></td><td><select id="groupBulkExcelColumnGroups"></select></td></tr>
					</thead>
					<tbody>
					</tbody>
				</table>
				<p>Klik op <em>Maak groepen</em> om de groepen uit het Excel-bestand aan te maken. Wilt u ook de gebruikers uit het Excel-bestand toevoegen aan de groepen, kies dan voor <em>Gebruikers koppelen</em>.</p>
				<p>
				<span class="btn btn-default" id="groupBulkExcelDoTheMagic">Maak groepen</span>
				<span class="btn btn-default" id="groupBulkExcelDoTheMagic2">Koppel gebruikers</span>
				</p>
        	</div>

        
        </div>
      </div>
    </div>
  </div>
              
  
  <!-- Default JS Stuff -->  
  <script src="js/vendor/psswrd.min.js"></script>
  <script src="js/vendor/picturefill.min.js"></script>
  
  <!-- jQuery JS stuff -->          
  <script src="//ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>

<link rel="stylesheet" href="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/themes/smoothness/jquery-ui.css" />
<script src="https://ajax.googleapis.com/ajax/libs/jqueryui/1.11.3/jquery-ui.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/jqueryui-touch-punch/0.2.3/jquery.ui.touch-punch.min.js"></script>

  <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.11.1.min.js"><\/script>')</script>
  <script src="js/vendor/jquery.smooth-scroll.js"></script>
  <script src="js/vendor/store-and-json2.min.js"></script>
  <script src="js/vendor/hideShowPassword.min.js"></script>
  <script src="js/vendor/shim.js"></script>
  <script src="js/vendor/dist/jszip.js"></script>
  <script src="js/vendor/dist/xls.js"></script>
  <script src="js/vendor/dist/xlsx.js"></script>

  <!-- Bootstrap JS stuff -->
  <script src="js/vendor/bootstrap.min.js"></script>
  <script src="js/vendor/bootstrap-switch.min.js"></script>
  
  <!-- DOJO Config -->
  <script>
        //async is a new dojoConfig option. The default value of false will load all the Dojo base modules
        //here we set it to true to take advantage of the asynchronous nature of dojo and the the base modules
        //are not automatically loaded.
        var dojoConfig = { async: true, paths: { js: location.pathname.replace(/\/[^/]+$/, "") + "\/js" } };
  </script>
  
  <!-- Esri JS Stuff -->
  <script src="//js.arcgis.com/3.11/"></script>
  
  <!-- Own JS Stuff -->
  <script src="js/main.js"></script>
    
  <!-- google web font -->
  <script type="text/javascript">
    WebFontConfig = {
      google: { families: [ 'Open+Sans:400italic,400,300,600,700:latin' ] }
    };
    (function() {
      var wf = document.createElement('script');
      wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
      wf.type = 'text/javascript';
      wf.async = 'true';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(wf, s);
    })(); 
  </script>
    
  <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
  <script>
        (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
        function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
        e=o.createElement(i);r=o.getElementsByTagName(i)[0];
        e.src='//www.google-analytics.com/analytics.js';
        r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
        ga('create','UA-XXXXX-X');ga('send','pageview');
  </script>
    </body>
</html>