App.PeriodController = Ember.ObjectController.extend({
  needs: ['artwork'],

  actions: {
     refreshData: function() {
      var self = this;
      var data = {period: this.get('artwork.periods').map(function(item){return item.serialize()})};
      Ember.$.post('/rebuild_structure', data)
      .then(function(data){
        data.period.forEach(function(element,index) {
          element.id = element.order;
          element.artwork = self.get('artwork.id');
        });
        self.get('artwork').store.pushPayload('period', data);
      });
    },
  },


  showExtendedBinding: Ember.Binding.oneWay("controllers.artwork.showExtended")
});