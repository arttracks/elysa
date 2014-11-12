App.DynamicSelectView = Ember.Select.extend({
  change: function (event) {
    this._super(event);
    this.get('controller').send('handleChange');
  }
});

App.AcquisitionMethodComponent  = Ember.Component.extend({
  acq_methods: ["Bequest", "By descent", "By descent through", "Sale", "Purchase", "Purchase via Agent", "Acquisition", "Auction", "Exchange", "Gift, by exchange", "Bequest, by exchange", "Gift", "Conversion", "Looting", "Forced Sale", "Restitution", "Transfer", "Commission", "Field Collection", "With", "For Sale", "In Sale", "As Agent"],
  label: "Acq. Method",
  actions: {
    handleChange: function() {
      this.sendAction();
    },
  },
});