import React, { useEffect, useState } from "react";
import "./Vaccine.css";
import numeral from "numeral";

const Vaccine = () => {
  const [vaccineInfo, setVaccineInfo] = useState([]);

  useEffect(() => {
    fetch(
      "https://disease.sh/v3/covid-19/vaccine/coverage/countries?lastdays=1"
    )
      .then(response => response.json())
      .then(data => {
        setVaccineInfo(data);
      });
  }, []);

  return (
    <div className="vaccine">
      {vaccineInfo.map((vaccine, index) => {
        const { country, timeline } = vaccine;
        // console.log("vaccne :>> ", vaccine);
        // console.log("tm :>> ", JSON.stringify(timeline));
        // console.log("tm :>> ", Object.keys(timeline));
        // console.log("tm :>> ", Object.values(timeline));
        return (
          <div key={index} className="vaccine__row">
            <h2>
              {index + 1}. {country}
            </h2>
            {Object.values(timeline).map((value, index) => {
              return <h2 key={index}> {numeral(value).format(",")}</h2>;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Vaccine;
