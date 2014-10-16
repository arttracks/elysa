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
  model: function() {
    var prov = this.controllerFor('provenance').get('provenance')
    return Ember.$.post('/get_structure', {provenance: prov}).then(function(data){
      return data.period;
    });
  }
});

App.PeriodRoute = Ember.Route.extend({
  model: function(params) {
    return this.controllerFor('timeline').objectAt(params.period_id);
  }
})