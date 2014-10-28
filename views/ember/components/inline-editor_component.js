App.InlineEditorComponent = Ember.Component.extend({
  tagName: 'span',
  isEditing: false,
  singleLine: false,

  actions: {
    beginEditing: function() {
      this.set('isEditing', true);
    },
    
    endEditing: function(val) {
      this.set("val",val);
      this.set('isEditing',false);
      this.sendAction("action", val);
    } 
  },

  labelRowClass: function() {
    return this.get('singleLine') ? "col-sm-2" : "col-sm-4"
  }.property('singleLine'),

  fieldRowClass: function() {
    return this.get('singleLine')  ? "col-sm-10" : "col-sm-8"
  }.property('singleLine'),


});

App.InlineInputComponent = Ember.TextField.extend({
  action: 'endEditing',
  targetObject: Em.computed.alias('parentView'),  
  init: function() {
    this._super();
    var value = (this.get("val"));
    this.set("value", value);
  },
  becomeFocused: function() {
   this.$().focus();
  }.on('didInsertElement'),

  focusOut: function() {
    this.sendAction('action',this.get('value'));
  },
  insertNewline: function() {
    this.sendAction('action',this.get('value'));
  },
});