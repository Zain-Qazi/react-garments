import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';

export default function App() {
    const [company, setCompany] = useState({});
    const [pagesContent, setPagesContent] = useState({});
    const [currentPage, setCurrentPage] = useState('home');
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        fetch('./company.json')
            .then(res => res.json())
            .then(setCompany)
            .catch(err => console.error("Error fetching company.json:", err));

        fetch('./pages-content.json')
            .then(res => res.json())
            .then(setPagesContent)
            .catch(err => console.error("Error fetching pages-content.json:", err));
    }, []);

    useEffect(() => {
        const titleMap = {
            home: pagesContent.home?.meta_title || 'Taiba Garments',
            about: pagesContent.about?.meta_title || 'About Us - Taiba Garments',
            contact: pagesContent.contact?.meta_title || 'Contact Us - Taiba Garments',
            privacy: pagesContent.privacy?.meta_title || 'Privacy Policy - Taiba Garments'
        };
        document.title = titleMap[currentPage] || 'Taiba Garments';
    }, [currentPage, pagesContent]);

    return (
        <div className={`app-container ${darkMode ? 'dark-theme' : 'light-theme'}`}>
            <Navbar 
                brandName={company.business_name} 
                currentPage={currentPage} 
                setCurrentPage={setCurrentPage} 
                darkMode={darkMode} 
                setDarkMode={setDarkMode} 
            />
            
            <main>
                {currentPage === 'home' && <Home content={pagesContent.home} darkMode={darkMode} />}
                {currentPage === 'about' && (
                    <div className="section container">
                        <h2 className="section-title">{pagesContent.about?.heading || 'About Us'}</h2>
                        <p className="page-text">{pagesContent.about?.body}</p>
                    </div>
                )}
                {currentPage === 'contact' && (
                    <div className="section container">
                        <h2 className="section-title">{pagesContent.contact?.heading || 'Contact Us'}</h2>
                        <p className="page-text">{pagesContent.contact?.subheading}</p>
                        <div className="contact-box">
                            <p><strong>Phone:</strong> {company.phone}</p>
                            <p><strong>Email:</strong> {company.email}</p>
                            <p><strong>Address:</strong> {company.address}, {company.country}</p>
                        </div>
                    </div>
                )}
                {currentPage === 'privacy' && (
                    <div className="section container">
                        <h2 className="section-title">{pagesContent.privacy?.heading || 'Privacy Policy'}</h2>
                        {pagesContent.privacy?.last_updated && (
                            <p className="last-updated">Last Updated: {pagesContent.privacy.last_updated}</p>
                        )}
                        <p className="page-text">{pagesContent.privacy?.body}</p>
                    </div>
                )}
            </main>

            <Footer footerText={pagesContent.home?.footer_text} />
        </div>
    );
}