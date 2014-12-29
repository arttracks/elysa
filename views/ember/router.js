App.Router.map(function() {
  this.resource("artworks"),
  this.resource("artwork", {path: 'artworks/:artwork_id'}, function() {
    this.resource("period", { path: '/:period_id' });      
  });
});

App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('artworks');
  }
});

App.ArtworksRoute = Ember.Route.extend({});

App.PeriodRoute = Ember.Route.extend({
  actions: {
    willTransition: function(transition) {
      this.controller.trigger("routeChange");
    },
  },
  model: function(params) {
    if (this.store.hasRecordForId('period',params.period_id)){
      return this.store.find('period', params.period_id)
    }
    return null;
  },
  afterModel: function(period, transition) {
   if (period == null) {
    this.transitionTo("artwork");
   }
   else {
     transition.send("setActivePeriod",period);
   }
  }
})

App.ArtworkRoute = Ember.Route.extend({
  actions: {
    openPrimary: function() {
      this.controllerFor('period').trigger("openPrimary");
    },
    addParty: function() {
      var self = this;
      var data = this.modelFor('artwork').get('serializedPeriods');
      var artwork = this.modelFor('artwork');
      data.artwork_id = artwork.get("id");
      Ember.$.post('/add_party', data)
      .then(function(results){
        self.send('reconstructData',results);
        Ember.run.later(function(){
          self.gotoFirstRecord(artwork);
          Ember.run.later(function() {
            self.controllerFor('artwork').notifyPropertyChange('navHeight');
          });
        })
      });
    },

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
    var self = this;
    return new Ember.RSVP.Promise(function(resolve, reject) {
      Ember.$.post('/get_structure', {provenance: artwork.get('provenance')})
        .then(function(data){
          transition.send('reconstructData',data);
          resolve();
        });
    }).then(function() {
      if (artwork.get('periods.length')) {
        $(document).attr('title', "Elysa: " + artwork.get('title'));
        self.transitionTo('period', artwork.get('sortedPeriods.firstObject'));
      }
    });
  },
  gotoFirstRecord: function(artwork) {
      var p = artwork.get('sortedPeriods').objectAt(0);
      if (p) {
        var id = p.get('id');
        this.transitionTo("period",id);
      }
    }
});
