
let width = 560,
  height = 460;

const projection = d3.geo.mercator();

const svg = d3.select('body').append('svg')
            .attr('width', width)
            .attr('height', height);
const path = d3.geo.path().projection(projection);
const g = svg.append('g');

d3.json('/sfmaps/sfmapsTopo.json', (error, topology) => {
  console.log('topology', topology);

  const streets = topojson.feature(topology, topology.objects.streets).features;
  console.log('streets', streets);

  svg.selectAll('.streets')
          .data(streets)
          .enter().append('path')
          .attr('class', 'streets')
          .attr('d', path);
});
function clicked() {
  console.log('clicked');
}
