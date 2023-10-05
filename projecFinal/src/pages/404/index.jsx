import React, { useEffect } from "react";
import "./assets/bootstrap.css";
import "./assets/error-page-responsive.css";
import "./assets/error-page.css";
import { Link } from "react-router-dom";
const NotFound = () => {
  return (
    <div>
      <section className="page-section">
        <div className="full-width-screen">
          <div className="container-fluid">
            <div className="content-detail">
              <h1 className="global-title">
                <span>4</span>
                <span>0</span>
                <span>0</span>
              </h1>
              <h4 className="sub-title">Oops!</h4>
              <p className="detail-text">
                Sorry Bad Request, <br /> The HTTP request that was sent to the
                server has invalid syntax.
              </p>
              <div className="back-btn">
                <Link className="btn" to={"/home"}>
                  Inicio
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default NotFound;
