App.Router.map(function() {
  this.resource("artworks");
  this.resource("artwork", {path: 'artworks/:artwork_id'}, function() {
    this.resource("timeline", function() {
      this.resource("period", { path: '/:period_id' });      
    });
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
  afterModel: function() {
    this.transitionTo('timeline')
  }
});

App.TimelineRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('period',0);
  },
  model: function() {
    var prov = this.modelFor('artwork').get('provenance');
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.post('/get_structure', {provenance: prov}).then(function(data){
        resolve(data.period)
      });
    });
  }
});

App.PeriodRoute = Ember.Route.extend({
  model: function(params) {
    return this.modelFor('timeline').objectAt(params.period_id);
  }
});