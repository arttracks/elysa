Ember.Handlebars.helper('yes_no', function(val) {
  if ( val === null || val === undefined || val === "") { return ""}
  else if (val)                                      { return "yes"}
  else                                               { return "no"}
});

Ember.Handlebars.helper('possibly', function(val) {
  if(val == null || val == undefined || val == "" || val == true) { return "" }
  return "Possibly";
});

Ember.Handlebars.helper('transfer_type', function(val) {
  if(val) { return ";" }
  return ".";
});
