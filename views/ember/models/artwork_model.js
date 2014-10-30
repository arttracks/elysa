App.Artwork = DS.Model.extend({
  periods: DS.hasMany('period'),
  title: DS.attr('string'),
  artist: DS.attr('string'),
  creationDateEarliest: DS.attr('date'),
  creationDateLatest: DS.attr('date'),
  provenance: DS.attr('string'),
  
  sortedPeriods: function() {
    return this.get('periods').sortBy("order")
  }.property("periods.@each.order"),

  footnotes_updated: function(){}.property('periods.@each.footnote'),
  
  timeline_data: function() {
    return this.get('periods').sortBy("order").map(function(item){return item})
  }.property('periods.@each.party','periods.@each.active','periods.@each.order'),

  serializedPeriods: function() {
    return {period: this.get('periods').sortBy("order").map(function(item){
              var data =  item.serialize()
              data.id = item.get("id");
              return data;
            }
    )};
  }.property().volatile()

});