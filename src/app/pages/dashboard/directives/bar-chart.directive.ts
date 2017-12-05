import { Directive, Input, OnChanges } from '@angular/core';
import { ResponseTime, Companies, Company } from '../../models/sentiment';
import * as d3 from 'd3/index';
import { Selection } from 'd3-selection';

@Directive({
  selector: '[bar-chart]'
})
export class BarChartDirective implements OnChanges {

  @Input('responseTime') responseTime: ResponseTime = null;
  constructor() { }

  ngOnChanges(): void {
    if (this.responseTime != null) {
      this.buildMyBarGraph(this.responseTime);
    }
  }


  buildMyBarGraph(data: ResponseTime) {
    //console.log(data);
    let companies = new Companies();
    let company1 = new Company();
    company1.name = "Google";
    company1.responseTime = data.Google;

    let company2 = new Company();
    company2.name = "Azure";
    company2.responseTime = data.Azure;

    let company3 = new Company();
    company3.name = "Watson";
    company3.responseTime = data.Watson;

    let company4 = new Company;
    company4.name = "NLTK";
    company4.responseTime = data.NLTK;

    companies.data = new Array<Company>();
    companies.data.push(company1);
    companies.data.push(company2);
    companies.data.push(company3);
    companies.data.push(company4);

    //console.log(companies);

    let host = d3.select('#barId');
    let margin = { top: 20, right: 20, bottom: 30, left: 40 },
      width = 500 - margin.left - margin.right,
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

    x.domain(companies.data.map((d) => { return d.name; }));
    y.domain([0, d3.max(companies.data, (d) => { return d.responseTime; })]);

    svg.selectAll(".bar")
      .data(companies.data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function (d) { return x(d.name); })
      .attr("width", x.bandwidth())
      .attr("fill", "steelblue")
      .attr("y", function (d) { return y(d.responseTime); })
      .attr("height", function (d) { return height - y(d.responseTime); });


    // add the x Axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
      .call(d3.axisLeft(y));

  }


}
