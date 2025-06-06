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
      transition: 'all 0.3s ease'
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
      display: 'flex',
      flexDirection: 'column'
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
      lineHeight: '1.6',
      flexGrow: '1'
    },
    featureButton: {
      marginTop: '20px',
      padding: '10px 20px',
      backgroundColor: '#6e8efb',
      color: 'white',
      border: 'none',
      borderRadius: '30px',
      cursor: 'pointer',
      fontWeight: '600',
      transition: 'all 0.3s ease',
      textDecoration: 'none',
      display: 'inline-block',
      textAlign: 'center'
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
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🐾</div>
              <h3 style={styles.featureTitle}>Adoption Portal</h3>
              <p style={styles.featureText}>
                Find your perfect furry friend through our easy-to-use adoption portal.
              </p>
              <Link to="/adoption-portal" style={styles.featureButton}>Explore Adoption</Link>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>✂️</div>
              <h3 style={styles.featureTitle}>Grooming & Veterinary Appointment</h3>
              <p style={styles.featureText}>
                Schedule grooming and veterinary appointments conveniently through our platform.
              </p>
              <Link to="/appointments" style={styles.featureButton}>Book Appointment</Link>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>💊</div>
              <h3 style={styles.featureTitle}>Medicine Records Management</h3>
              <p style={styles.featureText}>
                Keep track of your pet's medication and health records all in one place.
              </p>
              <Link to="/pet" style={styles.featureButton}>Manage Records</Link>
            </div>
          </div>
          <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🤖</div>
              <h3 style={styles.featureTitle}>AI Pet Training</h3>
              <p style={styles.featureText}>
                Our AI-powered training system helps teach your pet commands and track progress with personalized lessons.
              </p>
              <Link to="/petTrainingForm" style={styles.featureButton}>Try Pet Trainer</Link>
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
                <h3 style={styles.stepTitle}>Monitor & Train</h3>
                <p style={styles.stepText}>
                  View all your pet's health metrics and use our AI trainer to teach new commands.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section style={{ ...styles.featuresSection, background: '#f4f6fc' }}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>Why Choose Our System?</h2>
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🔒</div>
              <h3 style={styles.featureTitle}>Secure & Private</h3>
              <p style={styles.featureText}>
                Your pet's data is encrypted and stored securely in the cloud.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🧠</div>
              <h3 style={styles.featureTitle}>AI Powered Insights</h3>
              <p style={styles.featureText}>
                Get personalized suggestions based on your pet's health trends and behavior patterns.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🔧</div>
              <h3 style={styles.featureTitle}>Easy Setup</h3>
              <p style={styles.featureText}>
                Plug and play. No complex configurations. Works out of the box.
              </p>
            </div>
            <div style={styles.featureCard} >
              <div style={styles.featureIcon}>🎓</div>
              <h3 style={styles.featureTitle}>Smart Training</h3>
              <p style={styles.featureText}>
                Our AI adapts to your pet's learning style for faster, more effective training.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🐾</div>
              <h3 style={styles.featureTitle}>Comprehensive Adoption Portal</h3>
              <p style={styles.featureText}>
                Easily find and adopt pets through our integrated adoption platform, connecting loving homes with pets in need.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>✂️</div>
              <h3 style={styles.featureTitle}>Convenient Grooming & Veterinary Appointments</h3>
              <p style={styles.featureText}>
                Schedule and manage grooming and veterinary visits seamlessly to keep your pet healthy and happy.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>💊</div>
              <h3 style={styles.featureTitle}>Efficient Medicine Records Management</h3>
              <p style={styles.featureText}>
                Keep all your pet’s medication and health records organized and accessible in one place.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🤖</div>
              <h3 style={styles.featureTitle}>AI Pet Training</h3>
              <p style={styles.featureText}>
                Our AI-powered training system helps teach your pet commands and track progress with personalized lessons.
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureIcon}>🛒</div>
              <h3 style={styles.featureTitle}>Integrated Pet Shopping</h3>
              <p style={styles.featureText}>
                Browse and purchase pet supplies easily through our built-in shopping platform.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section style={styles.featuresSection}>
        <div style={styles.container}>
          <h2 style={styles.sectionTitle}>What Pet Owners Say</h2>
          <div style={styles.featuresGrid}>
            <div style={styles.featureCard}>
              <p style={{ ...styles.featureText, fontStyle: 'italic' }}>
                "This system helped detect early signs of fever in my dog. It probably saved his life!"
              </p>
              <h4 style={{ marginTop: '15px', color: '#333' }}>– Samantha, Dog Owner</h4>
            </div>
            <div style={styles.featureCard}>
              <p style={{ ...styles.featureText, fontStyle: 'italic' }}>
                "The AI trainer taught my stubborn terrier to sit in just 3 days - something I couldn't do in months!"
              </p>
              <h4 style={{ marginTop: '15px', color: '#333' }}>– Michael, Dog Owner</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ ...styles.header, background: 'linear-gradient(135deg, #43cea2, #185a9d)' }}>
        <div style={styles.container}>
          <h2 style={styles.headerTitle}>Join Thousands of Pet Owners Today!</h2>
          <p style={styles.headerSubtitle}>
            Experience smart, stress-free pet care and training. Get started with our AI-powered monitoring system.
          </p>
          <Link to="/pet" style={styles.ctaButton}>Start Monitoring</Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
