App.Router.map(function() {
  this.resource("provenance");
  this.resource("timeline", function() {
    this.resource("period", { path: '/:period_id' });      
  });
});

App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('provenance');
  }
});

App.ProvenanceRoute = Ember.Route.extend({})

App.TimelineRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('period',0);
  },
  model: function() {
    var prov = this.controllerFor('provenance').get('provenance')
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
})