import React from 'react';

export default function ProductModal({ product, onClose }) {
    console.log("Product Data received in Modal:", product);

    if (!product) return null;

    // Database ya array se image uthana
    let rawImg = Array.isArray(product.images) && product.images.length > 0 
        ? product.images[0] 
        : (product.image || product.img || '');

    // Agar URL ke gird ghalti se quotes save ho gaye hain toh unhein remove karna
    const imageUrl = typeof rawImg === 'string' 
        ? rawImg.replace(/^["']+|["']+$/g, '').trim() 
        : 'https://via.placeholder.com/300';

    return (
        <div className="modal" style={{ display: 'flex' }} onClick={(e) => { if(e.target.className === 'modal') onClose(); }}>
            <div className="modal-content">
                <span className="close-btn" onClick={onClose}>&times;</span>
                <div className="modal-img-wrapper">
                    <img id="modal-img" src={imageUrl} alt={product.title || product.name} />
                </div>
                <div className="modal-details">
                    <h3>{product.title || product.name}</h3>
                    <div className="service-price">Rs. {product.price}</div>
                    <p>{product.description}</p>
                </div>
            </div>
        </div>
    );
}