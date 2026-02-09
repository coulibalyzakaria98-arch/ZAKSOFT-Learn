
import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>&copy; 2023 Zaksoft Learn. Tous droits réservés.</p>
    </footer>
  );
};

const styles = {
  footer: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    textAlign: 'center',
    padding: '1rem 0',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
};

export default Footer;
