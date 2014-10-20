data = [4, 8, 15, 16, 23, 42]
width = 420
barHeight = 20

x = d3.scale.linear()
  .domain [0, d3.max(data)]
  .range [0, width] 

datatype_modifier = (d) ->
  d.value = +d.value
  return d

$ ->
  chart = d3.select(".chart")
    .attr "width", width 

  d3.tsv "data/data.tsv", datatype_modifier, (error, data) ->
    x.domain [0, d3.max(data, (d) -> d.value)]

    chart.attr "height", barHeight * data.length

    bar = chart.selectAll("g") 
      .data(data)
      .enter().append("g")
      .attr "transform", (d, i)->  "translate(0," + i * barHeight + ")"

    bar.append("rect")
      .attr "width", (d) -> x(d.value)
      .attr "height", barHeight - 1

    bar.append("text")
      .attr "x", (d) -> x(d.value) - 3
      .attr "y", barHeight / 2
      .attr "dy", ".35em"
      .text((d) -> d.value)