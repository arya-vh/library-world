import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const LibraryHero = () => {
  return (
    <section className="position-relative bg-light py-5 overflow-hidden">
      {/* Background Shapes */}
      <div
        className="position-absolute bg-primary opacity-10 blur rounded-circle"
        style={{
          width: "400px",
          height: "400px",
          top: "-200px",
          right: "-200px",
          opacity: "10%",
        }}
      ></div>
      <div
        className="position-absolute bg-secondary opacity-10 blur rounded-circle"
        style={{
          width: "300px",
          height: "300px",
          bottom: "-150px",
          left: "-150px",
          opacity: "10%",
        }}
      ></div>

      <div className="container px-4">
        <div className="row align-items-center">
          {/* Hero Content */}
          <div className="col-md-6 relative">
            <h1 className="display-4 fw-bold text-dark">
              Explore Knowledge at{" "}
              <span className="text-primary">
                Bhaktapur Multiple Campus Library
              </span>
            </h1>
            <p className="lead text-muted mt-3">
              Access thousands of books, research papers, and academic resources
              to enhance your learning experience.
            </p>

            {/* CTA Buttons */}
            <div className="mt-4">
              <a href="/books" className="btn btn-primary me-3 py-2 mb-2 mb-md-0">
                Explore Library
              </a>
              <a href="/signup" className="btn btn-outline-primary py-2">
                Get Membership
              </a>
            </div>

            {/* Stats */}
            <div className="row mt-5">
              <div className="col-4 text-center">
                <h3 className="fw-bold text-dark">50K+</h3>
                <p className="text-muted fs-6">Books & Journals</p>
              </div>
              <div className="col-4 text-center">
                <h3 className="fw-bold text-dark">95%</h3>
                <p className="text-muted fs-6">User Satisfaction</p>
              </div>
              <div className="col-4 text-center">
                <h3 className="fw-bold text-dark">24/7</h3>
                <p className="text-muted fs-6">Online Access</p>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="d-none d-md-flex col-md-6 position-relative">
            <img
              src="/bannerBMC.png"
              alt="Library System"
              className="img-fluid rounded shadow"
            />

            {/* Floating Cards */}
            <div
              className="position-absolute top-0 start-0 bg-white p-3 rounded shadow-sm"
              style={{ transform: "translate(-30%, -30%)" }}
            >
              <div className="d-flex align-items-center">
                <i className="fas fa-check-circle text-success me-2"></i>
                <span>New Books Arrived</span>
              </div>
            </div>
            <div
              className="position-absolute bottom-0 end-0 bg-white p-3 rounded shadow-sm"
              style={{ transform: "translate(30%, 30%)" }}
            >
              <div className="d-flex align-items-center">
                <i className="fas fa-star text-warning me-2"></i>
                <span>Top Rated Research</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LibraryHero;
