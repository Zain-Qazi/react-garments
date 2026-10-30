import React from 'react';

export default function ProductModal({ product, onClose }) {
    if (!product) return null;

    return (
        <div className="modal" style={{ display: 'flex' }} onClick={(e) => { if(e.target.className === 'modal') onClose(); }}>
            <div className="modal-content">
                <span className="close-btn" onClick={onClose}>&times;</span>
                <div className="modal-img-wrapper">
                    <img id="modal-img" src={product.product_img} alt={product.title} />
                </div>
                <div className="modal-details">
                    <h3>{product.title}</h3>
                    <div className="service-price">Rs. {product.price}</div>
                    <p>{product.description}</p>
                </div>
            </div>
        </div>
    );
}
