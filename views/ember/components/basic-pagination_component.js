App.BasicPaginationComponent  = Ember.Component.extend({
  itemsPerPage: 10,
  maxBoxes: 10,
  actions: {
    gotoPage: function(p) {
      this.sendAction("action",p);
    },
    gotoPrev: function() {
      if (!this.get('onFirstPage')) {
        this.sendAction('action',this.get('current')-1);
      }
    },
    gotoNext: function() {
      if (!this.get('onLastPage')) {
        this.sendAction('action',this.get('current')+1);
      }
    }
  },

  onFirstPage: function() {
    return this.get('current') == 1; 
  }.property('current'),

  onLastPage: function() {
    return (this.get('current') == this.get('lastPage') || this.get("lastPage") == undefined);
  }.property('lastPage','current'),

  lastPage: function() {
    var t = this.get('total');
    var ipp = this.get("itemsPerPage");
    val =  Math.ceil(t/ipp);
    if (val >1 ) return val;
  }.property('total','itemsPerPage'),

  pages: function() {
    var l = this.get('total');
    var c = this.get('current');
    var ipp = this.get("itemsPerPage");
    var m = this.get('maxBoxes');
    pages = []
    while (l > 0) {
      var val = Math.ceil(l/ipp);
      pages.push({pageNumber: val, isCurrent: (c === val), placeholder: false});
      l = l - ipp;
    }
    pages = pages.reverse();
    if (pages.length <= m) {
      return pages;
    } else {
      var truncatedPages = [];
      var onEitherSide = Math.floor(m/2);
      var pageNum;
      truncatedPages.push(pages[c-1]);
      for (var q1 = 1; q1 < onEitherSide; q1++) {
         pageNum = c-q1
         if(pageNum >= 1){
           truncatedPages.unshift(pages[pageNum-1])       
         } 
       }
       if (pageNum > 2) {
        truncatedPages.unshift({placeholder: true});
       }
       if (pageNum > 1) {
        truncatedPages.unshift(pages[0]);
       }
       // following boxes
       pageNum = c;
       var last = this.get('lastPage');

       while (truncatedPages.length < m+1 && pageNum < last) {
         pageNum = pageNum+1;
         truncatedPages.push(pages[pageNum-1])    
       }
       if (pageNum+1 < last) {
        truncatedPages.push({placeholder: true});
       }
       if ((pageNum) < last) {
        truncatedPages.push(pages[last-1]);
       }
      return truncatedPages;
    }

  }.property('total','current','itemsPerPage', 'maxBoxes'),

  gotoFirstOnNewSearch: function() {
    this.sendAction("action",1);
  }.observes('total')
})