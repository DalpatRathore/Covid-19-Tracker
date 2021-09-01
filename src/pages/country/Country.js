import React, { useState, useEffect } from "react";
import "./Country.css";
import { MenuItem, FormControl, Select } from "@material-ui/core";
import Table from "../../components/table/Table";
import { prettyPrintStat, sortData } from "../../components/utils/util";
import "leaflet/dist/leaflet.css";
import Loader from "../../components/loader/Loader";
import numeral from "numeral";

const Country = () => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("india");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/countries/india")
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
        setLoading(false);
        setError(false);
      })
      .catch(error => {
        console.log(error);
        setError(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then(response => response.json())
        .then(data => {
          const countries = data.map(country => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);
  const onCountryChange = async e => {
    const countryCode = e.target.value;
    setCountry(countryCode);
    setLoading(true);
    const url =
      countryCode === "IN"
        ? `https://disease.sh/v3/covid-19/countries/india`
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
        setLoading(false);
        setError(false);
      })
      .catch(error => {
        console.log(error);
        setError(true);
        setLoading(false);
      });
  };

  // if (loading) {
  //   return <Loader></Loader>;
  // }
  if (error) {
    return (
      <div className="country">
        <h3>Sorry! Something went wrong.</h3>
      </div>
    );
  }

  return (
    <div className="country">
      <div className="country__leftContainer">
        <FormControl className="country__dropdown">
          <Select variant="outlined" value={country} onChange={onCountryChange}>
            <MenuItem value="india">India</MenuItem>
            {countries.map((country, index) => (
              <MenuItem key={index} value={country.value}>
                {country.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {loading ? (
          <div className="country__stats">
            <Loader></Loader>
          </div>
        ) : (
          <div className="country__stats">
            <div className="country__stat">
              <span className="labelStatic">Population</span>
              <span className="labelDynamic">
                {numeral(countryInfo.population).format(",")} (
                {prettyPrintStat(countryInfo.population)})
              </span>
            </div>
            <div className="country__stat">
              <span className="labelStatic">Cases</span>
              <span className="labelDynamic">
                {numeral(countryInfo.cases).format(",")} (
                {prettyPrintStat(countryInfo.cases)})
              </span>
            </div>
            <div className="country__stat">
              <span className="labelStatic">Today Cases</span>
              <span className="labelDynamic">
                {numeral(countryInfo.todayCases).format(",")} (
                {prettyPrintStat(countryInfo.todayCases)})
              </span>
            </div>
            <div className="country__stat">
              <span className="labelStatic">Active Cases</span>
              <span className="labelDynamic">
                {numeral(countryInfo.active).format(",")} (
                {prettyPrintStat(countryInfo.active)})
              </span>
            </div>
            <div className="country__stat">
              <span className="labelStatic">Cases/Million</span>
              <span className="labelDynamic">
                {numeral(countryInfo.casesPerOneMillion).format(",")} (
                {prettyPrintStat(countryInfo.casesPerOneMillion)})
              </span>
            </div>
            <div className="country__stat">
              <span className="labelStatic">Deaths/Million</span>
              <span className="labelDynamic">
                {numeral(countryInfo.deathsPerOneMillion).format(",")} (
                {prettyPrintStat(countryInfo.deathsPerOneMillion)})
              </span>
            </div>
            <div className="country__stat">
              <span className="labelStatic">Covid-19 Tests</span>
              <span className="labelDynamic">
                {numeral(countryInfo.tests).format(",")} (
                {prettyPrintStat(countryInfo.tests)})
              </span>
            </div>
            <div className="country__stat">
              <span className="labelStatic">Covid-19 Tests/Million</span>
              <span className="labelDynamic">
                {numeral(countryInfo.testsPerOneMillion).format(",")} (
                {prettyPrintStat(countryInfo.testsPerOneMillion)})
              </span>
            </div>
            <div className="country__stat">
              <span className="labelStatic">Active Cases/Million</span>
              <span className="labelDynamic">
                {numeral(countryInfo.activePerOneMillion).format(",")} (
                {prettyPrintStat(countryInfo.activePerOneMillion)})
              </span>
            </div>
            <div className="country__stat">
              <span className="labelStatic">Recovered/Million</span>
              <span className="labelDynamic">
                {numeral(countryInfo.recoveredPerOneMillion).format(",")} (
                {prettyPrintStat(countryInfo.recoveredPerOneMillion)})
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="country__rightContainer">
        <h3>Live Cases by Country</h3>
        <Table countries={tableData}></Table>
      </div>
    </div>
  );
};

export default Country;
