const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');
const { Op } = require('sequelize');
const { authMiddleware } = require('./auth');

// GET all orders (Admin only)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET user's past orders
router.get('/my-orders', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET single order by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST place a new order (Checkout)
router.post('/', async (req, res) => {
  try {
    const {
      userId,
      customerName,
      email,
      phone,
      address,
      city,
      postalCode,
      items, // Array of: { productId, name, price, quantity, size, color, image }
      totalAmount,
      discountAmount,
      couponApplied,
      paymentMethod
    } = req.body;

    if (!customerName || !email || !phone || !address || !city || !postalCode || !items || items.length === 0) {
      return res.status(400).json({ message: 'Missing required order details' });
    }

    // Verify stock and update product stock levels
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) {
        return res.status(404).json({ message: `Product "${item.name}" no longer exists.` });
      }
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product "${product.name}". Only ${product.stock} items left.` });
      }
    }

    // Update stock levels
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      product.stock -= item.quantity;
      await product.save();
    }

    // Determine default paymentStatus based on paymentMethod
    // COD orders are Pending payment; Prepaid mock orders are marked Paid immediately for demo
    const paymentStatus = paymentMethod === 'COD' ? 'Pending' : 'Paid';

    // Calculate Estimated Delivery Date (5 days from now)
    const estimatedDeliveryDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

    // Create the order
    const order = await Order.create({
      userId: userId || null,
      estimatedDeliveryDate,
      customerName,
      email,
      phone,
      address,
      city,
      postalCode,
      items,
      totalAmount: parseFloat(totalAmount),
      discountAmount: parseFloat(discountAmount) || 0,
      couponApplied: couponApplied || null,
      paymentMethod,
      paymentStatus,
      orderStatus: 'Pending'
    });

    res.status(201).json({
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT update order status or details (Admin only)
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, paymentStatus } = req.body;

    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (orderStatus) {
      order.orderStatus = orderStatus; // Pending, Processing, Shipped, Delivered, Cancelled
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus; // Pending, Paid, Failed
    }

    await order.save();
    res.json(order);
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
