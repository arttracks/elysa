App.Router.map(function() {
  this.resource("artworks");
  this.resource("artwork", {path: 'artworks/:artwork_id'}, function() {
    this.resource("period", { path: '/:period_id' });      
  });
});

App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('artworks');
  }
});

App.ArtworksRoute = Ember.Route.extend({
  model: function() {
    return this.store.find('artwork_list');
  }
});

App.ArtworkRoute = Ember.Route.extend({
  model: function(params) {
    return this.store.find('artwork', params.artwork_id);
  },
  afterModel: function(artwork) {
    var prov = artwork.get('provenance');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.post('/get_structure', {provenance: prov}).then(function(data){
        data.period.forEach(function(element,index) {
          element.id = element.order;
          element.artwork = artwork.get("id");
        });
        artwork.store.pushPayload('period', data);
        resolve(data.period)
      });
    }).then(this.transitionTo('period',0));
  }
});
