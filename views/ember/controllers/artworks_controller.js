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
    var self = this;
    this.set('searching',true);
    Ember.$.getJSON("/search",{query: this.get('query'), page: (this.get('currentPage')) }).then(function(data) {
      console.log('data', data);
      console.log(data.hits.total);
      self.set('resultLength',data.hits.total);
      self.set('results',data.hits.hits)
    });
  }.observes('query','currentPage')
});