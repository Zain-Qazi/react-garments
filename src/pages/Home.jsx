import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit, startAfter, endBefore, limitToLast } from 'firebase/firestore';
import { db } from '../firebase'; // Apne firebase setup ka path check kar lein
import ProductModal from '../components/ProductModal';

export default function Home({ content }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('default');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [lastVisible, setLastVisible] = useState(null);
    const [firstVisible, setFirstVisible] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Initial Data Fetch & Items Per Page / Sort Change handler
    useEffect(() => {
        fetchFirstPage();
    }, [itemsPerPage, sortOrder]);

    const fetchFirstPage = async () => {
        setLoading(true);
        try {
            let q = collection(db, 'products');

            // Sorting logic based on Firestore fields
            if (sortOrder === 'price-low') {
                q = query(collection(db, 'products'), orderBy('price', 'asc'), limit(itemsPerPage));
            } else if (sortOrder === 'price-high') {
                q = query(collection(db, 'products'), orderBy('price', 'desc'), limit(itemsPerPage));
            } else if (sortOrder === 'name-asc') {
                q = query(collection(db, 'products'), orderBy('name', 'asc'), limit(itemsPerPage));
            } else {
                // Default sorting by creation date
                q = query(collection(db, 'products'), orderBy('createdAt', 'desc'), limit(itemsPerPage));
            }

            const snapshot = await getDocs(q);
            const productList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            setProducts(productList);
            setFirstVisible(snapshot.docs[0] || null);
            setLastVisible(snapshot.docs[snapshot.docs.length - 1] || null);
            setCurrentPage(1);
        } catch (err) {
            console.error("Error fetching products from Firestore:", err);
        } finally {
            setLoading(false);
        }
    };

    // Handler for Next Page (Database Side Paging)
    const handleNextPage = async () => {
        if (!lastVisible) return;
        setLoading(true);
        try {
            let q = query(
                collection(db, 'products'),
                orderBy('createdAt', 'desc'),
                startAfter(lastVisible),
                limit(itemsPerPage)
            );

            if (sortOrder === 'price-low') {
                q = query(collection(db, 'products'), orderBy('price', 'asc'), startAfter(lastVisible), limit(itemsPerPage));
            } else if (sortOrder === 'price-high') {
                q = query(collection(db, 'products'), orderBy('price', 'desc'), startAfter(lastVisible), limit(itemsPerPage));
            } else if (sortOrder === 'name-asc') {
                q = query(collection(db, 'products'), orderBy('name', 'asc'), startAfter(lastVisible), limit(itemsPerPage));
            }

            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                const productList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProducts(productList);
                setFirstVisible(snapshot.docs[0]);
                setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
                setCurrentPage(prev => prev + 1);
                window.scrollTo({ top: 450, behavior: 'smooth' });
            }
        } catch (err) {
            console.error("Error fetching next page:", err);
        } finally {
            setLoading(false);
        }
    };

    // Handler for Previous Page
    const handlePrevPage = async () => {
        if (currentPage <= 1 || !firstVisible) return;
        setLoading(true);
        try {
            let q = query(
                collection(db, 'products'),
                orderBy('createdAt', 'desc'),
                endBefore(firstVisible),
                limitToLast(itemsPerPage)
            );

            if (sortOrder === 'price-low') {
                q = query(collection(db, 'products'), orderBy('price', 'asc'), endBefore(firstVisible), limitToLast(itemsPerPage));
            } else if (sortOrder === 'price-high') {
                q = query(collection(db, 'products'), orderBy('price', 'desc'), endBefore(firstVisible), limitToLast(itemsPerPage));
            } else if (sortOrder === 'name-asc') {
                q = query(collection(db, 'products'), orderBy('name', 'asc'), endBefore(firstVisible), limitToLast(itemsPerPage));
            }

            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                const productList = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setProducts(productList);
                setFirstVisible(snapshot.docs[0]);
                setLastVisible(snapshot.docs[snapshot.docs.length - 1]);
                setCurrentPage(prev => prev - 1);
                window.scrollTo({ top: 450, behavior: 'smooth' });
            }
        } catch (err) {
            console.error("Error fetching previous page:", err);
        } finally {
            setLoading(false);
        }
    };

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
                            <select onChange={(e) => setSortOrder(e.target.value)}>
                                <option value="default">Default</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="name-asc">Name: A to Z</option>
                            </select>
                        </div>
                        <div className="control-group">
                            <label>Items per page:</label>
                            <select value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
                                <option value={6}>6</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                                <option value={20}>20</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <p style={{ textAlign: 'center', padding: '40px' }}>Loading products from database...</p>
                    ) : (
                        <div className="services-grid">
                            {products.length === 0 ? (
                                <p>No products found in database.</p>
                            ) : (
                                products.map((item) => {
                                    // Database URL ke extra quotes remove karne ke liye cleaning logic
                                    let rawImg = item.images?.[0] || item.product_img || '';
                                    let cardImgUrl = typeof rawImg === 'string' 
                                        ? rawImg.replace(/^["']+|["']+$/g, '').trim() 
                                        : 'placeholder.jpg';

                                    return (
                                        <div key={item.id} className="service-card" onClick={() => setSelectedProduct(item)} style={{ cursor: 'pointer' }}>
                                            <img 
                                                src={cardImgUrl} 
                                                alt={item.name || item.title} 
                                                className="service-img" 
                                            />
                                            <div className="service-info">
                                                <h3>{item.name || item.title}</h3>
                                                <div className="service-price">Rs. {item.price}</div>
                                                <p>{item.description}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    )}

                    {/* Database Pagination Next / Prev Controls */}
                    <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
                        <button 
                            className="page-btn" 
                            onClick={handlePrevPage} 
                            disabled={currentPage === 1 || loading}
                        >
                            Previous
                        </button>
                        <span style={{ alignSelf: 'center', fontWeight: 'bold' }}>Page {currentPage}</span>
                        <button 
                            className="page-btn" 
                            onClick={handleNextPage} 
                            disabled={products.length < itemsPerPage || loading}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </section>

            {selectedProduct && (
                <ProductModal 
                    product={selectedProduct} 
                    onClose={() => setSelectedProduct(null)} 
                />
            )}
        </div>
    );
}