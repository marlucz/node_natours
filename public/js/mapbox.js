/* eslint-disable */

document.addEventListener('DOMContentLoaded', function() {
  const locations = JSON.parse(
    document.getElementById('map').dataset.locations
  );
  console.log(locations);

  mapboxgl.accessToken =
    'pk.eyJ1IjoiYnVrYWN6IiwiYSI6ImNrMGU5MTk2NjA0d2ozcHBsZGU4Z2Y4d2gifQ.dOvbuvm8OvaACvUMDkiY4w';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/bukacz/ck0e93vsg1gd61cn5qwr6ljq9',
    scrollZoom: false
    // center: [-118.113491, 34.111745],
    // zoom: 8,
    // interactive: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom'
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add popup
    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
});
