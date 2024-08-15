import React from "react";
import "./styles.scss";
const LoadingInner: React.FC = () => {
  return (
    <div className="loading-overlay">
      <div className="loader">
        <div className="inner one"></div>
        <div className="inner two"></div>
        <div className="inner three"></div>
      </div>
    </div>
  );
};

export default React.memo(LoadingInner);
