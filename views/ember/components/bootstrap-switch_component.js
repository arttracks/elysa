Ember.Checkbox.reopen({
  attributeBindings: ['data-size','data-on-text','data-off-text']
});

App.BootstrapSwitchComponent  = Ember.Component.extend({
  classNames: ['switch'],
  classNameBindings: ['size'],

  size: "mini",
  singleLine: false,
  smallCol: false,
  onText: 'yes',
  offText: 'no',
  status: false,
  disabled: false,
  label: "set the name",


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

  handleChange: function() {
    var status = this.get('status');
    this.set('disabled',(status === undefined));
    this.$('input').bootstrapSwitch('state', status, true);
    this.$('input').bootstrapSwitch('disabled',(status === undefined));
  }.observes('status'),

  didInsertElement: function () {
    var self = this;
    var name = this.get('label');
    var $obj = this.$("input[name='"+name+"']")

    $obj.bootstrapSwitch();
    $obj.on('switchChange.bootstrapSwitch', function(event, state) {
      self.set('status',state);
      self.sendAction();
    });
  }
});