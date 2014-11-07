App.ArtworkController = Ember.ObjectController.extend(Ember.Evented, {
  showExtended: false,

  actions: {
    gotoParty: function(id) {
      this.transitionToRoute('period',id);
    },
    reorderParties: function(indexes) {
      this.beginPropertyChanges();
      this.get("periods").forEach(function(item) {
        var index = indexes[item.get('id')];
        item.set('order', index);
      }, this);
      this.endPropertyChanges();
      this.send('rebuildStructure');
    },
  
    deleteParty: function(id) {
      var self = this;
      console.log("deleting id",id)
      this.store.find("period",id).then(function(party){
        console.log("parrty",party);
        var isCurrent = party.get('active');
        var onSuccess = function(){
          self.send('rebuildStructure')
          if(isCurrent) {
            var firstId = self.get('periods').objectAt(0).get('id');
            self.transitionTo("period",firstId)
          }
        }
        var onFail = function(e) {
          console.log("Error",e);
        }
        party.destroyRecord().then(onSuccess,onFail);
      });
    },
    
    toggle_extended: function() {
      var current_state = this.get('showExtended');
      this.set('showExtended',!current_state);
    }
  },

  // Computed property for artwork display
  creation_label: function(){
    var earliest = this.get("creationDateEarliest").getFullYear();
    var latest = this.get("creationDateLatest").getFullYear();
    if (earliest == latest) {
      return "[" + earliest + "]";
    }
    else {
      return "[" + earliest + " - " + latest + "]"
    }
  }.property("creationDateLatest","creationDateEarliest")
});
