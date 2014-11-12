App.HelpLabelComponent  = Ember.Component.extend({
  size: "col-sm-4",

  didInsertElement: function() {
    var c = this.get("help");
    if (c) {
      var options = {
        content: c.text,
        title: this.get("label"),
        trigger: "manual",
        placement: "auto",
        html: true,
      }
      var self = $(this.get('element'));
      console.log("self:",self)
      var el = self.find('.inline-editor-label');
      el.popover(options)
      self.find(".help").on("mouseover",function() {
        el.popover('show');
      })
      self.find(".help").on("mouseout", function() {
        el.popover('hide');
      })
    }
  }
})