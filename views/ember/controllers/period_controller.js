App.PeriodController = Ember.ObjectController.extend({
  needs: ['artwork'],
  actions: {
    updateDate: function(val) {
      var self = this;
      this.model.rollback();
      Ember.$.post('/parse_timestring', {str: val})
        .then(function(data){
          self.model.set('botb',moment.unix(data.botb))
          self.model.set('eotb',moment.unix(data.eotb))
          self.model.set('botb_precision',data.botb_precision)
          self.model.set('eotb_precision',data.eotb_precision)
          self.model.set('bote',moment.unix(data.bote))
          self.model.set('eote',moment.unix(data.eote)) 
          self.model.set('bote_precision',data.bote_precision)
          self.model.set('eote_precision',data.eote_precision)          
          self.send('rebuildStructure');
        });
    },
  },

  showExtendedBinding: Ember.Binding.oneWay("controllers.artwork.showExtended")
});