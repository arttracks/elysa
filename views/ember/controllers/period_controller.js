App.PeriodController = Ember.ObjectController.extend({
  needs: ['artwork'],
  actions: {
    updateDate: function(val, field) {
      console.log("val",val, field);
    },
  },

  showExtendedBinding: Ember.Binding.oneWay("controllers.artwork.showExtended")
});