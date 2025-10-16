import React from 'react';

const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 24px',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #e0e0e0',
};

const logoStyle: React.CSSProperties = {
    height: 40,
    width: 40,
    marginRight: 16,
};

const titleStyle: React.CSSProperties = {
    fontSize: 24,
    fontWeight: 600,
    color: '#333',
    letterSpacing: 1,
};

const Header: React.FC = () => (
    <header style={{ ...headerStyle, marginBottom: 18 }}>
        <img src="assets/IconOfficeJS.png" alt="ChartPanda Logo" style={logoStyle} />
        <span style={titleStyle}>ChartPanda</span>
    </header>
);

export default Header;