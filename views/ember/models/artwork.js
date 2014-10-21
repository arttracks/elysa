App.Artwork = DS.Model.extend({
  title: DS.attr('string'),
  artist: DS.attr('string'),
  creationDate: DS.attr('date'),
  provenance: DS.attr('string')
});