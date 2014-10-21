window.App = Ember.Application.create({
    LOG_TRANSITIONS: true
});


App.ArtworkController = Ember.ObjectController.extend({});

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

