import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
import React, { useRef, useEffect, useState } from "react";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import mapboxgl from "mapbox-gl";
mapboxgl.accessToken =
  "pk.eyJ1IjoiZ3VtbWllciIsImEiOiJjbWFpMWVmZDUwZ25pMm1zN2phd3NoOGx6In0.kPnfIx6921tXR28r5K-GSQ";
function StaticMap({ lat, lng }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markerRef = useRef(null);
  useEffect(() => {
    if (map.current) return; // initialize only once

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat], // Bangkok as example
      zoom: 5,
    });
    new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map.current);
    // Add geocoder search control
    const geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
      marker: false,
    });
    map.current.addControl(geocoder);
  }, []);
  return (
    <div
      ref={mapContainer}
      className="w-[350px] h-full rounded-md shadow-md sticky top-0 bg-white"
    />
  );
}

export default StaticMap;
