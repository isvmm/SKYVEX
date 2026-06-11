import React from 'react';
import { Trash2 } from 'lucide-react';

const CategoryTable = ({ categories, apiBase, handleDelete }) => {
  return (
    <div className="table-card">
      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th style={{ width: '80px' }}>Image</th>
              <th>Name</th>
              <th>Slug</th>
              <th>Created At</th>
              <th style={{ width: '100px', textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                  No categories created yet. Click "Add Category" to get started.
                </td>
              </tr>
            ) : (
              categories.map((cat) => {
                const displayImg = cat.image 
                  ? (cat.image.startsWith('http') ? cat.image : `${apiBase.replace('/api', '')}${cat.image}`)
                  : 'https://placehold.co/80x80?text=No+Img';
                
                return (
                  <tr key={cat.id}>
                    <td>
                      <img 
                        src={displayImg} 
                        alt={cat.name} 
                        style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '50%', border: '1px solid var(--border-color)' }}
                      />
                    </td>
                    <td style={{ fontWeight: 600 }}>{cat.name}</td>
                    <td><code>{cat.slug}</code></td>
                    <td>{new Date(cat.createdAt).toLocaleDateString()}</td>
                    <td style={{ textAlign: 'center' }}>
                      <button 
                        className="btn btn-danger btn-sm"
                        style={{ padding: '0.35rem' }}
                        onClick={() => handleDelete(cat.id, cat.name)}
                      >
                        <Trash2 style={{ width: 14, height: 14 }} />
                      </button>
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

export default CategoryTable;
