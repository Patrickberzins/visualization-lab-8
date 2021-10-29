d3.csv('driving.csv', d3.autoType).then(data=>{
    console.log('driving', data)

    const margin = ({top: 20, right: 20, bottom: 50, left: 50})

    const width = 850 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

    const svg = d3.select(".chart").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.miles))
    .nice()
    .range([0,width]) 

	const yScale = d3
    .scaleLinear()
    .domain(d3.extent(data, d => d.gas))
    .nice()
    .range([height,0]) 

    const xAxis = d3.axisBottom()
	.scale(xScale)
	.ticks(7, "s")

    const xAxisGrid = d3.axisBottom(xScale).tickSize(-height).tickFormat('').ticks(10);
    const yAxisGrid = d3.axisLeft(yScale).tickSize(-width).tickFormat('').ticks(10);   

	svg.append("g")
	.attr("class", "axis x-axis")
	.call(xAxis)
	.attr("transform", `translate(0, ${height})`)

	const yAxis = d3.axisLeft()
	.scale(yScale)
	.ticks(12, "s")

	svg.append("g")
	.attr("class", "axis y-axis")
	.call(yAxis)
	.attr("transform", `translate(0, 0)`)

    svg.append('g')
    .attr('class', 'x axis-grid')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxisGrid);
    
    svg.append('g')
    .attr('class', 'y axis-grid')
    .call(yAxisGrid);
    
	svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", height + 40)
    .text("Miles per person per year");

    svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", -50)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Cost Per Gallon in US Dollars");

    //-----> Adding Elements <-------

    svg.selectAll('circle')
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", d => xScale(d.miles))
    .attr("cy", d => yScale(d.gas))
    .attr("r", 6)
    .attr("fill", "white")
    .attr("stroke", "black")
    .attr("stroke-width", 1.5);

    svg.selectAll('label')
    .data(data)
    .enter()
    .append('text')
    .text(d=>d.year)
    .attr("x", d => xScale(d.miles))
    .attr("y", d => yScale(d.gas))
    .attr("font-size", 11)
    .each(position)
    .call(halo)

    function position(d) {
        const t = d3.select(this);
        switch (d.side) {
          case "top":
            t.attr("text-anchor", "middle").attr("dy", "-0.7em");
            break;
          case "right":
            t.attr("dx", "0.5em")
              .attr("dy", "0.32em")
              .attr("text-anchor", "start");
            break;
          case "bottom":
            t.attr("text-anchor", "middle").attr("dy", "1.4em");
            break;
          case "left":
            t.attr("dx", "-0.5em")
              .attr("dy", "0.32em")
              .attr("text-anchor", "end");
            break;
        }
      }

      function halo(text) {
        text
          .select(function() {
            return this.parentNode.insertBefore(this.cloneNode(true), this);
          })
          .attr("fill", "none")
          .attr("stroke", "white")
          .attr("stroke-width", 4)
          .attr("stroke-linejoin", "round");
      }

    d3.select('.x-axis domain').select(".domain").remove()
    d3.select('.y-axis domain').select(".domain").remove()

    const line = d3.line()
        .x(d => xScale(d.miles))
        .y(d => yScale(d.gas));

    const path = svg.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 4)
        .attr("d", line);

        svg.selectAll('circle').raise()


})