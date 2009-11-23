/* Roberto Huelga - rhuelga@gmail.com */
CmdUtils.CreateCommand({
    names: ["rae"],
    icon: "http://www.rae.es/favicon.ico",
    description: "Busca la definición de la palabra indicada en el RAE.",
    help: "rae [palabra a buscar].",
    author: {name: "Roberto Huelga", email: "rhuelga@gmail.com"},
    license: "GPL",
    homepage: "http://labs.mozilla.com/",
    arguments: [{role: 'object', nountype: noun_arb_text}],
    preview: function preview(pblock, args) {
	pblock.innerHTML = "Buscando en el diccionario...";
	CmdUtils.previewGet(pblock, "http://buscon.rae.es/draeI/SrvltGUIBusUsual?LEMA=" + args.object.text +"&origen=RAE&TIPO_BUS=3", function (htm) {
            pblock.innerHTML = htm;
	    $(pblock).find('a').attr( "href", function(ar) { return "http://buscon.rae.es/draeI/" + $(this).attr("href") });
	});
    },
    execute: function execute(args) {
	var search_string = args.object.text;
	
	var windowManager = Components.classes["@mozilla.org/appshell/window-mediator;1"]
        .getService(Components.interfaces.nsIWindowMediator);
	var browserWindow = windowManager.getMostRecentWindow("navigator:browser");
	var browser = browserWindow.getBrowser();
	browser.loadOneTab("http://buscon.rae.es/draeI/SrvltGUIBusUsual?LEMA=" + search_string +"&origen=RAE&TIPO_BUS=3", null, null, null, false, false);
    }
});

CmdUtils.CreateCommand({
    names: ["conjugar"],
    icon: "http://www.rae.es/favicon.ico",
    description: "Busca en el RAE la conjugacion del verbo escrito.",
    help: "conjugar [verbo a conjugar].",
    author: {name: "Roberto Huelga", email: "rhuelga@gmail.com"},
    license: "GPL",
    homepage: "http://marssong.blogspot.com/",
    arguments: [{role: 'object', nountype: noun_arb_text}],

    _verbUrl: function rae__verbUrl( verb, callback_ok, callback_not_found ) {
	$.get( "http://buscon.rae.es/draeI/SrvltGUIBusUsual?LEMA=" + verb +"&origen=RAE&TIPO_BUS=3", null, function (data, textStatus) {
	    var verb_addr =  $(data).find('a[href^=SrvltGUIVerbos]').attr( "href" );
	    if( verb_addr ) {
		callback_ok( "http://buscon.rae.es/draeI/" + verb_addr );
	    } else {
		if( callback_not_found ) {
		    callback_not_found( data );
		}
	    }
	})
    },
    
    previewDelay: 500,
    preview: function preview(pblock, args) {
	pblock.innerHTML = "Buscando en el diccionario...";
	this._verbUrl( args.object.text,
		       function (url) {
			   CmdUtils.previewGet(pblock, url, function (htm) {
			       pblock.innerHTML = htm;
			       $(pblock).find('a').attr( "href", function(ar) {
				   return "http://buscon.rae.es/draeI/" + $(this).attr("href")
			       });
			   })},
		       function (data) {
			   pblock.innerHTML = "Verbo '" + args.object.text + "' no encontrado. <hr/><div id=\"rae_data\">" + data +"</div>";
			   $(pblock).find('a').attr( "href", function(ar) {
			       return "http://buscon.rae.es/draeI/" + $(this).attr("href") }); 
		       });
    },
    execute: function execute(args) {

	this._verbUrl( args.object.text, function (url) {
	    var windowManager = Components.classes["@mozilla.org/appshell/window-mediator;1"]
            .getService(Components.interfaces.nsIWindowMediator);
	    var browserWindow = windowManager.getMostRecentWindow("navigator:browser");
	    var browser = browserWindow.getBrowser();
	    browser.loadOneTab( url , null, null, null, false, false);
	})
    }
});