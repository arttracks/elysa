App.PrecisionSelectComponent  = Ember.Component.extend({
  precisions: Ember.A([
    {name: "Century", id: 0.25},
    {name: "Decade", id: 0.5},
    {name: "Year", id:1},
    {name: "Month", id:2},
    {name: "Day", id:3}
  ]),
  actions: {
    handleChange: function() {
      this.sendAction();
    },
  },
});