const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const { upload } = require('../config/cloudinary');

// Helper to get slug from name
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
};

// GET all categories
router.get('/', async (req, res) => {
  try {
    const categories = await Category.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET single category by ID or slug
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    let category;
    
    // Check if UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (uuidRegex.test(idOrSlug)) {
      category = await Category.findByPk(idOrSlug);
    } else {
      category = await Category.findOne({ where: { slug: idOrSlug } });
    }

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST create category (Admin only)
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: 'Category name is required' });
    }

    const slug = slugify(name);

    // Check if category name/slug already exists
    const existing = await Category.findOne({ where: { slug } });
    if (existing) {
      return res.status(400).json({ message: 'Category name already exists' });
    }

    let imageUrl = '';
    if (req.file) {
      imageUrl = req.file.path.startsWith('http') 
        ? req.file.path 
        : `/uploads/${req.file.filename}`;
    }

    const category = await Category.create({
      name,
      slug,
      image: imageUrl
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT update category (Admin only)
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    if (name) {
      category.name = name;
      category.slug = slugify(name);
    }

    if (req.file) {
      category.image = req.file.path.startsWith('http') 
        ? req.file.path 
        : `/uploads/${req.file.filename}`;
    }

    await category.save();
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE category (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await category.destroy();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
