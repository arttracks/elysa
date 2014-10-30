App.PartyListNavComponent  = Ember.Component.extend({
  actions: {
    deleteParty: function(id){
      this.sendAction("delete",id);
    },
    addParty: function() {
      this.sendAction('add');  
    }
  },

  handleReorder: function(indices) {
    this.sendAction('reorder',indices);
    this.rerender();
  },

  didInsertElement: function() {
    var self = this;
    Ember.$("#party-list").sortable({
      containment: "parent",
      tolerance: "pointer",
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