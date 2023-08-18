import React,{useEffect, useState, useRef} from 'react'
import WorldMap from "react-svg-worldmap";
import * as d3 from "d3";

const TopCountries = () => {
  const [allCountries, setAllCountries] = useState([]);
  const [count, setCount] = useState(0);
  const [criteria, setCriteria] = useState('population');
  const [mapData, setMapData] = useState([{ country: "in", value: 1}]);

  const [population, setPopulation] = useState([0,0]);
  const [area, setArea] = useState([0,0]);

  const svgRef = useRef();
  const svgRefPopulation = useRef();
  const svgRefArea = useRef();
  
  useEffect(()=>{
    const fetchAllCountries = async () => {
      const resp = await fetch(
        'https://restcountries.com/v3.1/all'
      );
      const countryData = await resp.json();
      const filteredCountryData = countryData.map(country => ({
        cca2: country.cca2,
        population: country.population,
        area: country.area,
        name: country.name.common,
        flag: country.flags.png,
        continent: country.region
      }));
      const totalPopulation = filteredCountryData.reduce((accumulator, country) => accumulator + parseInt(country.population), 0);
      const totalArea = filteredCountryData.reduce((accumulator, country) => accumulator + parseInt(country.area), 0); 
      setPopulation([0,totalPopulation])
      setArea([0,totalArea])
      setAllCountries(filteredCountryData);
    };
    fetchAllCountries();
  },[])

  useEffect(() => {
    const sortedCountries = allCountries.slice().sort((a, b) => b[criteria] - a[criteria]); // use dynamic property access to get criteria
    const topCountries = sortedCountries.slice(0, count).map(country => ({
      country: country.cca2,
      value: country[criteria] // use dynamic property access to get criteria
    }))
    setMapData(topCountries);
    if(criteria==='population'){
      const topPopulation = allCountries.slice(0,count).reduce((accumulator, country) => accumulator + parseInt(country.population), 0);
      setPopulation(prevPopulation => [topPopulation, prevPopulation[1]]);
    }
    else{
      const topArea = allCountries.slice(0,count).reduce((accumulator, country) => accumulator + parseInt(country.area), 0);
      setArea(prevArea => [topArea, prevArea[1]]);
    }
  },[count,criteria,allCountries])

  const handleCountChange = (e) => {
    setCount(parseInt(e.target.value))
  }

  const handleCriteriaChange = (e) => {
    setCriteria(e.target.value)
  }

  useEffect(()=>{
    d3.select(svgRef.current).selectAll('*').remove()
    d3.select('.table-container').selectAll('*').remove();

    //setting up the svg container
    const width = 400;
    const height = 250;
    const radius = width/2;
    const svg = d3.select(svgRef.current)
                  .attr('width', width)
                  .attr('height', height)
                  .style('margin-left', '30%')
                  .style('margin-top', '30%')
                  .style('overflow', 'visible')

    const tooltip = d3.select('body').append('div')
                  .attr('class', 'tooltip')
                  .style('position', 'absolute')
                  .style('opacity', 0);
    //setting up the chart
    const formattedData = d3.pie()
                  .value(d => d.value)(mapData)
    const arc = d3.arc()
                  .innerRadius(0)
                  .outerRadius(radius)
    
    const color = d3.scaleOrdinal(d3.schemeSet2)

    //setting up svg data
    svg.selectAll()
        .data(formattedData)
        .join('path')
        .attr('d', arc)
        .attr('fill',d=> color(d.value))
        .style('opacity', 0.7)
        .on('mouseover', (event, d) => {
          tooltip.transition()
              .duration(200)
              .style('opacity', 0.9);
          tooltip.html(`${d.data.value}`)
              .style('left', `${event.pageX}px`)
              .style('top', `${event.pageY}px`)
        })
        .on('mouseout', () => {
          tooltip.transition()
              .duration(500)
              .style('opacity', 0)
        })

    //setting up annotation
    svg.selectAll()
        .data(formattedData)
        .join('text')
        .text(d => d.data.country)
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .style('text-anchor', 'middle')

    // Populate the table container with data
    const tableContainer = d3.select('.table-container');
    const table = tableContainer.append('table');

    const header = table.append('tr');
    header.append('th').text('Country');
    header.append('th').text('Value');

    // Add data rows
    const rows = table.selectAll('tr.row')
        .data(mapData)
        .enter()
        .append('tr')
        .attr('class', 'row');

    rows.append('td').text(d => d.country);
    rows.append('td').text(d => d.value);

  },[mapData])

  useEffect(()=>{
    d3.select(svgRefPopulation.current).selectAll('*').remove()

    const width = 400;
    const height = 250;

    const svgPopulation = d3.select(svgRefPopulation.current)
                  .attr('width', width)
                  .attr('height', height)
                  .style('margin', '20%')
                  .style('overflow', 'visible')

    const xScalePopulation = d3.scaleLinear()
                  .domain([0, population[1]])
                  .range([0, width])

    svgPopulation.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScalePopulation))
            .selectAll('text')
            .attr('transform', 'translate(-10,0)rotate(-45)')
            .style('text-anchor', 'end');

    const yScalePopulation = d3.scaleBand()
                  .domain(['All Countries','Top Countries'])
                  .range([0, height])
                  .padding(0.1)

    svgPopulation.append('g')
            .call(d3.axisLeft(yScalePopulation))

    const barsData = [
      { Tag: 'Top Countries', Value: population[0] }, // Create objects for bars
      { Tag: 'All Countries', Value: population[1] }
  ];

    svgPopulation.selectAll('rect')
                    .data(barsData)
                    .enter()
                    .append('rect')
                    .attr('x', xScalePopulation(0))
                    .attr('y', d => yScalePopulation(d.Tag))
                    .attr('width', d => xScalePopulation(d.Value))
                    .attr('height', yScalePopulation.bandwidth())
                    .attr('fill', '#C1C1FE');
  },[population])

  useEffect(()=>{
    d3.select(svgRefArea.current).selectAll('*').remove()

    const width = 400;
    const height = 250;

    const svgArea = d3.select(svgRefArea.current)
                  .attr('viewBox', `0 0 ${width} ${height}`)
                  .style('margin', '20%')
                  .style('position', 'relative');

    const xScaleArea = d3.scaleLinear()
                  .domain([0, area[1]])
                  .range([0, width])

    svgArea.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScaleArea))
            .selectAll('text')
            .attr('transform', 'translate(-10,0)rotate(-45)')
            .style('text-anchor', 'end');

    const yScaleArea = d3.scaleBand()
                  .domain(['All Countries','Top Countries'])
                  .range([0, height])
                  .padding(0.1)

    svgArea.append('g')
            .call(d3.axisLeft(yScaleArea))

    const barsDataArea = [
      { Tag: 'Top Countries', Value: area[0] }, // Create objects for bars
      { Tag: 'All Countries', Value: area[1] }
  ];

    svgArea.selectAll('rect')
                    .data(barsDataArea)
                    .enter()
                    .append('rect')
                    .attr('x', xScaleArea(0))
                    .attr('y', d => yScaleArea(d.Tag))
                    .attr('width', d => xScaleArea(d.Value))
                    .attr('height', yScaleArea.bandwidth())
                    .attr('fill', '#C1C1FE');
  },[area])

  return (
    <div>
      <div className="p-4 border border-gray-300 rounded shadow-md grid">
          <p className="text-xl font-semibold mb-4 m-2">Top</p>
          <select
            value={count}
            onChange={handleCountChange}
            className="mb-2 p-2 border border-gray-400 rounded m-2 "
          >
            <option value={0}>0</option>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
            <option value={25}>25</option>
            <option value={30}>30</option>
            <option value={35}>35</option>
            <option value={40}>40</option>
          </select>
          <p className="mb-2 m-2">countries by</p>
          <select
            value={criteria}
            onChange={handleCriteriaChange}
            className="p-2 border border-gray-400 rounded m-2"
          >
            <option value="area">Area</option>
            <option value="population">Population</option>
          </select>
      </div>

      <div className="inline-block m-2">
          <WorldMap
            className="custom-world-map"
            color="blue"
            value-suffix=""
            size="responsive"
            data={mapData}
          />
        </div>

      <div className="text-gray-800 text-xl font-semibold mb-4">Visualize as a Pie Chart</div>
        <div className="mt-4 border border-blue rounded m-5 pt-5">
          <div className='flex'>
            <svg ref={svgRef}></svg>
            <div className="table-container"></div>
          </div>
      </div>

      <div className="text-gray-800 text-xl font-semibold mb-4">Total Population v/s Selected Population</div>
        <div className="mt-3 border border-blue rounded m-5 pt-5">
          <div className='flex'>
            <svg ref={svgRefPopulation}></svg>
            <div className="table-container2"></div>
          </div>
        </div>
       
      <div className="text-gray-800 text-xl font-semibold mb-4">Total Area v/s Selected Area</div>
        <div className="mt-4 border border-blue rounded m-5 pt-5">
          <div className='flex'>
            <svg ref={svgRefArea}></svg>
            <div className="table-container2"></div>
          </div>
        </div>
    </div>
  )
}

export default TopCountries;
