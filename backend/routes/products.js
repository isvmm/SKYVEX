const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Category = require('../models/Category');
const { upload } = require('../config/cloudinary');
const { Op } = require('sequelize');

// GET all products with optional filters
router.get('/', async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, sort, isBestSeller, isNewArrival } = req.query;
    const whereClause = {};

    // Filter by category slug or ID
    if (category) {
      const cat = await Category.findOne({
        where: {
          [Op.or]: [{ id: category }, { slug: category }]
        }
      });
      if (cat) {
        whereClause.categoryId = cat.id;
      } else {
        // Category requested but not found, return empty results
        return res.json([]);
      }
    }

    // Filter by search query (name or description)
    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike || Op.like]: `%${search}%` } },
        { description: { [Op.iLike || Op.like]: `%${search}%` } }
      ];
    }

    // Filter by price range
    if (minPrice || maxPrice) {
      whereClause.price = {};
      if (minPrice) whereClause.price[Op.gte] = parseFloat(minPrice);
      if (maxPrice) whereClause.price[Op.lte] = parseFloat(maxPrice);
    }

    // Filter by special flags
    if (isBestSeller === 'true') {
      whereClause.isBestSeller = true;
    }
    if (isNewArrival === 'true') {
      whereClause.isNewArrival = true;
    }

    // Sorting
    let order = [['createdAt', 'DESC']];
    if (sort) {
      if (sort === 'price_low') order = [['price', 'ASC']];
      else if (sort === 'price_high') order = [['price', 'DESC']];
      else if (sort === 'rating') order = [['createdAt', 'DESC']]; // Fallback to new since rating isn't implemented
    }

    const products = await Product.findAll({
      where: whereClause,
      include: [{ model: Category, as: 'category', attributes: ['name', 'slug'] }],
      order
    });

    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET single product
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id, {
      include: [{ model: Category, as: 'category', attributes: ['name', 'slug'] }]
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST create product (Admin only)
router.post('/', upload.array('images', 5), async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      stock,
      categoryId,
      sizes,
      colors,
      isBestSeller,
      isNewArrival
    } = req.body;

    if (!name || !price || !categoryId) {
      return res.status(400).json({ message: 'Name, price, and category are required' });
    }

    // Parse array variables since form-data passes them as JSON strings
    let parsedSizes = ['S', 'M', 'L', 'XL'];
    let parsedColors = [];
    
    if (sizes) {
      try {
        parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
      } catch (e) {
        parsedSizes = sizes;
      }
    }
    if (colors) {
      try {
        parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors;
      } catch (e) {
        parsedColors = colors;
      }
    }

    // Collect image paths/URLs
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
      imageUrls = req.files.map((file) => {
        return file.path.startsWith('http') 
          ? file.path 
          : `/uploads/${file.filename}`;
      });
    }

    const product = await Product.create({
      name,
      description,
      price: parseFloat(price),
      discountPrice: discountPrice ? parseFloat(discountPrice) : null,
      stock: parseInt(stock) || 0,
      images: imageUrls,
      categoryId,
      sizes: parsedSizes,
      colors: parsedColors,
      isBestSeller: isBestSeller === 'true' || isBestSeller === true,
      isNewArrival: isNewArrival === 'true' || isNewArrival === true
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT update product (Admin only)
router.put('/:id', upload.array('images', 5), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      description,
      price,
      discountPrice,
      stock,
      categoryId,
      sizes,
      colors,
      isBestSeller,
      isNewArrival,
      existingImages // Array of image URLs to keep
    } = req.body;

    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (price) product.price = parseFloat(price);
    if (discountPrice !== undefined) {
      product.discountPrice = discountPrice ? parseFloat(discountPrice) : null;
    }
    if (stock !== undefined) product.stock = parseInt(stock) || 0;
    if (categoryId) product.categoryId = categoryId;

    if (sizes) {
      try {
        product.sizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes;
      } catch (e) {
        product.sizes = sizes;
      }
    }
    if (colors) {
      try {
        product.colors = typeof colors === 'string' ? JSON.parse(colors) : colors;
      } catch (e) {
        product.colors = colors;
      }
    }

    if (isBestSeller !== undefined) {
      product.isBestSeller = isBestSeller === 'true' || isBestSeller === true;
    }
    if (isNewArrival !== undefined) {
      product.isNewArrival = isNewArrival === 'true' || isNewArrival === true;
    }

    // Handle images list
    let parsedExistingImages = [];
    if (existingImages) {
      try {
        parsedExistingImages = typeof existingImages === 'string' ? JSON.parse(existingImages) : existingImages;
      } catch (e) {
        parsedExistingImages = existingImages;
      }
    }

    let newImageUrls = [];
    if (req.files && req.files.length > 0) {
      newImageUrls = req.files.map((file) => {
        return file.path.startsWith('http') 
          ? file.path 
          : `/uploads/${file.filename}`;
      });
    }

    // Combine existing kept images and new uploads
    product.images = [...parsedExistingImages, ...newImageUrls];

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE product (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
