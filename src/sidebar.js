import L from 'leaflet'

L.Control.Sidebar = L.Control.extend({
	options: {
		position: 'topleft',
		openOnAdd: false,
		showHeader: false,
		showFooter: false,
		fullHeight: false,
		togglePan: false,
		autoResize: false,
		headerHeight: 10,
		footerHeight: 10
	},
	initialize: function(sidebarID, options)
	{
		// Sets options of leaflet object
    // L.setOptions(this, options);

    this._div = L.DomUtil.create('div', 'info data exteeends');
    this._div.innerHTML = '<h4>#deaths by country</h4><b>Hover over a country</b>'



    return this._div
  },
	onAdd: function(map)
	{
		console.log('onadd')
}

});

L.extend(L.Control.Sidebar.prototype, L.Evented.prototype);

L.control.sidebar = function(sidebarID, options) {
	return new L.Control.Sidebar(sidebarID, options);
};
