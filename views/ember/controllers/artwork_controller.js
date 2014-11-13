App.ArtworkController = Ember.ObjectController.extend(Ember.Evented, {
  showExtended: false,

  actions: {
    resizeNav: function() {
      this.notifyPropertyChange('navHeight');
    },
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
      this.store.find("period",id).then(function(party){
        var isCurrent = party.get('active');
        var onSuccess = function(){
          self.send('rebuildStructure')
          if(isCurrent) {
            var firstId = self.get('periods').objectAt(0).get('id');
            self.transitionTo("period",firstId)
          }
          self.notifyPropertyChange('navHeight');
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

  navHeight: function() {
    var h =  $('#party-list').height() || 310;
    return Math.max(h,310);
  }.property("periods.@each.updated"),

  // Computed property for artwork display
  creation_label: function(){
    var earliest = this.get("creation_earliest").getFullYear();
    var latest = this.get("creation_latest").getFullYear();
    if (earliest == latest) {
      return "[" + earliest + "]";
    }
    else {
      return "[" + earliest + " - " + latest + "]"
    }
  }.property("creation_latest","creation_earliest")
});
