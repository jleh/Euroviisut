import * as Handlebars from 'handlebars';
import * as L from 'leaflet';
import $ from 'jquery';
import { find, orderBy } from 'lodash';

const colors = ['#013808', '#0D4711', '#1D561C', '#2E6627', '#407535', '#538543',
                '#689453', '#7FA465', '#96B378', '#B0C18C', '#CBD0A2', '#E7DEBA'];

const countryData = {
    Armenia: 'am',
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
    'Malta': 'mt'
};

const map = L.map('map').setView([51.505, 12], 3);

let countryLayer;
let points = {};

Handlebars.registerHelper('countryCode', (name) => countryData[name]);

map.attributionControl.setPrefix('');
$('.australia-color').click(showAusPoints);

$.getJSON('points.json', function(data) {
    points = data;
});

$.getJSON('europe.json', setCountryData);

function setCountryData(res) {
    const data = res;

    countryLayer = L.geoJson(data, {
        style: {
            weight: 1,
            opacity: 0.8,
            fillOpacity: 0.1
        },
        onEachFeature(feature, layer) {
            const name = feature.properties.admin;

            layer.on('click', () => showPoints(name));
        }
    }).addTo(map);
}

function pointStyle(layer, name, pointList) {
    // Selected country
    if (layer.properties.admin === name) {
        return {
            fillOpacity: 0.6
        };
    }

    const point = find(pointList, { country: layer.properties.admin });

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

function setAusColor(pointList) {
    const aus = find(pointList, { country: 'Australia' });

    if (aus) {
        $('.australia-color').css('background-color', colors[12 - aus.points]);
    } else {
        $('.australia-color').css('background-color', '#fff');
    }
}

function showAusPoints() {
    showPoints('Australia');
}

function showPoints(countryName) {
    const template = Handlebars.compile($('#modal-template').html());
    const juryPoints = orderBy(points[countryName].juryPoints, 'points', 'desc');
    const televotePoints = orderBy(points[countryName].televotePoints, 'points', 'desc');

    $('#points-data').html(template({ countryName, juryPoints, televotePoints }));

    const pointList = ($('.point-type:checked').val() === 'televote') ? televotePoints : juryPoints;

    setAusColor(pointList);

    countryLayer.setStyle((layer) => pointStyle(layer, countryName, pointList));

    $('.point-type').change(() => {
        const list = ($('.point-type:checked').val() === 'televote') ? televotePoints : juryPoints;

        if ($('.point-type:checked').val() === 'televote') {
            $('.televote-table .point-color').show();
            $('.jury-table .point-color').hide();
        } else {
            $('.televote-table .point-color').hide();
            $('.jury-table .point-color').show();
        }

        countryLayer.setStyle((layer) => pointStyle(layer, countryName, list));

        setAusColor(list);
    });
}
