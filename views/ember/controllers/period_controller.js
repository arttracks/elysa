App.PeriodController = Ember.ObjectController.extend({
  needs: ['artwork'],
  showExtendedBinding: Ember.Binding.oneWay("controllers.artwork.showExtended")
});