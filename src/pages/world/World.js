import React, { useState, useEffect } from "react";
import "./World.css";
import InfoBox from "../../components/infoBox/InfoBox";
import Map from "../../components/map/Map";
import { prettyPrintStat } from "../../components/utils/util";
import LineGraph from "../../components/lineGraph/LineGraph";
import "leaflet/dist/leaflet.css";
import Loader from "../../components/loader/Loader";

const World = () => {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});

  const [mapZoom, setMapZoom] = useState(3);
  const [mapCenter, setMapCenter] = useState({
    lat: 34.80746,
    lng: -40.4796,
  });
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
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

          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);
  const onCountryChange = async e => {
    const countryCode = e.target.value;
    setCountry(countryCode);
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
  if (loading) {
    return <Loader></Loader>;
  }
  if (error) {
    return (
      <div className="world">
        <h3>Sorry! Something went wrong.</h3>
      </div>
    );
  }

  return (
    <div className="world">
      <div className="world__leftContainer">
        <div className="world__stats">
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
        <div className="world__graph">
          <h3 className="world__graphTitle">Worldwide {casesType}</h3>
          <LineGraph casesType={casesType}></LineGraph>
        </div>
      </div>
      <div className="world__rightContainer">
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        ></Map>
      </div>
    </div>
  );
};

export default World;
