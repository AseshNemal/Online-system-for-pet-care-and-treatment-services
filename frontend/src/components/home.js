import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
 
  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    header: {
      background: 'linear-gradient(135deg, #6e8efb, #a777e3)',
      color: 'white',
      padding: '80px 20px',
      textAlign: 'center',
      borderRadius: '0 0 20px 20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    },
    headerTitle: {
      fontSize: '3rem',
      marginBottom: '20px',
      fontWeight: '700'
    },
    headerSubtitle: {
      fontSize: '1.2rem',
      marginBottom: '30px',
      maxWidth: '700px',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    ctaButton: {
      display: 'inline-block',
      padding: '12px 30px',
      backgroundColor: '#fff',
      color: '#6e8efb',
      borderRadius: '30px',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '1.1rem',
      transition: 'all 0.3s ease',
      ':hover': {
        transform: 'translateY(-3px)',
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
      }
    },
    featuresSection: {
      padding: '80px 0',
      textAlign: 'center'
    },
    sectionTitle: {
      fontSize: '2.5rem',
      marginBottom: '50px',
      color: '#333',
      fontWeight: '600'
    },
    featuresGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '30px',
      padding: '0 20px'
    },
    featureCard: {
      background: '#fff',
      borderRadius: '15px',
      padding: '30px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
      transition: 'all 0.3s ease',
      ':hover': {
        transform: 'translateY(-10px)',
        boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
      }
    },
    featureIcon: {
      fontSize: '3rem',
      color: '#6e8efb',
      marginBottom: '20px'
    },
    featureTitle: {
      fontSize: '1.5rem',
      marginBottom: '15px',
      color: '#333'
    },
    featureText: {
      color: '#666',
      lineHeight: '1.6'
    },
    statsSection: {
      background: '#f9f9f9',
      padding: '60px 0',
      textAlign: 'center'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '30px',
      maxWidth: '900px',
      margin: '0 auto'
    },
    statItem: {
      padding: '20px'
    },
    statNumber: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#6e8efb',
      marginBottom: '10px'
    },
    statLabel: {
      color: '#666',
      fontSize: '1rem'
    },
    howItWorks: {
      padding: '80px 0',
      background: '#fff',
      textAlign: 'center'
    },
    stepsContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: '800px',
      margin: '0 auto'
    },
    step: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '40px',
      width: '100%'
    },
    stepNumber: {
      width: '50px',
      height: '50px',
      borderRadius: '50%',
      background: '#6e8efb',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '1.5rem',
      fontWeight: '700',
      marginRight: '30px',
      flexShrink: '0'
    },
    stepContent: {
      textAlign: 'left',
      flex: '1'
    },
    stepTitle: {
      fontSize: '1.3rem',
      marginBottom: '10px',
      color: '#333'
    },
    stepText: {
      color: '#666',
      lineHeight: '1.6'
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <header style={styles.header}>
        <div style={styles.container}>
          <h1 style={styles.headerTitle}>Monitor Your Pet's Health with Ease</h1>
          <p style={styles.headerSubtitle}>
            Our advanced pet monitoring system keeps you connected to your furry friend's
            health and activity 24/7, giving you peace of mind wherever you are.
          </p>
          <Link to="/pet" style={styles.ctaButton}>Get Started</Link>
        </div>
      </header>

      {/* Features Section */}
      <section style={styles.featuresSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Key Features</h2>
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📊</div>
              <h3 style={styles.featureTitle}>Real-time Monitoring</h3>
              <p style={styles.featureText}>
                Track your pet's vital signs including heart rate, temperature, and activity levels in real time.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📍</div>
              <h3 style={styles.featureTitle}>GPS Tracking</h3>
              <p style={styles.featureText}>
                Never lose your pet again with our precise GPS location tracking.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>📱</div>
              <h3 style={styles.featureTitle}>Mobile Alerts</h3>
              <p style={styles.featureText}>
                Get instant notifications if your pet's health metrics go outside normal ranges.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.statsSection}>
        <div style={styles.container}>
          <div style={styles.statsGrid}>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>10K+</div>
              <div style={styles.statLabel}>Happy Pets</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>24/7</div>
              <div style={styles.statLabel}>Monitoring</div>
            </div>
            <div style={styles.statItem}>
              <div style={styles.statNumber}>99%</div>
              <div style={styles.statLabel}>Accuracy</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={styles.howItWorks}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>How It Works</h2>
          <div style={styles.stepsContainer}>
            <div style={styles.step}>
              <div style={styles.stepNumber}>1</div>
              <div style={styles.stepContent}>
                <h3 style={styles.stepTitle}>Attach the Device</h3>
                <p style={styles.stepText}>
                  Simply attach our lightweight monitoring device to your pet's collar.
                </p>
              </div>
            </div>
            <div style={styles.step}>
              <div style={styles.stepNumber}>2</div>
              <div style={styles.stepContent}>
                <h3 style={styles.stepTitle}>Connect to App</h3>
                <p style={styles.stepText}>
                  Download our mobile app and pair it with your pet's device via Bluetooth.
                </p>
              </div>
            </div>
            <div style={styles.step}>
              <div style={styles.stepNumber}>3</div>
              <div style={styles.stepContent}>
                <h3 style={styles.stepTitle}>Monitor Remotely</h3>
                <p style={styles.stepText}>
                  View all your pet's health metrics and location from anywhere in the world.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

export default Home;