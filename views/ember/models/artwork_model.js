App.Artwork = DS.Model.extend({
  periods: DS.hasMany('period'),
  title: DS.attr('string'),
  artist: DS.attr('string'),
  creation_earliest: DS.attr('date'),
  creation_latest: DS.attr('date'),
  provenance: DS.attr('string'),
  images: DS.attr('raw'),
  
  hasImage: function() {
    return this.get('images').length;
  }.property('images'),

  firstImage: function() {
    return this.get('images')[0]
  }.property("images"),

  sortedPeriods: function() {
    return this.get('periods').sortBy("order")
  }.property("periods.@each.order"),

  footnotes_updated: function(){}.property('periods.@each.footnote'),
  
  timeline_data: function() {
    return this.get('sortedPeriods').map(function(item){return item})
  }.property('periods.@each.party','periods.@each.active','periods.@each.order'),

  serializedPeriods: function() {
    return {period: this.get('sortedPeriods').map(function(item){
              var data =  item.serialize()
              data.id = item.get("id");
              return data;
            }
    )};
  }.property().volatile()
});