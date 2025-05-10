import React from 'react';
import NemalPic from './pic/Nemal.jpg';
import YasiduPic from './pic/Yasidu.JPG';
import AdrielPic from './pic/Adriel.JPG';
import SurathPic from './pic/Surath.jpeg';
import RandimalPic from './pic/Randimal.JPG';

const teamMembers = [
  { name: 'Asesh Nemal', role: 'Developer / Designer', image: NemalPic, linkedin: 'http://linkedin.com/in/asesh-nemal-a0a520248' },
  { name: 'Yasindu Rasanga', role: 'Developer / Designer', image: YasiduPic, linkedin: 'http://linkedin.com/in/yasindu-rasanga-karawita-481549247' },
  { name: 'Adriel Damian', role: 'Developer / Designer', image: AdrielPic, linkedin: 'http://linkedin.com/in/adriel-perera-5a9730362' },
  { name: 'Surath Gayanatha', role: 'Developer / Designer', image: SurathPic, linkedin: 'http://linkedin.com/in/surath-gayanatha-081362335' },
  { name: 'Randimal Lamahewa', role: 'Developer / Designer', image: RandimalPic, linkedin: 'http://linkedin.com/in/randimal-lamahewa-153483271' }
];


const AboutUs = () => {
  return (
    <section id="about-us" style={{ padding: '80px 20px', background: '#f5f7fa', textAlign: 'center' }}>
      <div style={styles.container}>
        <h2 style={styles.sectionTitle}>About Us</h2>

        <p style={styles.headerSubtitle}>
          We're a student-led innovation team building a comprehensive pet care and tracking system,
          combining smart IoT devices with AI-powered health insights to improve the lives of pets and their owners.
        </p>

        {/* Mission */}
        <div style={styles.block}>
          <h3 style={styles.subTitle}>Our Mission</h3>
          <p style={styles.text}>
            To revolutionize pet care through intelligent technology that tracks, monitors, and supports the health and well-being of pets in real-time — making life easier and healthier for both pets and pet parents.
          </p>
        </div>

        {/* History */}
        <div style={styles.block}>
          <h3 style={styles.subTitle}>How It Started</h3>
          <p style={styles.text}>
            This project began as part of our academic journey at SLIIT. Inspired by the gaps in existing pet health monitoring solutions,
            we set out to build something that was not only smart and useful — but truly life-enhancing for pets and their owners.
          </p>
        </div>

        {/* Key Features */}
        <div style={styles.block}>
          <h3 style={styles.subTitle}>Key Features</h3>
          <ul style={styles.list}>
            <li>📍 Live GPS tracking and geofencing for pet safety</li>
            <li>❤️ Real-time health monitoring (heart rate, temperature, activity)</li>
            <li>🤖 AI-powered chatbot for symptom checking and support</li>
            <li>🗓️ Vet appointment scheduling and health record keeping</li>
            <li>🛍️ Integrated pet store and medication tracker</li>
          </ul>
        </div>

        {/* Team */}
        <div style={styles.block}>
          <h3 style={styles.subTitle}>Meet the Team</h3>
          <div style={styles.teamGrid}>
            {teamMembers.map((member, idx) => (
              <a key={idx} href={member.linkedin} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                <div style={styles.teamCard}>
                  <img src={member.image} alt={member.name} style={styles.avatar} />
                  <p style={styles.memberName}>{member.name}</p>
                  <p style={styles.role}>{member.role}</p>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Quote */}
        <div style={styles.quoteBox}>
          <blockquote style={styles.quote}>
            "Until one has loved an animal, a part of one’s soul remains unawakened."
          </blockquote>
          <cite style={styles.cite}>– Anatole France</cite>
        </div>
      </div>
    </section>
  );
};

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '0 20px'
  },
  sectionTitle: {
    fontSize: '2.8rem',
    fontWeight: '700',
    color: '#333',
    marginBottom: '30px'
  },
  headerSubtitle: {
    fontSize: '1.2rem',
    color: '#555',
    maxWidth: '800px',
    margin: '0 auto 50px auto'
  },
  block: {
    marginBottom: '50px',
    textAlign: 'left'
  },
  subTitle: {
    fontSize: '1.8rem',
    color: '#6e8efb',
    marginBottom: '10px'
  },
  text: {
    fontSize: '1rem',
    color: '#444',
    lineHeight: '1.7'
  },
  list: {
    textAlign: 'left',
    paddingLeft: '20px',
    fontSize: '1rem',
    color: '#444',
    lineHeight: '1.8'
  },
  teamGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
    gap: '20px',
    marginTop: '30px'
  },
  teamCard: {
    background: '#fff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    textAlign: 'center'
  },
  avatar: {
    width: '70px',
    height: '70px',
    borderRadius: '50%',
    objectFit: 'cover',
    margin: '0 auto 10px'
  },
  memberName: {
    fontWeight: '600',
    fontSize: '1rem',
    color: '#333'
  },
  role: {
    fontSize: '0.9rem',
    color: '#777'
  },
  quoteBox: {
    marginTop: '60px',
    backgroundColor: '#e3eaf4',
    padding: '30px',
    borderRadius: '12px',
    textAlign: 'center'
  },
  quote: {
    fontStyle: 'italic',
    fontSize: '1.2rem',
    color: '#444'
  },
  cite: {
    display: 'block',
    marginTop: '10px',
    color: '#666',
    fontSize: '0.9rem'
  }
};

export default AboutUs;
