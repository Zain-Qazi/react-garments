import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, query, orderBy, limit, startAfter } from 'firebase/firestore';
import { db } from '../firebase';
import ProductModal from '../components/ProductModal';

// Sort option -> Firestore orderBy
const SORTS = {
    'default': ['createdAt', 'desc'],
    'price-low': ['price', 'asc'],
    'price-high': ['price', 'desc'],
    'name-asc': ['name', 'asc'],
};

export default function Home({ content }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState('default');
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNext, setHasNext] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    // Har page ek baar fetch hota hai, phir yahin cache rehta hai.
    // Previous dabane par Firestore se koi read nahi hoti.
    // Shape: { [pageNumber]: { items, lastDoc, hasNext } }
    const pageCache = useRef({});
    const requestId = useRef(0);

    const fetchPage = async (page) => {
        const cached = pageCache.current[page];
        if (cached) {
            setProducts(cached.items);
            setHasNext(cached.hasNext);
            setCurrentPage(page);
            return;
        }

        const myRequest = ++requestId.current;
        setLoading(true);
        try {
            const [field, dir] = SORTS[sortOrder];
            const constraints = [orderBy(field, dir)];

            if (page > 1) {
                const prev = pageCache.current[page - 1];
                if (!prev?.lastDoc) return;
                constraints.push(startAfter(prev.lastDoc));
            }
            // Ek extra doc mangwa kar pata chalta hai ke agla page maujood hai ya nahi
            constraints.push(limit(itemsPerPage + 1));

            const snapshot = await getDocs(query(collection(db, 'products'), ...constraints));
            if (myRequest !== requestId.current) return; // purani request, ignore

            const hasMore = snapshot.docs.length > itemsPerPage;
            const pageDocs = hasMore ? snapshot.docs.slice(0, itemsPerPage) : snapshot.docs;
            const items = pageDocs.map(d => ({ id: d.id, ...d.data() }));

            pageCache.current[page] = {
                items,
                lastDoc: pageDocs[pageDocs.length - 1] || null,
                hasNext: hasMore,
            };

            setProducts(items);
            setHasNext(hasMore);
            setCurrentPage(page);
            if (page > 1) window.scrollTo({ top: 450, behavior: 'smooth' });
        } catch (err) {
            console.error("Error fetching products from Firestore:", err);
        } finally {
            if (myRequest === requestId.current) setLoading(false);
        }
    };

    // Sort ya items-per-page badle to cache reset karke page 1 dobara lao
    useEffect(() => {
        pageCache.current = {};
        fetchPage(1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemsPerPage, sortOrder]);

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
                            <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
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

                    <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginTop: '20px' }}>
                        <button
                            className="page-btn"
                            onClick={() => fetchPage(currentPage - 1)}
                            disabled={currentPage === 1 || loading}
                        >
                            Previous
                        </button>
                        <span style={{ alignSelf: 'center', fontWeight: 'bold' }}>Page {currentPage}</span>
                        <button
                            className="page-btn"
                            onClick={() => fetchPage(currentPage + 1)}
                            disabled={!hasNext || loading}
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
