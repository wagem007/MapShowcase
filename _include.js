/* JavaScript include for: Map Showcase Application
last updated: CH JUNE 2013
*/

var includes = "",
web_dir = "http://webapps-cdn.esri.com/tools/MapShowcase/";
switch(location.hostname){
	case 'localhost':
	case 'localhost:81':
	web_dir = '/MapShowcase/';
	break;
}
var
scripts_dir = web_dir+"js/",
scripts = [];
if (typeof jQuery == 'undefined') {  
   scripts.push("libs/jquery-191.min.js");
}
scripts.push(
	/*"libs/craydent-1.7.11.js",*/
	"maplist.html",
	"libs/craydent-1.7.11.min.js",
	"mapShowcase.jquery.craydent.js"
);

var
styles_dir = web_dir+"css/",
styles =[
   "mapShowcase-styles.css"
],
script,style,sc,st,
sc_len = scripts.length,st_len = styles.length;

//scripts
for(sc = 0; sc < sc_len; sc++){
	script = scripts[sc];
	includes+='<script type="text/javascript" src="'+scripts_dir+script+'"></script>';
}
//styles
for(st = 0; st < st_len; st++){
	style = styles[st];
	includes+='<link href="'+styles_dir+style+'" rel="stylesheet" type="text/css">';
}

includes+=
'<meta name="apple-mobile-web-app-capable" content="yes">'+
'<meta name="viewport" content="width=device-width, user-scalable=no,initial-scale=1.0">'+
'<link rel="stylesheet" href="http://serverapi.arcgisonline.com/jsapi/arcgis/3.4/js/esri/css/esri.css">'+
'<script src="http://serverapi.arcgisonline.com/jsapi/arcgis/3.4compact"></script>';


document.write(includes);
// JavaScript Document