App.PartyListNavComponent  = Ember.Component.extend(App.HelpText, {
  classNames: "col-md-3",
  
  actions: {
    open: function() {
      this.sendAction('open');
    },
    delete: function(id){
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
    this.sendAction('initNav');
    Ember.$("#party-list").sortable({
      containment: "parent",
      tolerance: "pointer",
      axis: "y",
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