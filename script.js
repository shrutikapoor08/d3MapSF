(function init() {
  let svg;
  let projection;
  renderSFMap()
    .then(() => {
      renderRoutes();
      renderVehicles();
      updateLocations();
    });
}());

function renderSFMap() {
  return new Promise((resolve, reject) => {
    const width = 720;
    const height = 700;
    const offset = [width / 2, height / 2];

    // DISCLAIMER: scale and translate calculations referenced from 3rd party
    projection = d3.geoMercator()
      .scale(160000)
      .translate(offset)
      .center([-122.43, 37.75]);

    svg = d3.select('body')
      .append('svg')
      .attr('height', height)
      .attr('width', width)
      .attr('viewBox', '0 140 650 450');

    const path = d3.geoPath().projection(projection);
    d3.selectAll('path').attr('d', path);

    d3.json('sfmaps/neighborhoods.json', (neighborhoods) => {
      svg.append('g')
        .attr('id', 'neighborhoods')
        .selectAll('path')
        .data(neighborhoods.features)
        .enter()
        .append('path')
        .attr('id', data => data.properties.neighborho)
        .attr('d', path);

      // return promise as SVG
      resolve(svg);
    });
  });
}

function renderVehicles() {
  const VEHICLESURL = 'http://webservices.nextbus.com/service/publicJSONFeed?command=vehicleLocations&a=sf-muni&r=N&t=1144953500233';
  const xhr = new XMLHttpRequest();
  const url = VEHICLESURL;
  xhr.open('GET', url);
  xhr.send();
  xhr.onload = function () {
    if ((xhr.readyState === xhr.DONE) && (xhr.status === 200)) {
      const vehicles = JSON.parse(xhr.response).vehicle;
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
  };
}

function renderRoutes() {
  const ROUTESURL = 'http://webservices.nextbus.com/service/publicJSONFeed?command=routeConfig&a=sf-muni&r=N';
  const xhr = new XMLHttpRequest();
  const url = ROUTESURL;
  xhr.open('GET', url);
  xhr.send();
  xhr.onload = function () {
    if ((xhr.readyState === xhr.DONE) && (xhr.status === 200)) {
      const stops = JSON.parse(xhr.response).route.stop;
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
  };
}

function updateLocations() {
  const INTERVAL = 15000;
  // update location every 15 seconds
  setInterval(() => {
    renderVehicles();
  }, INTERVAL);
}
