Ember.Checkbox.reopen({
  attributeBindings: ['data-size','data-on-text','data-off-text']
});

App.BootstrapSwitchComponent  = Ember.Component.extend({
  classNames: ['switch'],
  classNameBindings: ['size'],

  size: "mini",
  onText: 'yes',
  offText: 'no',
  status: false,
  disabled: false,
  label: "set the name",

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