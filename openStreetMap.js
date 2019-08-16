    var osmUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib});
	var map = L.map('map').setView([18.148486, -94.473709], 20).addLayer(osm);
    L.marker([18.148486, -94.473709])  
		.addTo(map)
		.bindPopup('Mi casita')
		.openPopup();
