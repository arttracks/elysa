App.Artwork = DS.Model.extend({
  periods: DS.hasMany('period'),
  title: DS.attr('string'),
  artist: DS.attr('string'),
  creation_earliest: DS.attr('epoch'),
  creation_latest: DS.attr('epoch'),
  provenance: DS.attr('string'),
  images: DS.attr('raw'),
  exhibitions: DS.attr('string'),
  exhibition_details: DS.attr('json'),
  artist_details: DS.attr('json'),
  accession_number: DS.attr('string'),


  sorted_exhibition_details: function() {
    var e = this.get("exhibition_details");
    if (e){
      return e.sortBy("commencement") 
    }
  }.property(),

  hasImage: function() {
    i = this.get('images');
    return (i !== undefined);
  }.property('images'),

  firstImage: function() {
    if (this.get('hasImage')) {
      return this.get('images')[0]
    }
  }.property("images"),

  sortedPeriods: function() {
    return this.get('periods').sortBy("order")
  }.property("periods.@each.order"),

  footnotes_updated: function(){}.property('periods.@each.footnote'),
  
  timeline_data: function() {
    return {
      "periods": this.get('sortedPeriods').map(function(item){return item}),
      "exhibitions": this.get('sorted_exhibition_details')
    }
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