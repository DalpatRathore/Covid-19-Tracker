import React from "react";
import "./InfoBox.css";
function InfoBox(props) {
  const { title, cases, isRed, isGreen, active, total } = props;

  return (
    <div
      className={`infoBox ${active && "infoBox__selected"}`}
      onClick={props.onClick}
    >
      <h1 className="infoBox__title">{title}</h1>
      <h2
        className={`infoBox__cases ${isGreen && "infoBox__cases--recovered"} ${
          isRed && "infoBox__cases--deaths"
        }`}
      >
        {cases}
      </h2>
      <h3 className="infoBox__total" color="textSecondary">
        {total} Total
      </h3>
    </div>
  );
}

export default InfoBox;
