import React, { useEffect, useState } from "react";
import axios from 'axios';
import "./CovidInfo.css";

function CovidInfo() {
  const [continents, setContinents] = useState([]);
  const [selectedContinent, setSelectedContinent] = useState("");
  const [continentCountries, setContinentCountries] = useState([]);
  const [countryData, setCountryData] = useState(null);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchContinents();
  }, []);

  const fetchContinents = async () => {
    const options = {
      method: 'GET',
      url: 'https://covid-193.p.rapidapi.com/countries',
      headers: {
        'X-RapidAPI-Key': '264023fa2fmsh7b34f9af48a1cc5p1e63adjsnc6e3ffa2f477',
        'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      const continents = response.data.response.map((country) => country.continent);
      setContinents([...new Set(continents)]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCountriesByContinent = async (continent) => {
    const options = {
      method: 'GET',
      url: 'https://covid-193.p.rapidapi.com/history',
      headers: {
        'X-RapidAPI-Key': '264023fa2fmsh7b34f9af48a1cc5p1e63adjsnc6e3ffa2f477',
        'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      const countries = response.data.response.filter((country) => country.continent === continent);
      setContinentCountries(countries);
      setSelectedContinent(continent);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchCountryData = async (country) => {
    const options = {
      method: 'GET',
      url: 'https://covid-193.p.rapidapi.com/statistics',
      params: {
        country: country,
      },
      headers: {
        'X-RapidAPI-Key': '264023fa2fmsh7b34f9af48a1cc5p1e63adjsnc6e3ffa2f477',
        'X-RapidAPI-Host': 'covid-193.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      setCountryData(response.data.response[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleContinentClick = (continent) => {
    if (selectedContinent === continent) {
      setSelectedContinent("");
    } else {
      fetchCountriesByContinent(continent);
    }
  };

  const handleCountryClick = (country) => {
    fetchCountryData(country);
  };

  const handleSearchInputChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCountryData(searchInput);
  };

  return (
    <div className="covid-info">
      <h1>COVID-19 CASES INFORMATION COUNTRY WISE</h1>
      <div className="covid-info__input">
        <form onSubmit={handleSearchSubmit}>
          <input className="search-input" onChange={handleSearchInputChange} placeholder="Enter Country Name" />
          <br />
          <button className="search-button" type="submit">Search</button>
        </form>
      </div>

      <div className="covid-info__continents">
        {continents.map((continent, index) => (
          <div key={index} className="covid-info__continent">
            <span className="continent-name" onClick={() => handleContinentClick(continent)}>
              {selectedContinent === continent ? "-" : "+"}
              {continent}
            </span>
            {selectedContinent === continent && (
              <table className="country-table">
                <thead>
                  <tr>
                    <th>Country</th>
                    <th>Population</th>
                    <th>Total Cases</th>
                  </tr>
                </thead>
                <tbody>
                  {continentCountries.map((country, index) => (
                    <tr key={index} onClick={() => handleCountryClick(country.country)}>
                      <td>{country.country}</td>
                      <td>{country.population}</td>
                      <td>{country.cases.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>

      {countryData && (
        <div className="covid-info__country-info">
          <table>
            <tbody>
              <tr>
                <td>Country Name:</td>
                <td>{countryData.country}</td>
              </tr>
              <tr>
                <td>Cases:</td>
                <td>{countryData.cases.total}</td>
              </tr>
              <tr>
                <td>Deaths:</td>
                <td>{countryData.deaths.total}</td>
              </tr>
              <tr>
                <td>Recovered:</td>
                <td>{countryData.cases.recovered}</td>
              </tr>
              <tr>
                <td>Cases Today:</td>
                <td>{countryData.cases.new}</td>
              </tr>
              <tr>
                <td>Deaths Today:</td>
                <td>{countryData.deaths.new}</td>
              </tr>
              <tr>
                <td>Last Updated:</td>
                <td>{countryData.time}</td>
              </tr>
              <tr>
                <td>Continent:</td>
                <td>{countryData.continent}</td>
              </tr>
              <tr>
                <td>Population:</td>
                <td>{countryData.population}</td>
              </tr>
              <tr>
                <td>Total Tests:</td>
                <td>{countryData.tests.total}</td>
              </tr>
              <tr>
                <td>Active cases:</td>
                <td>{countryData.cases.active}</td>
              </tr>
              <tr>
                <td>Critical cases:</td>
                <td>{countryData.cases.critical}</td>
              </tr>
              <tr>
                <td>Day:</td>
                <td>{countryData.day}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default CovidInfo;
