// import Container from "react-bootstrap/Container";
// import Navbar from "react-bootstrap/Navbar";
// import "./header.css";
// import CahoIcon from "../src/assets/Img/diagnosticon-logo-white.png";

// function Header() {
//   return (
//     <Container className="header">
//       <Navbar expand="lg" className="bg-body-tertiary header">
//         <Container className="header">
//           <Navbar.Brand className="header">
//             <img
//               src={CahoIcon}
//               width="200"
//               //   className="d-inline-block align-top"
//               alt="Caho_Diagnostion_Icon"
//             />
//           </Navbar.Brand>
//         </Container>
//       </Navbar>
//     </Container>
//   );
// }

// export default Header;

import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import CahoIcon from "../src/assets/Img/diagnosticon-logo-white.png";

import "./header.css";

function Headers() {
  const [scrollPosition, setScrollPosition] = useState(0);

  const [navbarBackground, setNavbarBackground] = useState("#35424a");

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);

      if (position > 50) {
        setNavbarBackground("#35424a"); // Change to red background when scrolled past 50px
      } else {
        setNavbarBackground("#35424a"); // Transparent background at top
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup the event listener when the component is unmounted
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      fixed="top"
      style={{
        backgroundColor: navbarBackground,
        borderBottom: "2px solid #ff506b",
        transition: "background-color 0.3s ease",
      }}
      className="header_main montaga-regulars">
      <Container>
        {/* <Navbar.Toggle aria-controls="responsive-navbar-nav" /> */}

        <Nav className="me-auto">
          <Navbar.Brand className="header">
            <img src={CahoIcon} width="270" alt="Caho_Diagnostion_Icon" />
          </Navbar.Brand>
        </Nav>
      </Container>
    </Navbar>
  );
}

export default Headers;
