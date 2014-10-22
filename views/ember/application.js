window.App = Ember.Application.create({
    LOG_TRANSITIONS: true
});

// App.EpochTransform = DS.Transform.extend({
//   deserialize: function(serialized) {
//     return  moment.utc(serialized*1000);
//   },
//   serialize: function(deserialized) {
//     return deserialized.getTime()/1000;
//   }
// });





// MAP STUFFF

App.TileLayer = EmberLeaflet.TileLayer.extend({
    tileUrl:
      'http://{s}.tiles.mapbox.com/v3' +
      '/{key}/' +
      '{z}/{x}/{y}.png',
    options: {key: 'workergnome.jpfo7j72', styleId: 997}
});

App.ProvenanceMapView = EmberLeaflet.MapView.extend({
  center: L.latLng(40.713282, -74.006978),
  options: {
    zoomControl: false,
    attributionControl: false,
    maxZoom: 4,
    minZoom: 4},
  childLayers: [App.TileLayer]
});

