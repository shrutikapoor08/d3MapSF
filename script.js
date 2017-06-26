(function init() {
  var svg;
  var projection;
  renderSFMap()
    .then(svg => renderRoutes(svg));
}());

function renderSFMap() {
  return new Promise((resolve, reject) => {
    const width = 900;
    const height = 750;
    const offset = [width / 1.9, height / 1.3];
    projection = d3.geoMercator()
      .scale(160000)
      .translate(offset)
      .center([-122.43, 37.75]);

    svg = d3.select('body')
      .append('svg')
      .attr('height', height)
      .attr('width', width);

    const path = d3.geoPath().projection(projection);
    d3.selectAll('path').attr('d', path);

    d3.json('sfmaps/neighborhoods.json', (json) => {
      svg.append('g')
        .attr('id', 'neighborhoods')
        .selectAll('path')
        .data(json.features)
        .enter()
        .append('path')
        .attr('id', d => d.properties.neighborho)
        .attr('d', path);
      resolve(svg); // return SVG
    });
  });
}

function renderRoutes(svg) {
  const xhr = new XMLHttpRequest();
  const url = 'http://webservices.nextbus.com/service/publicJSONFeed?command=routeConfig&a=sf-muni&r=N';
  xhr.open('GET', url);
  xhr.send();
  xhr.onload = function() {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200) {
        let stops = xhr.response;
        stops = JSON.parse(stops).route.stop;

        const g = svg.insert('g', '#neighborhoods + *')
          .attr('id', 'stops');
        const circles = g.selectAll('circle')
          .data(stops)
          .enter()
          .append('circle');

        const circleAttributes = circles
          .attr('cx', d => projection([d.lon, d.lat])[0])
          .attr('cy', d => projection([d.lon, d.lat])[1])
          .attr('r', 3)
          .style('fill', 'red');
      }
    }
  };
}
