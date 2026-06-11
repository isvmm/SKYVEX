import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import CategoryForm from './components/CategoryForm';
import CategoryTable from './components/CategoryTable';

const CategoryManager = ({ apiBase }) => {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${apiBase}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const triggerAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      if (image) {
        formData.append('image', image);
      }

      const res = await fetch(`${apiBase}/categories`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        triggerAlert('success', `Category "${data.name}" added successfully!`);
        setName('');
        setImage(null);
        setPreview('');
        setShowAddForm(false);
        fetchCategories();
      } else {
        triggerAlert('error', data.message || 'Error creating category');
      }
    } catch (err) {
      console.error('Error adding category:', err);
      triggerAlert('error', 'Network error occurred while adding category.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, catName) => {
    if (!window.confirm(`Are you sure you want to delete the category "${catName}"?`)) return;

    try {
      const res = await fetch(`${apiBase}/categories/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        triggerAlert('success', `Category "${catName}" deleted.`);
        fetchCategories();
      } else {
        const data = await res.json();
        triggerAlert('error', data.message || 'Error deleting category');
      }
    } catch (err) {
      console.error('Error deleting category:', err);
      triggerAlert('error', 'Network error occurred.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Categories ({categories.length})</h2>
        <button className="btn btn-primary btn-sm" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus style={{ width: 16, height: 16 }} />
          {showAddForm ? 'Cancel' : 'Add Category'}
        </button>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      {/* Add Category Form */}
      {showAddForm && (
        <CategoryForm
          handleSubmit={handleSubmit}
          name={name}
          setName={setName}
          image={image}
          setImage={setImage}
          preview={preview}
          setPreview={setPreview}
          handleImageChange={handleImageChange}
          loading={loading}
          setShowAddForm={setShowAddForm}
        />
      )}

      {/* Categories List */}
      <CategoryTable
        categories={categories}
        apiBase={apiBase}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default CategoryManager;
