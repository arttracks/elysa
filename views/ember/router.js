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

App.PeriodRoute = Ember.Route.extend({
  afterModel: function(period, transition) {
    transition.send("setActivePeriod",period);
  }
})

App.ArtworkRoute = Ember.Route.extend({
  actions: {
    rebuildStructure: function() {
      Ember.run.once(this, function() {
        var self = this;
        var data = this.modelFor('artwork').get('serializedPeriods');
        Ember.$.post('/rebuild_structure', data)
        .then(function(results){
          self.send('reconstructData',results);
        });
      });
    },

    reconstructData: function(data) {
      var artwork = this.modelFor('artwork').get('id');
      data.period.forEach(function(element,index) {
        if (!element.id) {element.id = element.order + "-" + artwork};
        element.artwork = artwork;
      });
      this.store.pushPayload('period', data);
      this.controllerFor('artwork').set("isRefreshed",true);
    },
    setActivePeriod: function(period) {
      var periods = this.modelFor('artwork').get('periods');
      periods.forEach(function(element) {
        element.set("active",false);
      })
      period.set("active",true);
    }
  },

  model: function(params) {
    return this.store.find('artwork', params.artwork_id);
  },

  afterModel: function(artwork, transition) {
    self = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.post('/get_structure', {provenance: artwork.get('provenance')})
        .then(function(data){
          transition.send('reconstructData',data);
          resolve();
        });
    }).then(function() {
      var id = artwork.get('periods').objectAt(0).get('id');
      self.transitionTo("period",id);
    });
  }
});
