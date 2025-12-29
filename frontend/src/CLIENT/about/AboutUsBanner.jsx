import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import "./aboutbanner.css";

const AboutUsBanner = () => {
  return (
    <div className="about-div-with-background border mt-5">
      <Container>
        <Row className="about-quote-container mt-5 me-1">
          <Col>
            <h1 className="quote-text">
              "He has the most, who is most content with the least."
            </h1>
            <p className="quote-author">― Lord Buddha</p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AboutUsBanner;
