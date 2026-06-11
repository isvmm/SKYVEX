import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ProductForm from './components/ProductForm';
import ProductTable from './components/ProductTable';

const ProductManager = ({ apiBase }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [discountPrice, setDiscountPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [selectedSizes, setSelectedSizes] = useState(['S', 'M', 'L', 'XL']);
  const [selectedColors, setSelectedColors] = useState([]);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isNewArrival, setIsNewArrival] = useState(false);
  
  // Image states
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [existingImagesList, setExistingImagesList] = useState([]); // Images kept when editing

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${apiBase}/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${apiBase}/categories`);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const triggerAlert = (type, message) => {
    setAlert({ type, message });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setAlert(null), 4000);
  };

  const handleImageFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setNewImageFiles(prev => [...prev, ...files]);
    
    const previews = files.map(file => URL.createObjectURL(file));
    setNewPreviews(prev => [...prev, ...previews]);
  };

  const removeNewImage = (index) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setNewPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImagesList(prev => prev.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setDiscountPrice('');
    setStock('');
    setCategoryId('');
    setSelectedSizes(['S', 'M', 'L', 'XL']);
    setSelectedColors([]);
    setIsBestSeller(false);
    setIsNewArrival(false);
    setNewImageFiles([]);
    setNewPreviews([]);
    setExistingImagesList([]);
    setEditMode(false);
    setEditId(null);
    setShowForm(false);
  };

  const handleSizeToggle = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const handleColorToggle = (color) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const handleEditClick = (p) => {
    setEditMode(true);
    setEditId(p.id);
    setName(p.name);
    setDescription(p.description || '');
    setPrice(p.price);
    setDiscountPrice(p.discountPrice || '');
    setStock(p.stock);
    setCategoryId(p.categoryId);
    setSelectedSizes(p.sizes || []);
    setSelectedColors(p.colors || []);
    setIsBestSeller(p.isBestSeller || false);
    setIsNewArrival(p.isNewArrival || false);
    setExistingImagesList(p.images || []);
    setNewImageFiles([]);
    setNewPreviews([]);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !price || !categoryId) {
      triggerAlert('error', 'Please fill in Name, Price, and Category.');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('discountPrice', discountPrice);
      formData.append('stock', stock);
      formData.append('categoryId', categoryId);
      formData.append('isBestSeller', isBestSeller);
      formData.append('isNewArrival', isNewArrival);

      // Append arrays as JSON strings
      formData.append('sizes', JSON.stringify(selectedSizes));
      formData.append('colors', JSON.stringify(selectedColors));

      if (editMode) {
        formData.append('existingImages', JSON.stringify(existingImagesList));
      }

      // Append new file uploads
      newImageFiles.forEach((file) => {
        formData.append('images', file);
      });

      const url = editMode ? `${apiBase}/products/${editId}` : `${apiBase}/products`;
      const method = editMode ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        triggerAlert('success', `Product "${data.name}" ${editMode ? 'updated' : 'added'} successfully!`);
        resetForm();
        fetchProducts();
      } else {
        triggerAlert('error', data.message || 'Error processing request');
      }
    } catch (err) {
      console.error('Error submitting product:', err);
      triggerAlert('error', 'Network error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, prodName) => {
    if (!window.confirm(`Are you sure you want to delete "${prodName}"?`)) return;

    try {
      const res = await fetch(`${apiBase}/products/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        triggerAlert('success', `Product "${prodName}" deleted.`);
        fetchProducts();
      } else {
        const data = await res.json();
        triggerAlert('error', data.message || 'Error deleting product');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      triggerAlert('error', 'Network error.');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Products ({products.length})</h2>
        <button className="btn btn-primary btn-sm" onClick={() => { showForm ? resetForm() : setShowForm(true) }}>
          <Plus style={{ width: 16, height: 16 }} />
          {showForm ? 'Cancel' : 'Add Product'}
        </button>
      </div>

      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <ProductForm
          handleSubmit={handleSubmit}
          editMode={editMode}
          name={name}
          setName={setName}
          categoryId={categoryId}
          setCategoryId={setCategoryId}
          categories={categories}
          price={price}
          setPrice={setPrice}
          discountPrice={discountPrice}
          setDiscountPrice={setDiscountPrice}
          stock={stock}
          setStock={setStock}
          isBestSeller={isBestSeller}
          setIsBestSeller={setIsBestSeller}
          isNewArrival={isNewArrival}
          setIsNewArrival={setIsNewArrival}
          selectedSizes={selectedSizes}
          handleSizeToggle={handleSizeToggle}
          selectedColors={selectedColors}
          handleColorToggle={handleColorToggle}
          description={description}
          setDescription={setDescription}
          handleImageFileChange={handleImageFileChange}
          existingImagesList={existingImagesList}
          removeExistingImage={removeExistingImage}
          newPreviews={newPreviews}
          removeNewImage={removeNewImage}
          loading={loading}
          resetForm={resetForm}
          apiBase={apiBase}
        />
      )}

      {/* Products Table list */}
      <ProductTable
        products={products}
        apiBase={apiBase}
        handleEditClick={handleEditClick}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default ProductManager;
