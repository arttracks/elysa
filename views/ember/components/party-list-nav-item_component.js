App.PartyListNavItemComponent  = Ember.Component.extend({
  actions: {
    delete: function(id){
      this.sendAction("delete",id);
    }
  },
  doubleClick: function() {
    this.sendAction('open');
  }
});