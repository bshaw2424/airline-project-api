import React from "react";
import { useNavigate } from "react-router-dom";

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <section
      style={{
        backgroundImage: "url(../airlineBackground.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "auto",
        backgroundPosition: "center",
        zIndex: -1,
        height: "80vh",
      }}
    >
      <div className="container h-100 d-flex flex-column align-items-center justify-content-center">
        <h1>Sorry wrong destination</h1>
        <h3>Try Again</h3>
        <button
          type="submit"
          onClick={() => navigate(-1)}
          className="btn btn-primary round"
        >
          Back
        </button>
      </div>
    </section>
  );
};

export default ErrorPage;
