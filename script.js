var map = L.map('map').setView([51.505, 12], 3);
var points = {};
var colors = ['#013808','#0D4711','#1D561C','#2E6627','#407535','#538543','#689453','#7FA465','#96B378','#B0C18C','#CBD0A2','#E7DEBA'];
var countryLayer;

$.getJSON('points.json', function(data) {
    points = data;
});

$.getJSON('europe.json', function(data) {
    countryLayer = L.geoJson(data, {
        style: {
            weight: 1,
            opacity: 0.8,
            fillOpacity: 0.1
        },
        onEachFeature: function(feature, layer) {
            var name = feature.properties.admin;
            var template = Handlebars.compile($('#modal-template').html());

            layer.on('click', function() {
                var juryPoints = _.orderBy(points[name].juryPoints, 'points', 'desc');
                var televotePoints = _.orderBy(points[name].televotePoints, 'points', 'desc');

                $('#points-data').html(template({
                    countryName: name,
                    juryPoints: juryPoints,
                    televotePoints: televotePoints
                }));

                var pointList = ($('.point-type:checked').val() === 'televote') ? televotePoints : juryPoints;

                countryLayer.setStyle(function(layer) {
                    return pointStyle(layer, name, pointList);
                });

                $('.point-type').change(function() {
                    var pointList = ($('.point-type:checked').val() === 'televote') ? televotePoints : juryPoints;

                    if ($('.point-type:checked').val() === 'televote') {
                        $('.televote-table .point-color').show();
                        $('.jury-table .point-color').hide();
                    } else {
                        $('.televote-table .point-color').hide();
                        $('.jury-table .point-color').show();
                    }

                    countryLayer.setStyle(function(layer) {
                        return pointStyle(layer, name, pointList);
                    });
                });
            });
        }
    }).addTo(map);
});

function pointStyle(layer, name, pointList) {
    // Selected country
    if (layer.properties.admin == name) {
        return {
            fillOpacity: 0.6
        };
    }

    var point = _.find(pointList, { country: layer.properties.admin });

    if (point) {
        return {
            fillColor: colors[12 - point.points],
            fillOpacity: 1
        };
    }

    // Default
    return {
        fillOpacity: 0.1,
        fillColor: '#03f'
    };
}
