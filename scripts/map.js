var Map = function(selector) {
    var mapOptions = {
        center: { lat: 61.487881, lng: 23.7810259},
        zoom: 13,
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false
    };
    this._map = new google.maps.Map(document.querySelector(selector), mapOptions);

    this.markers = {};
};

Map.prototype.addMarker = function addMarker(id, opts) {
    var marker = new google.maps.Marker({
        position: opts.position,
        map: this._map,
        title: opts.title,
        icon: opts.icon
    });

    google.maps.event.addDomListener(marker, 'click', opts.onClick);

    this.markers[id] = marker;
    return marker;
};

Map.prototype.removeMarker = function removeMarker(id) {
    var marker = this.markers[id];

    markert.setMap(null);
    google.maps.event.clearListeners(marker, 'click');
};

Map.prototype.moveMarker = function moveMarker(id, position) {
    var marker = this.markers[id];
    marker.setPosition(position);
};

Map.prototype.updateMarkerIcon = function updateMarkerIcon(id, icon) {
    var marker = this.markers[id];
    marker.setIcon(icon);
};

module.exports = Map;