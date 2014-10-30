App.PeriodController = Ember.ObjectController.extend({
  needs: ['artwork'],

  actions: {
    refreshData: function() {
      this.send('rebuildStructure');
    },
    updateDate: function(val, field) {
      console.log("val",val, field);
    },
  },

  showExtendedBinding: Ember.Binding.oneWay("controllers.artwork.showExtended")
});