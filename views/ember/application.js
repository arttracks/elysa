window.App = Ember.Application.create({
    LOG_TRANSITIONS: true
});

App.Router.reopen({
  location: 'history'
});

App.ApplicationAdapter = DS.RESTAdapter.extend({
  namespace: 'api/1'
});

App.RawTransform = DS.Transform.extend({
    deserialize: function(serialized) {
        return serialized;
    },  
    serialize: function(deserialized) {
        return deserialized;
    }   
});

App.DefaultTrueBooleanTransform = DS.Transform.extend({
    deserialize: function(serialized) {
    var type = typeof serialized;

    if (type === "boolean") {
      return serialized;
    } else if (type === "string") {
      return serialized.match(/^true$|^t$|^1$/i) !== null;
    } else if (type === "number") {
      return serialized === 1;
    } else {
      return true;
    }
  },
  serialize: function(deserialized) {
    return Boolean(deserialized);
  }
});

App.JsonTransform = DS.Transform.extend({
    deserialize: function(serialized) {
        return JSON.parse(serialized);
    },  
    serialize: function(deserialized) {
        return deserialized.to_json();
    }   
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

