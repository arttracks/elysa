App.ArtworksController = Ember.ObjectController.extend(App.HelpText, {
  needs: 'artwork',
  query: "",
  resultLength: 0,
  searching: false,
  results: [],
  currentPage: 1,

  availablePages: function() {
    var l = this.get('resultLength');
    var c = this.get('currentPage');
    pages = []
    while (l > 0) {
      var val = Math.ceil(l/10);
      pages.push({pageNumber: val, isCurrent: (c === val)});
      l = l - 10;
    }
    return pages.reverse()
  }.property('resultLength','currentPage'),

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