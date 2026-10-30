import React, { useState, useEffect } from 'react';
import ProductModal from '../components/ProductModal';

export default function Home({ content }) {
    const [services, setServices] = useState([]);
    const [sortOrder, setSortOrder] = useState('default');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {
        fetch('./data.json')
            .then(res => res.json())
            .then(data => setServices(data.services || []))
            .catch(err => console.error("Error fetching data.json:", err));
    }, []);

    // Sorting Logic
    let sortedList = [...services];
    if (sortOrder === 'price-low') {
        sortedList.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortOrder === 'price-high') {
        sortedList.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    } else if (sortOrder === 'name-asc') {
        sortedList.sort((a, b) => a.title.localeCompare(b.title));
    }

    // Pagination Logic
    const totalPages = Math.ceil(sortedList.length / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = sortedList.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div>
            <section className="hero">
                <div className="container hero-content">
                    <h2>{content?.hero_title || 'Discover Elegance & Style'}</h2>
                    <p>{content?.hero_subtitle || 'Explore our exclusive collection of fine garments.'}</p>
                    <a href="#products" className="btn">{content?.cta_text || 'View Collection'}</a>
                </div>
            </section>

            <section id="products" className="section">
                <div className="container">
                    <h2 className="section-title">{content?.services_heading || 'Our Collections'}</h2>
                    
                    <div className="controls-bar">
                        <div className="control-group">
                            <label>Sort By:</label>
                            <select onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}>
                                <option value="default">Default</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="name-asc">Name: A to Z</option>
                            </select>
                        </div>
                        <div className="control-group">
                            <label>Items per page:</label>
                            <select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }}>
                                <option value={6}>6</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                            </select>
                        </div>
                    </div>

                    <div className="services-grid">
                        {currentItems.map((item, index) => (
                            <div key={index} className="service-card" onClick={() => setSelectedProduct(item)} style={{ cursor: 'pointer' }}>
                                <img src={item.product_img} alt={item.title} className="service-img" />
                                <div className="service-info">
                                    <h3>{item.title}</h3>
                                    <div className="service-price">Rs. {item.price}</div>
                                    <p>{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="pagination-container">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                            <button 
                                key={num} 
                                className={`page-btn ${currentPage === num ? 'active' : ''}`}
                                onClick={() => { setCurrentPage(num); window.scrollTo({ top: 450, behavior: 'smooth' }); }}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
        </div>
    );
}
