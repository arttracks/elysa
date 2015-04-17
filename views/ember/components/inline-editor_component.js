App.InlineEditorComponent = Ember.Component.extend({
  tagName: 'span',
  isEditing: false,
  singleLine: false,
  smallCol: false,
  primary: false,
 
  init: function() {
    this._super();
    
    this.get('targetObject').on("routeChange", $.proxy(function(){
      this.set('isEditing', false)
    },this));

    if (this.get('primary')) {
      this.get('targetObject').on("openPrimary",$.proxy(function(){
        this.set('isEditing', true)
      },this));
    }
  },

  actions: {
    beginEditing: function() {
      this.set('isEditing', true);
    },
    
    endEditing: function(val) {
      this.set('isEditing',false);
      if (val !== undefined) {
        this.set("val",val);
        this.sendAction("action", val);
      }
    },
  },

  labelRowClass: function() {
    if (this.get('singleLine')) {
      return  "col-sm-2"
    }
    else if( this.get('smallCol')) {
      return "col-sm-6"
    }
    else{
      return "col-sm-4"
    }
  }.property('singleLine', 'smallCol'),

  fieldRowClass: function() {
    if( this.get('singleLine')) {
      return "col-sm-10"
    }
    else if( this.get('smallCol')) {
      return "col-sm-6"
    }
    else{
      return "col-sm-8"
    }
  }.property('singleLine', 'smallCol'),

  displayText: function() {
    var dval = this.get("displayVal");
    if (dval !== undefined) {
      return dval; 
    }
    else {
      return this.get("val");
    }
  }.property('displayVal', 'val'),
});

App.InlineInputComponent = Ember.TextField.extend({
  action: 'endEditing',
  targetObject: Em.computed.alias('parentView'),  
  previousVal: "",
  init: function() {
    this._super();
    var value = (this.get("val"));
    this.set("value", value);
    this.set("previousVal", value);
  },
  becomeFocused: function() {
   this.$().focus();
  }.on('didInsertElement'),

  focusOut: function() {
    this.completeEditing();
  },
  insertNewline: function(e) {
    this.completeEditing();
  },
  cancel: function() {
    this.set('value',this.get('previousVal'));
    this.completeEditing();
  },
  completeEditing: function() {
    var val = this.get('value');
    var prev = this.get('previousVal');
    if (val != prev && !(val === "" && prev === undefined)){
      this.set("previousVal", val);
      this.sendAction('action',val);
    }
    else {
      this.sendAction('action');
    }
  }
});