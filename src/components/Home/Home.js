import React,{useState,useEffect} from 'react'
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const  navigate = useNavigate();
  const [allCountries, setAllCountries] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault()
    const inputValue = e.target[0].value;
    const matchedCountry = Object.values(allCountries).find(
      (country) =>
        country.name.common.toLowerCase() === inputValue.toLowerCase()
    );
    if(matchedCountry){
      navigate(`/countriesdetails/${matchedCountry.name.common}`)
    }
    else{
      alert('Country not found')
    }
  }


  const handleReadMore = (countryname) => {
    console.log(countryname)
    navigate(`/countriesdetails/${countryname}`)
  }

  useEffect(() => {
    const fetchAllCountries = async () => {
      const resp = await fetch(
        'https://restcountries.com/v3.1/all?fields=name,capital,flags,area,population,continents,currencies,cca2'
      );
      const countryData = await resp.json();
      setAllCountries(countryData);
      console.log(countryData)
    };
    fetchAllCountries();
  }, []);

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="m-5">
        <label for="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
        <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20"/>
            </div>
            <input type="search" 
                    id="default-search" 
                    className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                    placeholder="Search Countries here..." 
                    required/>
            <button type="submit" 
                    className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                      Search
            </button>
        </div>
        </div>
      </form>
      
      <div className="flex flex-wrap">
      {allCountries && 
        allCountries.map((country, index) => {
          return (
            <div className="w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 px-4 mb-4" key={index}>
              <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <img className="w-full h-auto rounded-t-lg" src={country.flags.png} alt="" />
                <div className="p-5">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{country.name.common}</h5>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{country.continents}</span>
                </div>
                <button type="button" 
                        onClick={()=>{handleReadMore(country.cca2)}}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                          Read More
                </button>
          </div>
        </div>
      );
    })}
      </div>

    </>
  )
}

export default Home