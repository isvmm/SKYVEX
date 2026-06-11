import React from 'react';
import { Trash2, Edit } from 'lucide-react';

const ProductTable = ({ products, apiBase, handleEditClick, handleDelete }) => {
  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Thumbnail</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Attributes</th>
              <th style={{ width: '120px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  No products added yet. Click "Add Product" to get started.
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const displayImg = p.images && p.images.length > 0
                  ? (p.images[0].startsWith('http') ? p.images[0] : `${apiBase.replace('/api', '')}${p.images[0]}`)
                  : 'https://placehold.co/80x80?text=No+Img';

                return (
                  <tr key={p.id}>
                    <td>
                      <img 
                        src={displayImg} 
                        alt={p.name} 
                        style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                      />
                    </td>
                    <td>
                      <div>
                        <div style={{ fontWeight: 600 }}>{p.name}</div>
                        {p.discountPrice && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--success)' }}>
                            Discount: ₹{p.price - p.discountPrice} OFF
                          </div>
                        )}
                      </div>
                    </td>
                    <td>{p.category ? p.category.name : 'Uncategorized'}</td>
                    <td>
                      {p.discountPrice ? (
                        <div>
                          <span style={{ fontWeight: 600 }}>₹{p.discountPrice}</span>{' '}
                          <span style={{ fontSize: '0.8rem', textDecoration: 'line-through', color: 'var(--text-secondary)' }}>
                            ₹{p.price}
                          </span>
                        </div>
                      ) : (
                        <span style={{ fontWeight: 600 }}>₹{p.price}</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${p.stock <= 5 ? 'badge-danger' : 'badge-success'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                        {p.isBestSeller && <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Best Seller</span>}
                        {p.isNewArrival && <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>New Arrival</span>}
                        <span className="badge badge-secondary" style={{ fontSize: '0.65rem', background: '#334155' }}>
                          {p.sizes ? p.sizes.join(',') : ''}
                        </span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                        <button 
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '0.35rem' }}
                          onClick={() => handleEditClick(p)}
                        >
                          <Edit style={{ width: 14, height: 14 }} />
                        </button>
                        <button 
                          className="btn btn-danger btn-sm"
                          style={{ padding: '0.35rem' }}
                          onClick={() => handleDelete(p.id, p.name)}
                        >
                          <Trash2 style={{ width: 14, height: 14 }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductTable;
