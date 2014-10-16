window.App = Ember.Application.create({
    LOG_TRANSITIONS: true
});

App.ProvenanceController = Ember.ObjectController.extend({
  provenance: "Possibly Mme. J. van Gogh-Bonger, Amsterdam; Possibly Mme. Maria Slavona, Paris; Possibly Paul Cassirer Art Gallery, Berlin; Harry Graf von Kessler, Berlin and Weimar, by 1901 until at least 1929 [1]; Reid and Lefevre Art Gallery, London, by 1939 until at least 1941; E. Bignou Art Gallery, New York, NY; Mr. and Mrs. Marshall Field, New York, NY, by 1939 until at least 1958 [2]; Galerie Beyeler, Basel, Switzerland; purchased by Museum, October 1968. NOTES: 1. probably 1897 to likely Fall 1931. 2. Referenced several times between 1939 and 1958.",
});

App.TimelineController = Ember.ArrayController.extend({
  showExtended: false,
  itemController: 'period',
  actions: {
    toggle_extended: function() {
      var current_state = this.get('showExtended');
      this.set('showExtended',!current_state);
    }
  }
});
App.PeriodController = Ember.ObjectController.extend({
  needs: ['timeline'],
  showExtendedBinding: Ember.Binding.oneWay("controllers.timeline.showExtended")
});


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

// App.Timeline = DS.Model.extend({
//   party        : DS.attr(),
//   order        : DS.attr(),
//   location     : DS.attr(),
//   birth        : DS.attr(),
//   death        : DS.attr(),
//   stock_number : DS.attr(),
//   parsable:
// });