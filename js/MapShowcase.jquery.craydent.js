/* JavaScript for: Map Showcase
created by: Corey Hadden - June 2013
requires: craydent 1.7+ | jQuery 1.9-,
*/

function MapShowcase(specs){
/*-------------------------------------------------------------------->
	0 | SETUP
<--------------------------------------------------------------------*/
	this.defaults = {
		container:'body'
	}

	this.specs = $.extend({},this.defaults,specs);
	this.shortcuts = this.specs.shortcuts || [];
	this.maps=[];
/*-------------------------------------------------------------------->
	1 | RENDER
<--------------------------------------------------------------------*/
	this.initRender = function(){
		dojo.addOnLoad(function(){
			var MS = this.__MS[window.__MSloaded];
			var conDom = (MS.specs.container == "body")?"body":"#"+MS.specs.container;
			var appClass = 'map-showcase-app';
			MS.specs.chiclets && (appClass += " chiclets-app");
			MS.specs.tabs && (appClass += " tabs-app");
			
			$(conDom).html(MS.render())
			.addClass(appClass);
			MS.specs.chiclets && MS.initChicletMap();
			MS.specs.tabs && MS.initTabMap();
			
			window.__MSloaded++;
		})
	}
	
	this.render = function(){
		var 
		html = 
			"<div class='map-showcase'>"+
				this.renderMapDiv()+
				((this.specs.chiclets && this.renderChicletMenu())||'')+
				((this.specs.tabs && this.renderTabMenu())||'')+		
			"</div>";
	
		return html;
	}

/*-------------------------------------------------------------------->
	2 | MAP
<--------------------------------------------------------------------*/
	this.renderMapDiv = function(){
		
		var html=
		"<div id='"+this.ID+"-map' class='ms-map-container' data-ms='"+this.showcaseIndex+"'>"+
			this.renderChicletMapDivs()+
			this.renderTabMapDivs()+
		"</div>";
		return html;
	}

	this.initMap = function(webmapid,div,chiclet,tab){
		var 
		webmapid = webmapid || this.specs.defaultwebmap || '8b3b470883a744aeb60e5fff0a319ce7',
		mapSpecs = {};
		(this.currentExtent && chiclet) && (mapSpecs.extent = this.currentExtent);
		
		
		esri.arcgis.utils.createMap(webmapid,div||this.ID+'-map',{mapOptions:mapSpecs})//,{mapOptions:{}})
			.then(function(response){
			var MS = getMS(response.map.container.dataset['ms']);
			//MS.extent = response.map.
			if(MS.maps.length == 0){
				MS.currentExtent = response.map.extent;
			}
			MS.maps.push(response.map);
			dojo.connect(response.map,'onExtentChange',MS.extentChangeHandler);
			//alert(response);
			/*__MWAref.map = response.map;
			__MWAref.graphicsLayer = response.map.graphics;
			__MWAref.roomsLayer = new esri.layers.GraphicsLayer({id:"roomsLayer"});
			__MWAref.locationsLayer = new esri.layers.GraphicsLayer({id:"locationsLayer"});
			__MWAref.userLayer = new esri.layers.GraphicsLayer({id:"userLocation"});
			__MWAref.map.addLayer(__MWAref.roomsLayer);
			__MWAref.map.addLayer(__MWAref.locationsLayer);
			__MWAref.map.addLayer(__MWAref.userLayer);
			$(__MWAref.specs.container).addClass('map-ready');
			//document.getElementById('MWA-map').innerHTML +='<div id="MWA-mapinfo-panel"></div>';
			//$('#'+__MWAref.map.id).append('<div id="MWA-mapinfo-panel" style="display:none;"></div>');
			dojo.connect(__MWAref.map,'onClick',__MWAref.hideMapInfoPanel);
			dojo.connect(__MWAref.roomsLayer,'onClick',__MWAref.roomClickHandler);
			dojo.connect(__MWAref.locationsLayer,'onClick',__MWAref.locationClickHandler);
			dojo.connect(__MWAref.map,'onExtentChange',__MWAref.extentChangeHandler)*/
		})
	}

	this.extentChangeHandler = function(ext,delta,r,e,f,i,u){
		var mscontainer = $(this.__container).parents('.ms-map');
		if(mscontainer.hasClass('active') && (delta.x || delta.y)){
			getMS(mscontainer.dataset.ms).currentExtent = this.extent;
		}
		//logit(ext);
	}
/*-------------------------------------------------------------------->
	3 | Chiclets
<--------------------------------------------------------------------*/
	
	this.initChicletMap = function(webmapid,div){
		webmapid = webmapid || (this.specs.defaultwebmap || this.specs.chiclets[0]).webmap;
		div = this.ID+'-'+webmapid;
		
		this.initMap(webmapid,div,true,false);
	}
	
	this.renderChicletMapDivs = function(){
		if(!this.specs.chiclets){return '';}
		var 
		
		chiclets = this.specs.chiclets,
		defaultwebmap = this.specs.defaultwebmap || chiclets[0],
		MS = this,
		active,
		html="";
		
		this.specs.chiclets.map(function(chic,i){
			active = (chic.webmap == defaultwebmap.webmap)?'active':'';
			html+= 
				"<div id='"+MS.ID+"-"+chic.webmap+"' class='ms-chiclet-map ms-map "+active+"' "+
				"data-ms='"+MS.ID+"' data-webmap='"+chic.webmap+"'>"+
				//chic.display+
				"</div>";
		})
		return html;
	}
	this.renderChicletMenu = function(){
		var 
		chiclets = this.specs.chiclets,
		defaultwebmap = this.specs.defaultwebmap || chiclets[0],
		MS = this,
		active ='',
		action = function(webmapid){return 'onclick="__MS['+MS.showcaseIndex+'].toggleChicletMap(this);"';},
		html = 
			"<div id='"+this.ID+"-chiclets' class='ms-chiclets-menu'>";
			chiclets.map(function(chic,i){
				active = (chic.webmap == defaultwebmap.webmap)?'active':'';
				html+= 
					"<div id='"+MS.ID+"-chiclet-"+i+"' "+action(chic.webmap)+" class='ms-chiclet "+active+"'"+
					" data-webmap='"+chic.webmap+"' data-ms='"+MS.ID+"'>"+
						"<img class='chiclet-image' src='graphics/icons/"+chic.image+".jpg'/>"+
						"<div class='ms-chiclet-label'>"+chic.display+"</div>"+
					"</div>";
			})			
			
		html+=
			"<div class='clear'></div>"+
			"</div>";
	
		return html;
	}

	this.toggleChicletMap = function(chicDom){
		var 
			webmapid = chicDom.dataset['webmap'];
			MS = getMS(chicDom.dataset['ms']);
			domid = MS.ID+'-'+webmapid;
		
		$(chicDom).addClass('active').siblings().removeClass('active');
	
			
		if($(domid).innerHTML == ''){
			this.initChicletMap(webmapid,domid);
		}
		else{
			MS.maps[$(chicDom).index()].setExtent(MS.currentExtent);
		}
	
		$('#'+domid).addClass('active').siblings().removeClass('active');
	
	}
/*-------------------------------------------------------------------->
	4 | Tabs
<--------------------------------------------------------------------*/	
	this.initTabMap = function(webmapid,div){
		webmapid = webmapid || (this.specs.defaultwebmap || this.specs.tabs[0]).webmap;
		div = this.ID+'-'+webmapid;
		
		this.initMap(webmapid,div,false,true);
	}
	
	this.renderTabMapDivs = function(){
		if(!this.specs.tabs){return '';}
		var 
		tabs = this.specs.tabs,
		defaultwebmap = this.specs.defaultwebmap || tabs[0],
		MS = this,
		active,
		html="";
		
		tabs.map(function(tab,i){
			active = (tab.webmap == defaultwebmap.webmap)?'active':'';
			html+= 
				"<div id='"+MS.ID+"-"+tab.webmap+"' class='ms-tab-map ms-map "+active+"' "+
				"data-ms='"+MS.ID+"' data-webmap='"+tab.webmap+"'>"+
				//chic.display+
				"</div>";
		})
		return html;
	}
	this.renderTabMenu = function(){
		var 
		tabs = this.specs.tabs,
		defaultwebmap = this.specs.defaultwebmap || tabs[0],
		MS = this,
		active ='',
		action = function(webmapid){return 'onclick="__MS['+MS.showcaseIndex+'].toggleTabMap(this);"';},
		html = 
			"<div id='"+this.ID+"-tabs' class='ms-tabs-menu'>";
			tabs.map(function(tab,i){
				active = (tab.webmap == defaultwebmap.webmap)?'active':'';
				html+= 
					"<div id='"+MS.ID+"-tab-"+i+"' "+action(tab.webmap)+" class='ms-tab "+active+"'"+
					" data-webmap='"+tab.webmap+"' data-ms='"+MS.ID+"'>"+
						//"<img class='chiclet-image' src='graphics/icons/"+chic.image+".jpg'/>"+
						"<div class='ms-tab-label'>"+tab.display+"</div>"+
					"</div>";
			})			
			
		html+=
			"<div class='clear'></div>"+
			"</div>";
	
		return html;
	}
	this.toggleTabMap = function(tabDom){
		var 
			webmapid = tabDom.dataset['webmap'];
			MS = getMS(tabDom.dataset['ms']);
			domid = MS.ID+'-'+webmapid;
		
		$(tabDom).addClass('active').siblings().removeClass('active');
	
			
		if($(domid).innerHTML == ''){
			this.initTabMap(webmapid,domid);
		}
	
		$('#'+domid).addClass('active').siblings().removeClass('active');
	
	}

this.getWebmap = function(wmid){
	var wm = this.shortcuts.filter(function(w){
		return (w.webmap == wmid || widisplay == wmid);
	})[0]||false;
	
	return wm;
	
}
	
	window.__MS = window.__MS || [];
	this.showcaseIndex = window.__MS.length;
	window.__MS[window.__MS.length] = this;
	window.__MSloaded = window.__MSloaded || 0; 
	this.ID = "MS"+this.showcaseIndex;
	this.initRender();
	return this;	
}



function getMS(index){
	return window.__MS[((String(index)).replace('MS',''))];
}

