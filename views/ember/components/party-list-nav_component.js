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
    },
    toggle_transfer: function(id) {
      var p = this.get('periods').findBy('id',id)
      p.toggleProperty('direct_transfer');
    }
  },

  handleReorder: function(indices) {
    this.sendAction('reorder',indices);
    this.rerender();
  },

  gotoNext: function() {
    var current = $('.list-group .active');
    current.next().find('a').trigger("click");
    return false;
  },

  gotoPrev: function() {
    var current = $('.list-group .active');
    current.prev().find('a').trigger("click");
    return false;
  },

  didInsertElement: function() {
    var self = this;
    this.sendAction('initNav');

    Mousetrap.bind('command+down', this.gotoNext);
    Mousetrap.bind('command+up', this.gotoPrev);

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