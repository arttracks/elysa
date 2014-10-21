App.ProvenanceTimelineComponent = Ember.Component.extend({
  tagName: 'svg',
  attributeBindings: 'width height'.w(),
  margin: {top: 20, right: 20, bottom: 30, left: 40},  
  width: 1200,
  elementHeight: 30,

  dateCreated: function() {
    return this.get('periods.artwork.creationDateEarliest') ;
  }.property("periods.artwork.creationDateEarliest"),

  height: function() {
    return  this.get('period_data').length * this.get("elementHeight");
  }.property("periods"),

  w: function(){
    return this.get('width') - this.get('margin.left') - this.get('margin.right');
  }.property('width'),
  
  h: function(){
    return this.get('height') - this.get('margin.top') - this.get('margin.bottom');
  }.property('height'),  

  period_data: function() {
    return this.get('periods').map(function(item){return item});
  }.property("periods.@each.party"),

  didInsertElement: function(){
    this.draw();
  },

  current_active: function() {
    var active_period = this.find(function(item){item.get("active")});
    return active_period.get("order");
  }.property("periods.@each.active"),

  transformG: function(){
    return "translate(" + this.get('margin.left') + "," + this.get('margin.top') + ")";
  }.property(),

  transformX: function(){
    return "translate(0,"+ this.get('h') +")";
  }.property("h"),  

  periodChanged: function() {
    this.draw();
  }.observes('period_data'),

  
   draw: function(){

    var svg = d3.select('#'+this.get('elementId'));
    var data = this.get('period_data');
   
    var width = this.get('w');
    var height = this.get('h');
   
    var y = d3.scale.ordinal().rangeRoundBands([height,0], 0.1);;
    y.domain(data.map(function(d) { return d.get('order'); }));

    var x = d3.time.scale().rangeRound([0,width],0.1);
    x.domain([this.get('dateCreated'),Date.now()]);
    x.nice(d3.time.year);

   var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(10);
   svg.select(".axis.x").call(xAxis);


    var periods = svg.select(".periods").selectAll("g").data(data)
      .enter().append("g")
    periods.append("rect")
      .attr("class", "possible_bounds")
      .attr("height", y.rangeBand()/2)
      .attr("width", function(d) {
        return x(d.get("computed_latest_possible")) - x(d.get("computed_earliest_possible"));
      })
      .attr("y", function(d) { return y(d.get("order")) + y.rangeBand()/2; })  
      .attr("x", function(d) { 
        return x(d.get("computed_earliest_possible")); 
      })  

    periods.append("rect")
      .attr("class", "definite_bounds")
      .attr("height", y.rangeBand()/2)
      .attr("width", function(d) {
        return x(d.get("computed_latest_definite")) - x(d.get("computed_earliest_definite"));
      })
      .attr("y", function(d) { return y(d.get("order")) + y.rangeBand()/2; })  
      .attr("x", function(d) { 
        return x(d.get("computed_earliest_definite")); 
      })        

    periods.append('text')
        .attr("class", function(d) {return d.get("active") ? "active" : "";})
        .attr("y", function(d) { return y(d.get("order")); }) 
        .attr("dy", "1em") 
        .attr("x", function(d) { 
          return x(d.get("computed_earliest_possible")); 
        })  
      .text(function(d){return d.get("party") + " - " + d.get("active")});
  },  
});