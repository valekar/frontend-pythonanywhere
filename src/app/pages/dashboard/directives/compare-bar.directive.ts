import { Directive,Input } from '@angular/core';
import * as d3 from 'd3/index';
import {CorrectiveNess,Value} from '../../models/sentiment';
@Directive({
  selector: '[compare-bar]'
})
export class CompareBarDirective {


  @Input('data') data: CorrectiveNess = null;
  @Input('id') id:string = "";
  constructor() { }

  ngOnChanges(): void {
    if (this.data != null) {
      this.buildMyBarGraph(this.data);
    }
  }

  buildMyBarGraph(correctiveNess:CorrectiveNess){
    let host = d3.select(this.id);
    let margin = { top: 20, right: 20, bottom: 30, left: 40 },
      width = 300 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    host.html('');
    let svg = host.append('svg')
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
      "translate(" + margin.left + "," + (margin.top - 20) + ")");

    let x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);

    let y = d3.scaleLinear()
      .range([height, 0]);

    // Scale the range of the data in the domains

    x.domain(correctiveNess.data.map((d) => { return d.name; }));
    y.domain([0, d3.max(correctiveNess.data, (d) => { return d.value; })]);

    svg.selectAll(".bar")
      .data(correctiveNess.data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function (d) { return x(d.name); })
      .attr("width", x.bandwidth())
      .attr("fill", "steelblue")
      .attr("y", function (d) { return y(d.value); })
      .attr("height", function (d) { return height - y(d.value); });


    // add the x Axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
      .call(d3.axisLeft(y));

  }
  
}
