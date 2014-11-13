App.PartyListNavItemComponent  = Ember.Component.extend({
  actions: {
    delete: function(id){
      this.sendAction("delete",id);
    },
    toggle_transfer: function(id) {
      this.sendAction('toggle_transfer',id);
    }

  },
  doubleClick: function() {
    this.sendAction('open');
  }
});