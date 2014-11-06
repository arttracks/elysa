App.ProvenanceTimelineComponent = Ember.Component.extend({
  tagName: 'svg',
  attributeBindings: 'width height class'.w(),
  margin: {top: 20, right: 20, bottom: 30, left: 40},  
  width: 1200,
  elementHeight: 28,
  class: "timeline-svg",

  height: function() {
    return  this.get('timeline_data').length * this.get("elementHeight") +  this.get('margin.top') + this.get('margin.bottom');
  }.property('timeline_data'),

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

  resizeMe: function() {
    var w = parseInt(d3.select('#'+this.get('elementId')).style("width"));
    console.log("resizeMe",w);
    this.set("width",w);
    this.draw();
  },
  didInsertElement: function(){
//    this.draw();
    $(window).on("resize", $.proxy(this.resizeMe,this));
    this.resizeMe();
  },

  periodChanged: function() {
    this.draw();
  }.observes('timeline_data'),

  draw: function(){
    var self = this;
    var svg = d3.select('#'+this.get('elementId'));
    var creationDate = self.get('creationDate');
    var data = this.get('timeline_data').map(function(el){
      var id = el.get('id');
      var d = el.serialize();
      d.id = id;
      d.active = el.get("active");
      d.earliest_definite = moment.unix(d.earliest_definite);
      if (d.earliest_possible) {
        d.earliest_possible = Math.max(moment.unix(d.earliest_possible),creationDate);
      }
      else {
        d.earliest_possible = creationDate;
      }
      d.latest_possible = moment.unix(d.latest_possible);
      d.latest_definite = moment.unix(d.latest_definite);
      if (d.birth) d.birth = moment.unix(d.birth);
      if (d.death) d.death = moment.unix(d.death);
      d.party = el.get("partyName");
      return d;
    });
    var key = function(d) { 
      return d.id + "-" + d.order;
    };

    var width = this.get('w');
    var height = this.get('h');
   
    // Set Y scales
    var y = d3.scale.ordinal().rangeRoundBands([height,0], 0.1);;
    y.domain(data.map(function(d) { return +d.order; }));

    // Set X scales
    var x = d3.time.scale().rangeRound([0,width],0.1);
    x.domain([creationDate,Date.now()]);
    x.nice(d3.time.year);

    // Setup X Axis
    var xAxis = d3.svg.axis().scale(x).orient("bottom").ticks(10);
    svg.select(".axis.x").call(xAxis);

    // Draw the creation date
    svg.select(".creation-line")
      .attr("x1",x(creationDate)-.5)
      .attr('x2',x(creationDate)-.5)
      .attr('y1',height)
      .attr('y2',0)


    var elements = svg.select(".periods").selectAll("g").data(data,key)
    // Build new elements 
    var creates = elements.enter().append("g");
     creates.append("rect") // Create possible bar
      .attr("class", "possible_bounds")
    creates.append('polyline') // create lifespan bar
      .attr("class", 'lifespan')
  creates.append('polyline') // create lifespan bar for alive people
      .attr("class", 'lifespan-nodeath')
    creates.append("rect") // Create definite bar
      .attr("class", "definite_bounds")
    creates.append("rect")  // Create Start bar
      .attr("class", "start_of_definite")
      .attr("width", 1)
    creates.append("rect")  // Create End bar
      .attr("class", "end_of_definite")
      .attr("width", 1)
    creates.append('text') // Create label
      .attr("dy", ".75em") 

    elements.exit().remove()
  
    // Update all elements
    
   

    elements.selectAll(".lifespan").data(data,key)
      .attr("transform", function(d){
        if (!d.birth) return ""
        str  = "translate(" 
        str += (x(d.birth)+.5) + ","
        str += (y(+d.order)+ y.rangeBand()/2 + .5) + ")"
        return str;
      })
      .attr("points", function(d) {
        if (!d.birth) return ""
        var p = ""
        var len =  x(d.death) - x(d.birth);
        return p + "0,5 0,-5 0,0 " + len + ",0 " + len +",5 " + len + ",-5";
      })

      elements.selectAll(".lifespan-nodeath").data(data,key)
        .attr("transform", function(d){
          if (!d.birth) return ""
          if (d.death) return ""
          str  = "translate(" 
          str += (x(d.birth)+.5) + ","
          str += (y(+d.order)+ y.rangeBand()/2 + .5) + ")"
          return str;
        })
        .attr("points", function(d) {
          if (!d.birth) return ""
          if (d.death) return ""
          var p = ""
          var len =  x(Date.now()) - x(d.birth);
          return p + "0,0 " + len + ",0";
        })

    // update definite range
    elements.selectAll(".definite_bounds").data(data,key)
      .attr("height", y.rangeBand()/2)
      .attr("y", function(d) { return y(+d.order) + y.rangeBand()/2; })  
      .transition()
        .attr("width", function(d) {
          var val =  x(d.latest_definite) - x(d.earliest_definite);
          return Math.abs(val) || 0;
        })
        .attr("x", function(d) {  return x( Math.min(d.earliest_definite,d.latest_definite)) || -1000 ;})   

    // update possible range
    elements.selectAll(".possible_bounds").data(data,key)
      .attr("y", function(d) { return y(+d.order) + y.rangeBand()/2; })  
      .attr("height", y.rangeBand()/2)
      .transition()
        .attr("width", function(d) {
          var val = (x(d.latest_possible) - x(d.earliest_possible));
          return Math.abs(val) || 0;
        })
        .attr("x", function(d) { return x(d.earliest_possible); })

    // update start bars
    elements.selectAll(".start_of_definite").data(data,key)
      .attr("y", function(d) { return y(+d.order) + y.rangeBand()/2 -1; })  
      .attr("height", y.rangeBand()/2 + 2)
      .transition()
        .attr("x", function(d) { return x(d.earliest_definite) || -1000; })

    // update end bars
    elements.selectAll(".end_of_definite").data(data,key)
      .attr("height", y.rangeBand()/2 + 2)
      .attr("y", function(d) { return y(+d.order) + y.rangeBand()/2 -1; })  
      .transition()
        .attr("x", function(d) { return x(d.latest_definite) || -1000;   })

    //Update text on change
    elements.selectAll("text").data(data,key)
      .attr("y", function(d) {return y(+d.order) }) 
      .attr("class", function(d) {return d.active ? "active" : "";})
      .text(function(d){return d.party})
      .transition()
        .attr("x", function(d) { return x(d.earliest_possible);})  

  },  
});