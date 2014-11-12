App.PeriodController = Ember.ObjectController.extend( Ember.Evented, {
  needs: ['artwork'],

  name_help: {
    text:  "<p>This is the name of the person, institution, marriage, or gallery involved during this period.</p><p>Abbreviations and clauses in the name need to be on a white list: <i>Dr. Marvin Gaye</i>, or <i>James Dean, his son</i> will work, but others may not.</p><p>Avoid using parentheses in the name.</p>"
  },
  period_certainty_help: {
    text: "<p>This will toggle <strong>Possibly</strong> at the beginning of the record.</p><hr class='compact'/><p>Set this to <strong>no</strong> to indicate that you believe that the text is correct, but are not entirely certain or cannot find documentation to verify this.</p><p>If you are only uncertain about portions of the record such as the name or location, use the individual certanty switches in the Extended Fields.</p>"
  },
  birth_year_help: {
    text: "<p>This is the year the individual was born.  If the party is an organization, this is the year it was founded; if it is a marriage, it's the year the marriage began.</p>"
  },
  death_year_help: {
    text: "<p>This is the year the individual died.  If the party is an organization, this is the year it was dissolved; if it is a marriage, it's the year the marriage ended, or one of the parties died.</p><p>If the individual is still alive, or the organization still in operation, leave this blank.</p>"
  },
  location_help: {
    text: "<p>This is the location of the party during the period of acquisition.  Be as specific as possible—but there's no need to be overly specific if you don't know.</p><p><strong>Paris</strong> is an valid entry, as are <strong>England</strong> and <strong>New York, NY</strong>.</p>"
  },
  aqcuisition_help: {
    text: "<p>This is the method of acquisition for this particular period. Changing this will add a clause to the party's name.</p><p>For example, choosing <strong>By Descent</strong> will change the record to from<br/><i>\"Jane Eyre, in 1850\"</i> in to <br/><i>\"By descent to Jane Eyre, in 1850\"</i></p><hr class='compact'/><p>For complete details see the <a target='_blank' href='/docs/acquisitions/methods/'>Acqusition Methods</a> section of the documentation</p>"
  },
  current_text_help: {
    text: "This is the current text of the provenance record.  Editing this field will re-calculate all of the fields below, allowing quick updates to all of the data."
  },
  original_text_help: {
    text: "<p>This is the text of the provenance record as originally written. It is for comparison and cannot be edited.</p> <p>It will only appear if there is a difference between the current text and this text.</p>"
  },

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
          // Normalize the data
          var p = self.store.normalize('period',data.period[0])
          p.id = id
          // Save fields that you want to update
          var orig = self.model.get('original_text');
          var dt = self.model.get('direct_transfer');
          var foot = self.model.get('footnote');
          var order = self.model.get('order');

          self.store.push('period',p);

          // Re-load fields that you want to update
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
          self.model.set('updated',true);     
          self.send('rebuildStructure');
        });
    },
  },

  showExtendedBinding: Ember.Binding.oneWay("controllers.artwork.showExtended")
});