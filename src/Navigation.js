import React,{useState} from 'react';
import {BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Home from './components/Home/Home';
import TopCountries from './components/TopCountries/TopCountries';
import CountriesDetails from './components/CountriesDetails/CountriesDetails';

function Navigation() {
    const [isOpen, setIsOpen] = useState(true);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

  return (
    <Router>
        <nav className="flex items-center justify-between flex-wrap bg-blue-500 p-6">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <span className="font-semibold text-xl tracking-tight">🌎 World View</span>
            </div>
            <div className="block lg:hidden">
                <button onClick={toggleMenu} className="flex items-center px-3 py-2 border rounded text-white border-white-400 hover:text-white hover:border-white">
                    <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z"/></svg>
                </button>
            </div>
            {isOpen && (
                <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                    <div className="text-md lg:items-left ">
                        <Link href="#responsive-header" className="block mt-4 border border-white rounded py-1 px-3 lg:inline-block lg:mt-0 text-white hover:text-white mr-4" to="/">Home</Link>
                        <Link href="#responsive-header" className="block mt-4 border border-white rounded py-1 px-3  lg:inline-block lg:mt-0 text-white hover:text-white mr-4" to="/topcountries">Top Countries</Link>
                    </div>
                </div>
            )}
        </nav>

        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/topcountries" element={<TopCountries/>}/>
            <Route path="/countriesdetails/:countryname" element={<CountriesDetails/>}/>
        </Routes>
    </Router>
  );
}
export default Navigation;