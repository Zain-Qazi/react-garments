import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';

export default function App() {
    const [data, setData] = useState(null);
    const [currentPage, setCurrentPage] = useState('home');
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        // Sirf aik file fetch hogi jo company aur pages dono ka data rakhegi
        fetch('./pages-content.json')
            .then(res => {
                if (!res.ok) throw new Error('Failed to load pages-content.json');
                return res.json();
            })
            .then(setData)
            .catch(err => console.error("Error fetching content:", err));
    }, []);

    useEffect(() => {
        if (!data) return;
        const titleMap = {
            home: data.home?.meta_title || 'Taiba Garments',
            about: data.about?.meta_title || 'About Us - Taiba Garments',
            contact: data.contact?.meta_title || 'Contact Us - Taiba Garments',
            privacy: data.privacy?.meta_title || 'Privacy Policy - Taiba Garments'
        };
        document.title = titleMap[currentPage] || 'Taiba Garments';
    }, [currentPage, data]);

    // Jab tak data load ho raha hai
    if (!data) {
        return <div className="loading-screen" style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;
    }

    const company = data.company || {};
    const pagesContent = data;

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