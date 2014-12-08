App.ProvenanceTimelineComponent = Ember.Component.extend({
  tagName: 'svg',
  attributeBindings: 'width height class'.w(),
  margin: {top: 20, right: 110, bottom: 30, left: 40},  
  width: 1200,
  elementHeight: 28,
  textSpacing: 200,
  class: "timeline-svg",

  height: function() {
    return  this.get('timeline_data').periods.length * this.get("elementHeight") +  this.get('margin.top') + this.get('margin.bottom') + this.get('textSpacing');
  }.property('timeline_data'),

  w: function(){
    return this.get('width') - this.get('margin.left') - this.get('margin.right');
  }.property('width'),
  
  h: function(){
    return this.get('height') - this.get('margin.top') - this.get('margin.bottom') - this.get('textSpacing');
  }.property('height'),  

  transformG: function(){
    return "translate(" + this.get('margin.left') + "," + this.get('margin.top') + ")";
  }.property(),

  transformX: function(){
    return "translate(0,"+ this.get('h') +")";
  }.property("h"),  

  resizeMe: function() {
    var w = parseInt(d3.select('#'+this.get('elementId')).style("width"));
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
    var data = this.get('timeline_data').periods.map(function(el){
      var id = el.get('id');
      var d = el.serialize();
      d.id = id;
      d.active = el.get("active");
      d.earliest_definite = moment.unix(d.earliest_definite);
      d.earliest_possible = el.get("computed_earliest_possible");     
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

    if (this.get('timeline_data').exhibitions) {
      var exhibit_data = this.get('timeline_data').exhibitions.map(function(el){
        var obj = {} 
        obj.commencement = moment(el.commencement);
        obj.completion = moment(el.completion);

        if (el.title) {
          obj.title = el.title.substr(0,40)
          if (el.title.length > 40) {obj.title += "...";}
        }
        else { 
          obj.title = "(untitled exhibition)"
        }
        obj.external = el.external;
        return obj;
      });
      var exhibit_key = function(d) {
        return d.title;
      }
    }
    

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


    if (this.get('timeline_data').exhibitions) {
    // Create exhibitons
    var exhibits = svg.select('.exhibitions').selectAll(".exhibition-holder").data(exhibit_data,exhibit_key);
    exhibits.exit().remove();

    var exhibits_create = exhibits.enter().append('g').attr('class',"exhibition-holder");

    exhibits_create.append('rect').attr("class","exhibition")
    exhibits_create.append('g').attr('class','exhibition-text-holder').append('text').attr("class","exhibition_text")


    exhibits.selectAll(".exhibition-text-holder")
      .attr('transform',function(d){
        return "translate("+x(d.commencement)+","+(height-y.rangeBand())+")" 
      })
   
    var texts = exhibits.selectAll(".exhibition_text")
        .text(function(d) {return d.title})
        .attr('transform',"rotate(45)")
        .attr('x',35)
        .attr('y',35)

    var overlaps = true;
    var spacing = 12;
    var offsetAmount = .5;
    var currentItem,currentItemD3,currentY,sampleY,sampleItemD3,sampleItem,deltaY;
    while(overlaps) {
      overlaps = false;
      texts.each(function(d,index) {
        currentItem = this;
        currentItemD3 = d3.select(currentItem);
        var ccc = (+x(d.commencement));
        currentY =  ccc - (+currentItemD3.attr('y'));
        texts.each(function(dd,index2) {
          var sss = (+x(dd.commencement));
          if (ccc < sss && Math.abs((ccc - sss)) <=spacing) {
            sampleItem = this;
            sampleItemD3 = d3.select(sampleItem);    
            sampleY = sss - (+sampleItemD3.attr("y"));

            deltaY = Math.abs(currentY - sampleY);
            if (Math.abs(deltaY) <= spacing) { 
              console.log(deltaY,d.title,dd.title)
              overlaps = true;
              currentItemD3.attr("y",+currentItemD3.attr('y') + .5);
              currentItemD3.attr("x",+currentItemD3.attr('x') - .5);
              sampleItemD3.attr("y", +sampleItemD3.attr('y')  - .5);
              sampleItemD3.attr("x", +sampleItemD3.attr('x')  + .5);
            }
          }
        });
      });
    }


    exhibits.selectAll(".exhibition")
      .attr("x",function(d){return x(d.commencement)})
      .attr("y",height)
      .attr("width", function(d) { 
        if (d.completion){
         return Math.max(x(d.completion) - x(d.commencement),2); 
        }
        else {
          return 2
        }
      })  
      .attr("height",6)
      .classed("external",function(d) {return d.external})
  }





    var elements = svg.select(".periods").selectAll("g").data(data,key)
    // Build new elements 
    var creates = elements.enter().append("g");
    creates.on("click", function (d, i) {
      self.sendAction('action',d.id);
    });

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
        .attr("x", function(d) { 
          var date = Math.min(d.earliest_definite,d.latest_definite);
          if (date == undefined) return -1000;
          return x(date);
        })   

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