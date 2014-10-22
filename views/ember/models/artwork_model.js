App.Artwork = DS.Model.extend({
  periods: DS.hasMany('period'),
  title: DS.attr('string'),
  artist: DS.attr('string'),
  creationDateEarliest: DS.attr('date'),
  creationDateLatest: DS.attr('date'),
  provenance: DS.attr('string'),
  footnotes_updated: function(){}.property('periods.@each.footnote'),
  timeline_data: function() {
    return this.get('periods').map(function(item){return item})
  }.property('periods.@each.party')
});