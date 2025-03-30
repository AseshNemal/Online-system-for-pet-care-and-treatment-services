import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  // Internal CSS styles
  const styles = {
    footerContainer: {
      bottom: '0',
      left: '0',
      right: '0',
      backgroundColor: '#fff',
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
      zIndex: '1000'
    },
    footerSection: {
      padding: '1em 0',
      background: '#f8f9fa'
    },
    container: {
      width: '100%',
      padding: '0 15px',
      margin: '0 auto',
      maxWidth: '1140px'
    },
    row: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    colMd12: {
      width: '100%',
      padding: '0 15px',
      textAlign: 'center'
    },
    colMd6: {
      width: '50%',
      padding: '0 15px',
      textAlign: 'center'
    },
    footerHeading: {
      fontSize: '20px',
      marginBottom: '15px',
      fontWeight: '700',
      color: '#000'
    },
    logo: {
      color: '#000',
      textDecoration: 'none'
    },
    menu: {
      marginBottom: '20px',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      padding: '0',
      listStyle: 'none'
    },
    menuLink: {
      color: '#000',
      margin: '0 8px',
      fontSize: '12px',
      textDecoration: 'none'
    },
    socialList: {
      display: 'flex',
      justifyContent: 'center',
      padding: '0',
      listStyle: 'none',
      margin: '15px 0'
    },
    socialItem: {
      margin: '0 8px'
    },
    socialLink: {
      color: '#000',
      fontSize: '16px',
      textDecoration: 'none'
    },
    copyright: {
      fontSize: '12px',
      color: 'rgba(0, 0, 0, 0.5)',
      lineHeight: '1.5',
      marginBottom: '10px'
    },
    heartIcon: {
      color: 'red'
    },
    contentWrapper: {
      paddingBottom: '200px'
    }
  };

  return (
    <div style={styles.contentWrapper}>
      <div style={styles.footerContainer}>
        <section style={styles.footerSection}>
          <div style={styles.container}>
            <div style={styles.row}>
              <div style={styles.colMd6}>
                <h2 style={{margin: '10px 0'}}>PetCare</h2>
              </div>
            </div>
          </div>
        </section>
        
        <footer style={{padding: '15px 0', background: '#fff'}}>
          <div style={styles.container}>
            <div style={styles.row}>
              <div style={styles.colMd12}>
                <h2 style={styles.footerHeading}>
                  <Link to="/" style={styles.logo}>PetCare.com</Link>
                </h2>
                <div style={styles.menu}>
                  <Link to="/" style={styles.menuLink}>Home</Link>
                  <Link to="/devices" style={styles.menuLink}>Devices</Link>
                  <Link to="/about" style={styles.menuLink}>About</Link>
                  <Link to="/features" style={styles.menuLink}>Features</Link>
                  <Link to="/blog" style={styles.menuLink}>Blog</Link>
                  <Link to="/contact" style={styles.menuLink}>Contact</Link>
                </div>
                <ul style={styles.socialList}>
                  <li style={styles.socialItem}>
                    <a href="https://twitter.com" style={styles.socialLink} title="Twitter">Twitter</a>
                  </li>
                  <li style={styles.socialItem}>
                    <a href="https://facebook.com" style={styles.socialLink} title="Facebook">Facebook</a>
                  </li>
                  <li style={styles.socialItem}>
                    <a href="https://instagram.com" style={styles.socialLink} title="Instagram">Instagram</a>
                  </li>
                </ul>
                <p style={styles.copyright}>
                  © {new Date().getFullYear()} PetCare. All rights reserved.
                  Made with <span style={styles.heartIcon}>♥</span> for pets.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Footer;