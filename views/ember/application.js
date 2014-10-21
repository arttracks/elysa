window.App = Ember.Application.create({
    LOG_TRANSITIONS: true
});

App.ArtworksController = Ember.ArrayController.extend({});


App.ProvenanceController = Ember.ObjectController.extend({
  provenance: "Possibly Mme. J. van Gogh-Bonger, Amsterdam; Possibly Mme. Maria Slavona, Paris; Possibly Paul Cassirer Art Gallery, Berlin; Harry Graf von Kessler, Berlin and Weimar, by 1901 until at least 1929 [1]; Reid and Lefevre Art Gallery, London, by 1939 until at least 1941; E. Bignou Art Gallery, New York, NY; Mr. and Mrs. Marshall Field, New York, NY, by 1939 until at least 1958 [2]; Galerie Beyeler, Basel, Switzerland; purchased by Museum, October 1968. NOTES: 1. probably 1897 to likely Fall 1931. 2. Referenced several times between 1939 and 1958.",
});

App.TimelineController = Ember.ArrayController.extend({
  showExtended: false,
  dateCreated: new Date(1890,1,1),
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
  active: false,
  computed_latest_definite: function() {
    return date = new Date(this.get("latest_definite")*1000);
  }.property('latest_definite'),

  computed_earliest_definite: function() {
    return date = new Date(this.get("earliest_definite")*1000);
  }.property('earliest_definite'),

  computed_latest_possible: function() {
    return date = new Date(this.get("latest_possible")*1000);
  }.property('latest_possible'),
  computed_earliest_possible: function() {
    var date;
    if (this.get("earliest_possible")) {
      date = new Date(this.get("earliest_possible")*1000);
    }
    else if (!this.parentController) {
      date = null;
    }
    else {
     date = this.parentController.get("dateCreated");
    }
    return date;
  }.property('earliest_possible'),

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

