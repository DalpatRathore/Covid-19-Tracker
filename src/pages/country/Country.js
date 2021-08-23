import React, { useState, useEffect } from "react";
import "./Country.css";
import { MenuItem, FormControl, Select } from "@material-ui/core";
import InfoBox from "../../components/infoBox/InfoBox";

import Table from "../../components/table/Table";
import { prettyPrintStat, sortData } from "../../components/utils/util";
import LineGraph from "../../components/lineGraph/LineGraph";
import "leaflet/dist/leaflet.css";

const Country = () => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("india");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/countries/india")
      .then(response => response.json())
      .then(data => {
        setCountryInfo(data);
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
    // console.log(countryCode);
    const url =
      countryCode === "IN"
        ? `https://disease.sh/v3/covid-19/countries/india`
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
      });
  };

  return (
    <div className="world">
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

        <div className="country__stats">
          <InfoBox
            active={casesType === "cases"}
            onClick={e => setCasesType("cases")}
            title="Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          ></InfoBox>
          <InfoBox
            isGreen
            active={casesType === "recovered"}
            onClick={e => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          ></InfoBox>
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={e => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          ></InfoBox>
        </div>
        <div className="country__graph">
          <h3 className="country__graphTitle">{casesType}</h3>
          <LineGraph casesType={casesType}></LineGraph>
        </div>
      </div>
      <div className="country__rightContainer">
        <h3>Live Cases by Country</h3>
        <Table countries={tableData}></Table>
      </div>
    </div>
  );
};

export default Country;
