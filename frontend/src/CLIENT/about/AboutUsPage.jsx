import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import AboutUsBanner from "./AboutUsBanner";
import "./aboutus.css";
import { about_data } from "./aboutusData";

const AboutUsPage = () => {
  return (
    <Container className="bottom-margin">
      <AboutUsBanner />
      
      <h1 className="h1 text-center mx-auto" id="about-heading">
        About Us
      </h1>
      
      <Row className="mt-5 aboutus-bottom-section">
        {about_data.map((item) => {
          const { id, title, description } = item;
          return (
            <Col lg={4} md={6} sm={12} key={id} className="about-section">
              <div className="about-card">
                <h2 className="about-title">{title}</h2>
                <p className="about-description">{description}</p>
              </div>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
};

export default AboutUsPage;
