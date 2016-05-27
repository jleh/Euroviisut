import * as L from 'leaflet';
import $ from 'jquery';
import { find } from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';

import { CountryPoints } from './components/CountryPoints.jsx';

const colors = ['#013808', '#0D4711', '#1D561C', '#2E6627', '#407535', '#538543',
                '#689453', '#7FA465', '#96B378', '#B0C18C', '#CBD0A2', '#E7DEBA'];


const pointView = ReactDOM.render(<CountryPoints setMapPoints={showPoints} />, document.getElementById('points-data'));
const map = L.map('map').setView([51.505, 12], 3);

let countryLayer;

map.attributionControl.setPrefix('');
$('.australia-color').click(showAusPoints);

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

            layer.on('click', () => pointView.showCountry(name));
           // layer.on('click', () => showPoints(name));
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

function showPoints(countryName, pointList) {
    setAusColor(pointList);
    countryLayer.setStyle((layer) => pointStyle(layer, countryName, pointList));
}
