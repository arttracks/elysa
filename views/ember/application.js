window.App = Ember.Application.create({
    LOG_TRANSITIONS: true
});




App.EpochTransform = DS.Transform.extend({
  deserialize: function(serialized) {
     if (serialized === undefined || serialized === null) {
      return undefined;
    }
    return  moment.utc(serialized*1000);
  },
  serialize: function(deserialized) {
    if (deserialized === undefined || deserialized === null) {
      return undefined;
    }
    if (deserialized.unix) { // for a Moment.js date
      var val =  deserialized.unix();
      return val == 0 ? undefined : (+val); 
      
    }
    if (deserialized.getTime) {  // for a standard date
      return deserialized.getTime()/1000;
    }
    else {
      console.log("deserialized", deserialized);
    }
  }
});





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

