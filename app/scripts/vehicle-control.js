var _ = require('lodash');
var utils = require('./utils');
var Timer = require('./timer');
var config = require('./config');


function start(map) {
    var timer = new Timer(function() {
        return updateVehicles(map);
    }, {
        interval: config.updateInterval
    });
    timer.start();
}


function updateVehicles(map) {
    return utils.get(config.apiUrl)
    .then(function(req) {
        var vehicles = JSON.parse(req.responseText).vehicles;

        _.each(vehicles, function(vehicle) {
            if (_.has(map.markers, vehicle.id)) {
                updateVehicle(map, vehicle);
            } else {
                addVehicle(map, vehicle);
            }
        });

        removeLeftovers(map, vehicles);
    });
}

function addVehicle(map, vehicle) {
    var isMoving = vehicle.rotation !== 0;
    var iconSrc = isMoving ? 'images/bus-moving.svg' : 'images/bus.svg';
    var fontSize = vehicle.line.length > 2 ? 12 : 14;

    map.addMarker(vehicle.id, {
        position: {
            latitude: vehicle.latitude,
            longitude: vehicle.longitude
        },
        text: vehicle.line,
        fontSize: fontSize,
        iconSrc: iconSrc,
        onClick: function() {
            map.clearShapes();

            // If line is in format: Y4, switch it to 4Y so parseInt works
            var line = vehicle.line.split('').sort().join('');
            var route = routes[line];
            if (!route) {
                // Remove letters from the number, 9K -> 9
                route = routes[parseInt(line, 10)];
            }

            if (!route) {
                return;
            }

            map.addShape(route.coordinates);
        }
    });
    map.rotateMarker(vehicle.id, vehicle.rotation);
}

function updateVehicle(map, vehicle) {
    var newPos = {
        latitude: vehicle.latitude,
        longitude: vehicle.longitude
    };
    map.moveMarker(vehicle.id, newPos);

    var isMoving = vehicle.rotation !== 0;
    var iconSrc = isMoving ? 'images/bus-moving.svg' : 'images/bus.svg';
    map.setMarkerIcon(vehicle.id, iconSrc);

    map.rotateMarker(vehicle.id, vehicle.rotation);
}

// Remove all vehicles in map which are not defined in current vehicles
function removeLeftovers(map, vehicles) {
    _.each(map.markers, function(marker, id) {
        var vehicleFound = _.find(vehicles, function(vehicle) {
            return vehicle.id === id;
        });

        if (!vehicleFound) {
            map.removeMarker(id);
        }
    });
}

module.exports = {
    start: start
};
