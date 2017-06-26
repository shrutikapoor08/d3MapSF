(function init() {
  var svg;
  var projection;
  renderSFMap()
    .then(function(){
      renderVehicles();
      updateLocations();
      renderRoutes();
    });
}());

function renderSFMap() {
  return new Promise((resolve, reject) => {
    const width = 720;
    const height = 700;
    const offset = [width / 2, height / 2];

    //code snippet referenced from 3rd party
    projection = d3.geoMercator()
      .scale(160000)
      .translate(offset)
      .center([-122.43, 37.75]);
    //end 3rd party code snippet

    svg = d3.select('body')
      .append('svg')
      .attr('height', height)
      .attr('width', width)
      .attr('viewBox', "60 70 500 450");

    const path = d3.geoPath().projection(projection);
    d3.selectAll('path').attr('d', path);

    d3.json('sfmaps/neighborhoods.json', (neighborhoods) => {
      svg.append('g')
        .attr('id', 'neighborhoods')
        .selectAll('path')
        .data(neighborhoods.features)
        .enter()
        .append('path')
        .attr('id', d => d.properties.neighborho)
        .attr('d', path);
      resolve(svg); // return SVG
    });
  });
}

function renderVehicles(){
  const xhr = new XMLHttpRequest();
  const url = 'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni&r=N&t=1144953500233';
  xhr.open('GET', url);
  xhr.send();
  xhr.onload = function() {
    if (xhr.readyState === xhr.DONE) {
      if (xhr.status === 200) {
        let vehicles = xhr.response;
        vehicles = JSON.parse(vehicles).vehicle;

        const g = svg.insert('g', '#neighborhoods + *')
          .attr('id', 'vehicles');
        const circles = g.selectAll('circle')
          .data(vehicles)
          .enter()
          .append('circle');

        const circleAttributes = circles
          .attr('cx', data => projection([data.lon, data.lat])[0])
          .attr('cy', data => projection([data.lon, data.lat])[1])
          .attr('r', 4)
          .style('fill', 'yellow');
      }
    }
  }
};

function renderRoutes() {
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
          .attr('cx', data => projection([data.lon, data.lat])[0])
          .attr('cy', data => projection([data.lon, data.lat])[1])
          .attr('r', 2)
          .style('fill', 'black');
      }
    }
  };
}

function updateLocations(){
   setInterval(function() {console.log('renderroutes'); renderVehicles(); }, 15000);
}
