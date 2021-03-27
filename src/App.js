import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { prettyPrintStat, sortData } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCenter, setMapCenter] = useState({
    lat: 34.80746,
    lng: -40.4796,
  });
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
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
          setMapCountries(data);
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
      countryCode === "worldwide"
        ? `https://disease.sh/v3/covid-19/all`
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter([data.countryInfo.lat, data.countryInfo.lng]);
        setMapZoom(4);
      });
  };

  return (
    <div className="app">
      <div className="app_leftContainer">
        <div className="app__header">
          <h1>Covid-19 Tracker</h1>
          <FormControl className="app_dropdwon">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map(country => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app_stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={e => setCasesType("cases")}
            title="Coronavirus Cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          ></InfoBox>
          <InfoBox
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
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        ></Map>
      </div>
      <Card className="app_rightContainer">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}></Table>
          <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
          <LineGraph casesType={casesType}></LineGraph>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
