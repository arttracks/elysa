window.App = Ember.Application.create({
    LOG_TRANSITIONS: true
});

App.TimelineController = Ember.ArrayController.extend({
  needs: 'artwork',
  showExtended: false,
  artwork: Ember.computed.alias("controllers.artwork"),
  itemController: 'period',
  actions: {
    toggle_extended: function() {
      var current_state = this.get('showExtended');
      this.set('showExtended',!current_state);
    }
  }
});

App.ArtworkController = Ember.ObjectController.extend({
  creation: function(){
    var earliest = this.get("creationDateEarliest").getFullYear();
    var latest = this.get("creationDateLatest").getFullYear();
    if (earliest == latest) return "(" + earliest + ")"
    return "(" + earliest + " - " + latest + ")"
  }.property("creationDateLatest","creationDateEarliest")
})

App.PeriodController = Ember.ObjectController.extend({
  needs: ['timeline'],
  active: false,
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

