App.PartyListNavComponent  = Ember.Component.extend({
  actions: {
    deleteParty: function(id){
      this.sendAction("delete",id);
    }
  },

  handleReorder: function(indices) {
    console.log('indices',indices);
    this.sendAction('reorder',indices);
    this.rerender();
  },

  didInsertElement: function() {

    self = this;
    Ember.$("#party-list").sortable({
      update: function(event, ui) {
        var indexes = {};

        $(this).find('li').each(function(index) {
          indexes[$(this).attr('id')] = index;
        });

        $(this).sortable('cancel');
        self.handleReorder(indexes);
      }
    });
  },
});