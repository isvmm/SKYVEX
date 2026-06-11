const express = require('express');
const router = express.Router();
const Coupon = require('../models/Coupon');
const { Op } = require('sequelize');

// GET all coupons
router.get('/', async (req, res) => {
  try {
    const coupons = await Coupon.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(coupons);
  } catch (error) {
    console.error('Error fetching coupons:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST create coupon
router.post('/', async (req, res) => {
  try {
    const { code, discountPercent, discountAmount, minCartValue, expiryDate } = req.body;
    
    if (!code || !expiryDate) {
      return res.status(400).json({ message: 'Coupon code and expiry date are required' });
    }

    if (!discountPercent && !discountAmount) {
      return res.status(400).json({ message: 'Either discount percentage or discount amount must be provided' });
    }

    const formattedCode = code.toUpperCase().trim();

    // Check if code exists
    const existing = await Coupon.findOne({ where: { code: formattedCode } });
    if (existing) {
      return res.status(400).json({ message: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({
      code: formattedCode,
      discountPercent: discountPercent ? parseInt(discountPercent) : null,
      discountAmount: discountAmount ? parseFloat(discountAmount) : null,
      minCartValue: parseFloat(minCartValue) || 0,
      expiryDate: new Date(expiryDate),
      isActive: true
    });

    res.status(201).json(coupon);
  } catch (error) {
    console.error('Error creating coupon:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE coupon
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const coupon = await Coupon.findByPk(id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    await coupon.destroy();
    res.json({ message: 'Coupon deleted successfully' });
  } catch (error) {
    console.error('Error deleting coupon:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST validate coupon code
router.post('/validate', async (req, res) => {
  try {
    const { code, cartTotal } = req.body;

    if (!code) {
      return res.status(400).json({ valid: false, message: 'Coupon code is required' });
    }

    const coupon = await Coupon.findOne({
      where: {
        code: code.toUpperCase().trim(),
        isActive: true
      }
    });

    if (!coupon) {
      return res.status(404).json({ valid: false, message: 'Invalid coupon code' });
    }

    // Check expiry
    const now = new Date();
    if (new Date(coupon.expiryDate) < now) {
      return res.status(400).json({ valid: false, message: 'Coupon has expired' });
    }

    // Check minimum cart value
    if (parseFloat(cartTotal) < parseFloat(coupon.minCartValue)) {
      return res.status(400).json({
        valid: false,
        message: `Minimum purchase of ₹${coupon.minCartValue} required for this coupon`
      });
    }

    // Calculate discount
    let discount = 0;
    if (coupon.discountPercent) {
      discount = (parseFloat(cartTotal) * (coupon.discountPercent / 100));
    } else if (coupon.discountAmount) {
      discount = parseFloat(coupon.discountAmount);
    }

    // Limit discount to cart total
    if (discount > parseFloat(cartTotal)) {
      discount = parseFloat(cartTotal);
    }

    res.json({
      valid: true,
      code: coupon.code,
      discount: parseFloat(discount.toFixed(2)),
      message: 'Coupon applied successfully!'
    });
  } catch (error) {
    console.error('Error validating coupon:', error);
    res.status(500).json({ valid: false, message: 'Server error', error: error.message });
  }
});

module.exports = router;
