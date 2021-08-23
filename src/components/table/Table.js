import React from "react";
import "./Table.css";
import numeral from "numeral";
function Table({ countries }) {
  return (
    <div className="table">
      <table>
        <thead>
          <tr>
            <th>Country</th>
            <th>Cases</th>
          </tr>
        </thead>
        {countries.map((nation, index) => {
          const { country, cases } = nation;
          return (
            <tbody key={index}>
              <tr>
                <td>
                  {index + 1}. {country}
                </td>
                <td>
                  <strong>{numeral(cases).format(",")}</strong>
                </td>
              </tr>
            </tbody>
          );
        })}
      </table>
    </div>
  );
}

export default Table;
