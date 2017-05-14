var $ = require('jquery');
var L = require('leaflet');
var _ = require('lodash');
var Handlebars = require('handlebars');

require('leaflet/dist/leaflet.css');
require('bootstrap/dist/css/bootstrap.css');
require('./css/app.css');

var points = {};
var colors = ['#013808','#0D4711','#1D561C','#2E6627','#407535','#538543',
              '#689453','#7FA465','#96B378','#B0C18C','#CBD0A2','#E7DEBA'];
var map;
var countryLayer;

var participants = [
"Albania", "Armenia", "Australia", "Austria",
"Azerbaijan", "Belarus", "Belgium", "Bulgaria", "Croatia", "Cyprus", 
"Czech Republic", 
"Denmark", "Estonia", "F.Y.R. Macedonia", "France", "Finland", "Georgia",
"Germany", "Greece", "Hungary", "Iceland", "Israel", "Italy", "Latvia",
"Lithuania", "Malta", "Moldova", "Montenegro", 
"Norway", "Poland", "Portugal", "Romania", "Spain", "Sweden", "Switzerland",
"The Netherlands", "Ukraine", "United Kingdom"
];

var countryData = {
    'Armenia': 'am',
    'Austria': 'at',
    'Australia': 'au',
    'Azerbaijan': 'az',
    'Belgium': 'be',
    'Bulgaria': 'bg',
    'Croatia': 'hr',
    'Cyprus': 'cy',
    'Czech Republic': 'cz',
    'Germany': 'de',
    'Spain': 'es',
    'France': 'fr',
    'United Kingdom': 'gb',
    'Georgia': 'ge',
    'Hungary': 'hu',
    'Israel': 'il',
    'Italy': 'it',
    'Lithuania': 'lt',
    'Latvia': 'lv',
    'The Netherlands': 'nl',
    'Poland': 'pl',
    'Serbia': 'sr',
    'Russia': 'ru',
    'Sweden': 'se',
    'Ukraine': 'ua',
    'Malta': 'mt',
    'Norway': 'no',
    'Moldova': 'md',
    'Denmark': 'dk',
    'Portugal': 'pt',
    'Romania': 'ro',
    'Greece': 'gr',
    'Belarus': 'by'
};

map = L.map('map', {
  zoomControl: false,
  zoomSnap: 0.1,
  zoomDelta: 0.3,
  doubleClickZoom: false,
  boxZoom: false
}).setView([51.505, 12], 3);

map.fitBounds([[71.5, 51.48], [21.95, -25.06]]);
map.attributionControl.setPrefix("");

$('.australia-color').click(showAusPoints);

var counrtyList = Handlebars.compile($('#dropdown').html());
$("#country-select").html(counrtyList({ country: participants }));
$("#country-select select").change(function() { showPoints($(this).val()); });


$.getJSON('points.json', function(data) {
    points = data;
});

$.getJSON('world.json', function(data) {
    var filtered = _.filter(data.features, function(feature) {
        return participants.indexOf(feature.properties.name) !== -1;
    });

    data.features = filtered;

    countryLayer = L.geoJson(data, {
        style: {
            weight: 1,
            opacity: 0.8,
            fillOpacity: 0.1
        },
        onEachFeature: function(feature, layer) {
            var name = feature.properties.name;

            layer.on('click', function() {
                showPoints(name);
            });
        }
    }).addTo(map);
});

function pointStyle(layer, name, pointList) {
    // Selected country
    if (layer.properties.name == name) {
        return {
            fillOpacity: 0.6
        };
    }

    var point = _.find(pointList, { country: layer.properties.name });

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

Handlebars.registerHelper('countryCode', function(name) {
    return countryData[name];
});

function setAusColor(pointList) {
    var aus = _.find(pointList, {country: 'Australia'});

    if (aus) {
        $('.australia-color').css('background-color', colors[12 - aus.points]);
    } else {
        $('.australia-color').css('background-color', '#fff');
    }
}

function showAusPoints() {
    showPoints('Australia');
}

function showPoints(name) {
    var template = Handlebars.compile($('#modal-template').html());
    var juryPoints = _.orderBy(points[name].juryPoints, 'points', 'desc');
    var televotePoints = _.orderBy(points[name].televotePoints, 'points', 'desc');

    $('#points-data').html(template({
        countryName: name,
        juryPoints: juryPoints,
        televotePoints: televotePoints,

    }));

    var pointList = ($('.point-type:checked').val() === 'televote') ? televotePoints : juryPoints;

    setAusColor(pointList);

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

        setAusColor(pointList);
    });
}
