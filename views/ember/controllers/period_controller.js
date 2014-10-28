App.PeriodController = Ember.ObjectController.extend({
  needs: ['artwork'],

  actions: {
    refreshData: function() {
      Ember.run.once(this, 'rebuildStructure');
    },
    updateDate: function(val, field) {
      console.log("val",val, field);
    },
  },

  rebuildStructure: function() {
    var self = this;
    var data = this.get('artwork.serializedPeriods');
    Ember.$.post('/rebuild_structure', data)
    .then(function(results){
      self.send('reconstructData',results);
    });
  },

  showExtendedBinding: Ember.Binding.oneWay("controllers.artwork.showExtended")
});