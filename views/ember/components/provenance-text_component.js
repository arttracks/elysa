App.ProvenanceTextComponent  = Ember.Component.extend({
  full_provenance: function() {
    var val = "";
    var notes = "";
    var periods = this.get("periods");
    for (var q1 = 0; q1 < periods.length; q1++) {
      var item = periods[q1];
      val += item.get('provenance_with_footnote');
      val += (item.get("direct_transfer") ? "; " : ". ");
      if (item.get("footnote")) {
        notes += item.get("footnote_number") +". " + item.get("footnote")
      }
    }
    if (notes != "") {
      notes = "\nNOTES:" + notes
    }
    return val + notes
  }.property("periods.@each.provenance_with_footnote","periods.@each.footnote", "periods.@each.direct_transfer"),
  didInsertElement: function() {
    self = this;
    var client = new ZeroClipboard($("#provenance-text-copy"));
    client.on( "copy", function (event) {
      var clipboard = event.clipboardData;
      var prov = self.get("full_provenance")
      clipboard.setData( "text/plain", prov);
    });
  },
});