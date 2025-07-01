document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    function loadJSONFromDOM(id) {
        // jsonify is dumb.
        return JSON.parse(JSON.parse(document.getElementById(id).innerHTML));
    }
    var mapElement = document.getElementById('map');
    mapElement.style.height = mapElement.clientHeight * 1.3 + 'px';
    var svg = mapElement.firstElementChild.cloneNode(true);
    mapElement.innerHTML = '';
    var viewBoxCoordinates = svg.getAttribute('viewBox').split(' ');
    var width = Number(viewBoxCoordinates[2]) - Number(viewBoxCoordinates[0]);
    var height = Number(viewBoxCoordinates[3]) - Number(viewBoxCoordinates[1]);
    var map = L.map('map', {
        minZoom: 0,
        maxZoom: 1,
        zoom: 0,
        crs: L.CRS.Simple,
        layers: [
            L.svgOverlay(svg, [
                [0, 0],
                [height, width]
            ])
        ],
        maxBounds: [
            [0, 0],
            [height, width]
        ]
    });
    var boundingBox = loadJSONFromDOM('bounding-box-data');
    function coordsToPixels(lat, lng) {
        return {
            x: (lng - boundingBox.left) / (boundingBox.right - boundingBox.left) * width,
            y: height - (lat - boundingBox.top) / (boundingBox.bottom - boundingBox.top + 0.7) * height
        };
    }
    var cities = loadJSONFromDOM('city-data');
    var iconSize = loadJSONFromDOM('icon-data');
    var icons = {};
    for (var size in iconSize) {
        icons[size] = L.icon({
            iconUrl: '/images/places/' + size + '.png',
            // Scaled down icons for high DPI screens (target is 30px)
            iconSize: [iconSize[size] / 2.5, iconSize[size] / 2.5]
        });
    }
    var mapCenter = {
        left: width / 2, right: width / 2,
        top: height / 2, bottom: height / 2
    };
    cities.forEach(function (city) {
        var pixelCoords = coordsToPixels(city.lat, city.lng);
        mapCenter.left = (pixelCoords.x < mapCenter.left) ? pixelCoords.x : mapCenter.left;
        mapCenter.right = (pixelCoords.x > mapCenter.right) ? pixelCoords.x : mapCenter.right;
        mapCenter.top = (pixelCoords.y > mapCenter.top) ? pixelCoords.y : mapCenter.top;
        mapCenter.bottom = (pixelCoords.y < mapCenter.bottom) ? pixelCoords.y : mapCenter.bottom;
        var marker = L.marker(
            [pixelCoords.y, pixelCoords.x], {
            icon: icons[city.type],
            title: city.name
        }
        );
        marker.bindPopup(city.name);
        marker.addTo(map);
    });
    map.panTo([
        (mapCenter.top + mapCenter.bottom) / 2.0,
        (mapCenter.left + mapCenter.right) / 2.0,
    ]);
});
