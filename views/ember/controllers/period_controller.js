App.PeriodController = Ember.ObjectController.extend( Ember.Evented, {
  needs: ['artwork'],
  actions: {

    updateRecord: function(val) {
      this.model.set('updated',true);
      this.send("rebuildStructure");
    },
    updateProvenance: function(val) {
      this.model.rollback();
      var self = this;
      var id = this.model.get('id');
      Ember.$.post('/parse_provenance_line', {str: val})
        .then(function(data){
          var p = data.period[0]
          p = self.store.normalize('period',p)
          console.log('data',p);
          var orig = self.model.get('original_text');
          var dt = self.model.get('direct_transfer');
          var foot = self.model.get('footnote');
          var order = self.model.get('order');
          p.id = id
          self.store.push('period',p);
          self.model.set('original_text',orig);
          self.model.set('direct_transfer',dt);
          self.model.set('footnote',foot);
          self.model.set('order',order);
          self.model.set('updated', true);
          self.send('rebuildStructure');
        });     
    },
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