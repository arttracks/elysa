App.Period = DS.Model.extend({
  artwork:            DS.belongsTo('artwork'),
  order:              DS.attr("number"),
  period_certainty:   DS.attr('boolean', {defaultValue: true}),
  acquisition_method: DS.attr('string'),
  party:              DS.attr('string'),
  party_certainty:    DS.attr('boolean', {defaultValue: true}),
  birth:              DS.attr('epoch'),
  birth_certainty:    DS.attr('boolean', {defaultValue: true}),
  death:              DS.attr('epoch'),
  death_certainty:    DS.attr('boolean', {defaultValue: true}),
  location:           DS.attr('string'),
  location_certainty: DS.attr('boolean', {defaultValue: true}),
  botb:               DS.attr('epoch'),
  botb_certainty:     DS.attr('boolean', {defaultValue: true}),
  botb_precision:     DS.attr('number'),
  eotb:               DS.attr('epoch'),
  eotb_certainty:     DS.attr('boolean', {defaultValue: true}),
  eotb_precision:     DS.attr('number'),
  bote:               DS.attr('epoch'),
  bote_certainty:     DS.attr('boolean', {defaultValue: true}),
  bote_precision:     DS.attr('number'),
  eote:               DS.attr('epoch'),
  eote_certainty:     DS.attr('boolean', {defaultValue: true}),
  eote_precision:     DS.attr('number'),
  original_text:      DS.attr('string'),
  provenance:         DS.attr('string'),
  parsable:           DS.attr('boolean'),
  direct_transfer:    DS.attr('string'),
  stock_number:       DS.attr('string'),
  footnote:           DS.attr('string'),
  earliest_possible:  DS.attr('epoch'),
  latest_possible:    DS.attr('epoch'),
  earliest_definite:  DS.attr('epoch'),
  latest_definite:    DS.attr('epoch'),
  acquisition_time_span: DS.attr("string"),
  deacquisition_time_span: DS.attr("string"),

  active: false,

  deacquisition_string: function(key,value,previousValue) {
    if (arguments.length > 1) {
      if (value == "") {
        this.set('deacquisition_time_span',null);
        return "";
      }
    }
    return this.get('deacquisition_time_span');
  }.property('deacquisition_time_span'),

  birth_year: function(key, value, previousValue) {

    if (arguments.length > 1) {
      if (value == "") {
        this.set('birth',null);
        return "";
      }
      var d =  moment(value, "YYYY")
      if (d.isValid) {
        this.set('birth',d);
      }
    }
    
    var val = this.get('birth');
    if(val) return val.format("YYYY");
  }.property('birth'),

  death_year: function(key, value, previousValue) {

    if (arguments.length > 1) {
      if (value == "") {
        this.set('death',null);
        return "";
      }
      var d =  moment(value+"-12-31")
      if (d.isValid) {
        this.set('death',d);
      }
      else {
      }
    }
    var val = this.get('death');
    if(val) return val.format("YYYY");
  }.property('death'),

  computed_earliest_possible: function() {
    var e = this.get("earliest_possible");
    var c = this.get("artwork.creationDateEarliest");
    return e ? Math.max(e,c) : c;
  }.property("earliest_possible","artwork.creationDateEarliest"),

  footnote_number: function() {
    this.get("artwork.footnotes_updated");
    var footnoteCount = 0;
    var myVal = null;
    var self = this;
    var periods = this.get("artwork.periods");
    periods.forEach(function(val) {
      var footnote = val.get("footnote");
      if (footnote && footnote != "") {
        footnoteCount++;
        if (val.get("id") == self.get("id")) {
          myVal = footnoteCount;
        }
      }
    });
    return myVal;
  }.property("artwork.footnotes_updated"),

  provenance_with_footnote: function() {
    var val = ""
    var footnote = this.get("footnote");

    val += this.get("provenance");
    if (footnote && footnote != "") {
      val += " [" +this.get("footnote_number") + "]";
    }
    return val
  }.property("provenance","footnote_number", "footnote"),
});