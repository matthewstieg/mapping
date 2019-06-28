var geo_data = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"
console.log (geo_data)


function markerSize(magnitude) {
    return magnitude * 3;
};


var earthquakes = new L.LayerGroup();

d3.json(geo_data, function (geoJson) {
    L.geoJSON(geoJson.features, {
        pointToLayer: function (geoJsonPoint, latlng) {
            return L.circleMarker(latlng, { radius: markerSize(geoJsonPoint.properties.mag) });
        },

        style: function (geoJsonFeature) {
            return {
                fillColor: getColor(geoJsonFeature.properties.mag),
                fillOpacity: 0.7,
                weight: 0.1,
                color: 'black'
            }
        },

        onEachFeature: function (feature, layer) {
            layer.bindPopup(
                "<h4 style='text-align:center;'>" + new Date(feature.properties.time) +
                "</h4> <hr> <h5 style='text-align:center;'>" + feature.properties.title + "</h5>");
        }
    }).addTo(earthquakes);
    createMap(earthquakes);
});



function getColor(magnitude) {
    if (magnitude > 7) {
        return '#FF0000'
    }
    else if (magnitude>6){
        return '#FF8000'
    }
    else if (magnitude>5.5){
        return'#F7FE2E'
    }
    else if (magnitude>5){
        return '#BFFF00'
    }
    else if (magnitude> 4.5){
        return '#00FF00'
    }
    else {return '#0B610B'}
}

function createMap() {
    var streetMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoibXN0aWVnIiwiYSI6ImNqd3ZpejB2eTAwamY0YW96MDVyN2EwbW0ifQ.oLv9gdKZXZDYwlF-zXCWnA'
    });




    var mymap = L.map('mymap', {
        center: [30, -90],
        zoom: 3,
        layers: [streetMap, earthquakes]
    });


    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            magnitude = [0, 4.5, 5, 5.5, 6, 7]
            labels = [];

        div.innerHTML += "<h4 style='margin:4px'>Magnitude</h4>"

        // for (var i = 0; i < magnitude.length; i++) {
        //     div.innerHTML +=
        //         '<i style="background:' + getColor(magnitude[i]) + '"></i> ' 
        //         + magnitude[i] + (magnitude[i + 1] ? '&ndash;' + magnitude[i + 1] + '<br>' : '+');
        // }
        for (var i = 0; i < magnitude.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(magnitude[i]+.1) + '"></i> ' +
                + magnitude[i] + (magnitude[i+1] ? '&ndash;' + magnitude[i+1] + '<br>' : '+');
            }

        return div;
    };
    legend.addTo(mymap);
}
