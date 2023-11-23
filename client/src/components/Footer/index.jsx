import React from "react";
import "./footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <a href="https://www.instagram.com/multifaetec/" className="footer-link"  target="">
        <img className="footer-image" src="Instagram-Logo.png" alt="" />
        <h1 className="title-login">Multi</h1>
      </a>
    </footer>
  );
}
