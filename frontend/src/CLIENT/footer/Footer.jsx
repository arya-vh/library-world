import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { MdMail } from "react-icons/md";
import { FaPhone, FaFacebookF, FaYoutube, FaTwitter } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { PiInstagramLogoFill } from "react-icons/pi";
import "./footer.css";

const visitSection = [
  //{ id: 1, icon: <FaMapMarkerAlt />, content: "Bhaktapur, Nepal" },
  { id: 2, icon: <FaPhone />, content: <a href='tel:016613199'>+01-6613199</a> },
  { id: 3, icon: <MdMail />, content: <a href='mailto:libraryworld.com'>libraryworld@gmail.com</a> },
];

const socials = [
  { id: 1, icon: <FaFacebookF />, link: "#" },
  { id: 2, icon: <FaTwitter />, link: "#" },
  { id: 3, icon: <FaYoutube />, link: "#" },
  { id: 4, icon: <PiInstagramLogoFill />, link: "#" },
];

const Footer = () => {
  return (
    <footer className="footer bg-black text-white py-4">
      <Container>
        <Row className="justify-content-between align-items-center">
          <Col md={4} className="text-center text-md-start">
            <h5>Library World</h5>
            <p>Empowering Libraries, Enriching Knowledge</p>
          </Col>
          <Col md={4} className="text-center">
            <h5>Visit Us</h5>
            {visitSection.map(({ id, icon, content }) => (
              <div key={id} className="d-flex align-items-center justify-content-center gap-2">
                {icon}
                <p className="mb-0">{content}</p>
              </div>
            ))}
          </Col>
          <Col md={4} className="text-center text-md-end">
            <h5>Follow Us</h5>
            <div className="d-flex justify-content-center justify-content-md-end gap-3">
              {socials.map(({ id, icon, link }) => (
                <a key={id} href={link} className="text-white fs-5" target="_blank" rel="noopener noreferrer">
                  {icon}
                </a>
              ))}
            </div>
          </Col>
        </Row>
        <hr className="bg-light" />
        <Row>
          <Col className="text-center">
            <small>&copy; 2025 Library World. All Rights Reserved.</small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
