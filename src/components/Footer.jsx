import React from 'react';

export default function Footer({ footerText }) {
    return (
        <footer className="footer">
            <div className="container footer-content">
                <p>{footerText || '© 2026 Taiba Garments. All rights reserved.'}</p>
            </div>
        </footer>
    );
}