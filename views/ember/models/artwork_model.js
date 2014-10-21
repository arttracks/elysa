App.Artwork = DS.Model.extend({
  title: DS.attr('string'),
  artist: DS.attr('string'),
  creationDateEarliest: DS.attr('date'),
  creationDateLatest: DS.attr('date'),
  provenance: DS.attr('string')
});