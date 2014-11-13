App.HelpLabelComponent  = Ember.Component.extend({
  size: "col-sm-4",

  didInsertElement: function() {
    var c = this.get("help");
    if (c) {
      var options = {
        content: c.text,
        title: this.get("label"),
        trigger: "focus",
        placement: (c.side || "auto"),
        html: true,
        delay: {hide: 50},
        container: 'body'
      }
      var self = $(this.get('element'));
      var el = self.find('.inline-editor-label');
      el.popover(options)
      self.find(".help").on("click",function() {
        return false
      });
    }
  }
})