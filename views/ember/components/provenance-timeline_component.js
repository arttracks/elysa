App.ProvenanceTimelineComponent = Ember.Component.extend({
  tagName: 'svg',
  attributeBindings: 'width height'.w(),
  margin: {top: 20, right: 20, bottom: 30, left: 40},  
  width: 1200,
  elementHeight: 28,

  height: function() {
    return  this.get('timeline_data').length * this.get("elementHeight") +  this.get('margin.top') + this.get('margin.bottom');
  }.property(),

  w: function(){
    return this.get('width') - this.get('margin.left') - this.get('margin.right');
  }.property('width'),
  
  h: function(){
    return this.get('height') - this.get('margin.top') - this.get('margin.bottom');
  }.property('height'),  

  transformG: function(){
    return "translate(" + this.get('margin.left') + "," + this.get('margin.top') + ")";
  }.property(),

  transformX: function(){
    return "translate(0,"+ this.get('h') +")";
  }.property("h"),  

  didInsertElement: function(){
    this.draw();
  },

  periodChanged: function() {
    this.draw();
  }.observes('timeline_data'),

  draw: function(){

    var svg = d3.select('#'+this.get('elementId'));
    var data = this.get('timeline_data');

    var width = this.get('w');
    var height = this.get('h');
   
    // Set Y scales
    var y = d3.scale.ordinal().rangeRoundBands([height,0], 0.1);;
    y.domain(data.map(function(d) { return +d.get('order'); }));

    // Set X scales
    var x = d3.time.scale().rangeRound([0,width],0.1);
    x.domain([this.get('creationDate'),Date.now()]);
    x.nice(d3.time.year);

    // Setup X Axis
    var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(10);
    svg.select(".axis.x").call(xAxis);


    // Build new elements 
    var creates = svg.select(".periods").selectAll("g").data(data)
      .enter().append("g");
     creates.append("rect") // Create possible bar
      .attr("class", "possible_bounds")
    creates.append('polyline') // create lifespan bar
      .attr("class", 'lifespan')
    creates.append("rect") // Create definite bar
      .attr("class", "definite_bounds")
    creates.append("rect")  // Create Start bar
      .attr("class", "start_of_definite")
      .attr("width", 1)
    creates.append("rect")  // Create End bar
      .attr("class", "end_of_definite")
      .attr("width", 1)
    creates.append('text') // Create label
      .attr("dy", "1em") 
  
    // Update all elements
    var updates = svg.select('.periods').data(data)
   

    updates.selectAll(".lifespan")
      .attr("transform", function(d){
        if (!d.get('birth')) return ""
        str  = "translate(" 
        str += (x(d.get('birth'))+.5) + ","
        str += (y(+d.get("order"))+ y.rangeBand()/2 + .5) + ")"
        return str;
      })
      .attr("points", function(d) {
        if (!d.get('birth')) return ""
        var p = ""
        var len =  x(d.get('death')) - x(d.get('birth'));
        return p + "0,5 0,-5 0,0 " + len + ",0 " + len +",5 " + len + ",-5";
      })

    // update definite range
    updates.selectAll(".definite_bounds")
      .attr("height", y.rangeBand()/2)
      .attr("width", function(d) {
        var val =  x(d.get("latest_definite")) - x(d.get("earliest_definite"));
        return Math.abs(val) || 0;
      })
      .attr("y", function(d) { return y(+d.get("order")) + y.rangeBand()/2; })  
      .attr("x", function(d) {  return x( Math.min(d.get("earliest_definite"),d.get("latest_definite"))) || -1000 ;})   

    // update possible range
    updates.selectAll(".possible_bounds")
      .attr("y", function(d) { return y(+d.get("order")) + y.rangeBand()/2; })  
      .attr("x", function(d) { return x(d.get("computed_earliest_possible")); })
      .attr("height", y.rangeBand()/2)
      .attr("width", function(d) {
        var val = (x(d.get("latest_possible")) - x(d.get("computed_earliest_possible")));
        return Math.abs(val) || 0;
      })

    // update start bars
    updates.selectAll(".start_of_definite")
      .attr("y", function(d) { return y(+d.get("order")) + y.rangeBand()/2 -1; })  
      .attr("x", function(d) { return x(d.get("earliest_definite")) || -1000; })
      .attr("height", y.rangeBand()/2 + 2)

    // update end bars
    updates.selectAll(".end_of_definite")
      .attr("height", y.rangeBand()/2 + 2)
      .attr("y", function(d) { return y(+d.get("order")) + y.rangeBand()/2 -1; })  
      .attr("x", function(d) { return x(d.get("latest_definite")) || -1000;   })

    //Update text on change
    updates.selectAll("text")
      .attr("y", function(d) {return y(+d.get("order")) }) 
      .attr("x", function(d) { return x(d.get("computed_earliest_possible"));})  
      .attr("class", function(d) {return d.get("active") ? "active" : "";})
      .text(function(d){return d.get("party")});
  },  
});