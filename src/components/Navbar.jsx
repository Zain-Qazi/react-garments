import React, { useState } from 'react';

export default function Navbar({ brandName, currentPage, setCurrentPage, darkMode, setDarkMode }) {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <header className="navbar">
            <div className="container nav-container">
                <h1 className="logo" onClick={() => { setCurrentPage('home'); setMenuOpen(false); }} style={{ cursor: 'pointer' }}>
                    {brandName || 'Taiba Garments'}
                </h1>
                
                <div className="nav-right-area">
                    <nav>
                        <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
                            <li>
                                <a 
                                    href="#home" 
                                    className={currentPage === 'home' ? 'active' : ''} 
                                    onClick={(e) => { e.preventDefault(); setCurrentPage('home'); setMenuOpen(false); }}
                                >
                                    Home
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="#about" 
                                    className={currentPage === 'about' ? 'active' : ''} 
                                    onClick={(e) => { e.preventDefault(); setCurrentPage('about'); setMenuOpen(false); }}
                                >
                                    About Us
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="#contact" 
                                    className={currentPage === 'contact' ? 'active' : ''} 
                                    onClick={(e) => { e.preventDefault(); setCurrentPage('contact'); setMenuOpen(false); }}
                                >
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a 
                                    href="#privacy" 
                                    className={currentPage === 'privacy' ? 'active' : ''} 
                                    onClick={(e) => { e.preventDefault(); setCurrentPage('privacy'); setMenuOpen(false); }}
                                >
                                    Privacy Policy
                                </a>
                            </li>
                        </ul>
                    </nav>

                    {/* Professional SVG Theme Toggle Button */}
                    <button 
                        className="theme-toggle-btn" 
                        onClick={() => setDarkMode(!darkMode)}
                        title="Toggle Theme"
                    >
                        {darkMode ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5"></circle>
                                <line x1="12" y1="1" x2="12" y2="3"></line>
                                <line x1="12" y1="21" x2="12" y2="23"></line>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                <line x1="1" y1="12" x2="3" y2="12"></line>
                                <line x1="21" y1="12" x2="23" y2="12"></line>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                            </svg>
                        )}
                    </button>

                    {/* Mobile Menu Toggle */}
                    <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                        <span className="bar"></span>
                        <span className="bar"></span>
                        <span className="bar"></span>
                    </div>
                </div>
            </div>
        </header>
    );
}