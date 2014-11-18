App.ArtworksController = Ember.ObjectController.extend(App.HelpText, {
  needs: 'artwork',
  query: "",
  resultLength: 0,
  searching: false,
  results: [],
  currentPage: 1,

  actions: {
    gotoPage: function(page) {
      this.set("currentPage",page);
      return false;
    }
  },

  searchResults: function() {
    Ember.run.debounce(this, "actuallySearch", 200);
  }.observes('query','currentPage'),
  
  actuallySearch: function() {
    var q = this.get('query');
    if (q=="") {
      this.set('searching',false);
      return;
    }
    var self = this;
    this.set('searching',true);
    Ember.$.getJSON("/search",{query: q, page: (this.get('currentPage')) }).then(function(data) {
      self.set('resultLength',data.hits.total);
      self.set('results',data.hits.hits)
    });
  }
});