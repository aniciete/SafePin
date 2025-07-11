// map.controller.js
import { MapController } from '../components/map.js';
import { getReportsInBounds } from './firebase-reports.js';
import { MarkerClusterer } from '@googlemaps/markerclusterer';

let mapController;
let markerClusterer;

export async function initMap() {
    mapController = new MapController('map');
    const map = await mapController.initMap({
        center: { lat: 14.5995, lng: 121.0364 }, // Metro Manila
        zoom: 12,
    });

    markerClusterer = new MarkerClusterer({ map });

    map.addListener('idle', () => {
        loadReportsOnMap();
    });
}

export async function loadReportsOnMap() {
    const bounds = mapController.getMap().getBounds();
    const reports = await getReportsInBounds(bounds);

    mapController.clearMarkers();
    markerClusterer.clearMarkers();

    const markers = reports.map(report => {
        const marker = mapController.addMarker({
            position: { lat: report.location.latitude, lng: report.location.longitude },
            title: `${report.incidentType} Incident`,
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `<b>${report.incidentType} Incident</b><br>Status: ${report.status}`
        });

        marker.addListener('click', () => {
            infoWindow.open(mapController.getMap(), marker);
        });

        return marker;
    });

    markerClusterer.addMarkers(markers);
}