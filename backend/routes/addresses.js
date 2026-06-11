const express = require('express');
const router = express.Router();
const Address = require('../models/Address');
const { authMiddleware } = require('./auth');

// Protect all address routes
router.use(authMiddleware);

// Get all addresses for user
router.get('/', async (req, res) => {
  try {
    const addresses = await Address.findAll({ where: { userId: req.user.id } });
    res.json(addresses);
  } catch (error) {
    console.error('Error fetching addresses:', error);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
});

// Add new address
router.post('/', async (req, res) => {
  try {
    const { name, street, city, postalCode, phone, isDefault } = req.body;
    
    // If setting as default, unset others
    if (isDefault) {
      await Address.update({ isDefault: false }, { where: { userId: req.user.id } });
    }

    const newAddress = await Address.create({
      userId: req.user.id,
      name,
      street,
      city,
      postalCode,
      phone,
      isDefault: isDefault || false
    });

    res.status(201).json(newAddress);
  } catch (error) {
    console.error('Error adding address:', error);
    res.status(500).json({ error: 'Failed to add address' });
  }
});

// Delete an address
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await Address.destroy({ where: { id, userId: req.user.id } });
    
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'Address not found or unauthorized' });
    }
    
    res.json({ message: 'Address deleted successfully' });
  } catch (error) {
    console.error('Error deleting address:', error);
    res.status(500).json({ error: 'Failed to delete address' });
  }
});

module.exports = router;
