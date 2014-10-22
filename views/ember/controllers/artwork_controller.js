App.ArtworkController = Ember.ObjectController.extend({
  showExtended: false,
  itemController: 'period',

  actions: {
    toggle_extended: function() {
      var current_state = this.get('showExtended');
      this.set('showExtended',!current_state);
    }
  },

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
