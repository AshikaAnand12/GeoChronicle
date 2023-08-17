import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import WorldMap from "react-svg-worldmap";


const CountriesDetails = () => {
  const data = [{ country: 'in', value: 1 }];
  const [mapData, setMapData] = useState(data);
  const [country, setCountry] = useState({});
  const { countryname } = useParams();
  const [news, setNews] = useState([]); // [ { title: "", description: "", url: "" } ]

  useEffect(() => {
    const fetchNews = async (countryCode) => {
      try {
        const response = await fetch(`https://newsapi.org/v2/top-headlines?country=${countryCode}&apiKey=${process.env.REACT_APP_NEWS_API_KEY}`);
        const newsData = await response.json();
        setNews(newsData.articles);
      } catch (error) {
        console.error("Error fetching news:", error);
      }
    }
    const fetchCountry = async () => {
      try {
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryname}`);
        const countriesData = await response.json();
        if (countriesData && countriesData.length > 0) {
          const countryData = countriesData[0];
          setCountry(countryData);
          setMapData([{ country: countryData.cca2, value: countryData.population }]);
          fetchNews(countryData.cca2);
        }
      } catch (error) {
        console.error("Error fetching country:", error);
      }
    };
    
    fetchCountry();
  }, [countryname]);

  return (
    <>
   <h1 className="p-5 text-3xl font-bold text-gray-700 flex items-center justify-center">
        {country.name && (
          <>
            <img src={country.flags && country.flags.svg} alt={`${country.name.common} Flag`} className="w-8 h-8 mr-2" />
            {country.name.common}
          </>
        )}
      </h1>
    
    <div className="inline-block">
      <WorldMap
        className="custom-world-map"
        color="blue"
        value-suffix=""
        size="responsive"
        data={mapData}
      />
    </div>

       {/* {renderDetails()} */}
          
      <div className="bg-blue-500 rounded-lg shadow-md p-4 m-20">
        <div className="text-white border-b border-gray-600 pb-4 mb-4">
        <p className="text-lg font-semibold mb-2">Country Information</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
          <div>
            <p>Capital: {country.capital && country.capital[0]}</p>
            <p>Population: {country.population && country.population.toLocaleString()}</p>
            <p>Region: {country.region && country.region}</p>
          </div>
          <div>
            <p>Subregion: {country.subregion && country.subregion}</p>
            <p>Area: {country.area && country.area.toLocaleString()} km²</p>
            <p>Timezones: {country.timezones && Object.values(country.timezones).join(', ')}</p>
          </div>
        </div>
        </div>
        <div className="mt-4">
            <a
              href={country.maps && country.maps.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white border border-white rounded py-1 px-3 hover:text-blue-600 hover:underline "
            >
              View on Google Maps
            </a>
        </div>
      </div>

      <div className="mt-4 border border-blue rounded m-5 pt-5">
      <div className="text-gray-800 text-xl font-semibold mb-4">{news.length > 0 ? "Today's Top News":""}</div>
      {news.map((article, index) => (
        <div key={index} className="border border-gray-600 p-4 mb-4 rounded m-10">
          <p className="text-gray-800 text-lg font-semibold mb-2">{article.title}</p>
          <p className="text-gray-600 text-sm mb-2">{article.description}</p>
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white border border-white rounded py-1 px-3 bg-blue-500 hover:bg-blue-900 hover:text-white"
          >
            Read More
          </a>
        </div>
      ))}
    </div>

    </>
  );
};

export default CountriesDetails;
