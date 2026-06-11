const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const sequelize = require('./config/database');

// Import routes
const categoryRoutes = require('./routes/categories');
const productRoutes = require('./routes/products');
const couponRoutes = require('./routes/coupons');
const orderRoutes = require('./routes/orders');
const settingsRoutes = require('./routes/settings');
const { router: authRoutes } = require('./routes/auth');
const addressesRoutes = require('./routes/addresses');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure uploads directory exists for local fallback uploads
const localUploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(localUploadsDir)) {
  fs.mkdirSync(localUploadsDir, { recursive: true });
}

// Serve uploaded static files
app.use('/uploads', express.static(localUploadsDir));

// Route Mounts
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/addresses', addressesRoutes);

// Health check endpoint
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to SKYVEX E-Commerce API', status: 'Healthy' });
});

// Brand migration database runner
const migrateDatabaseBrandName = async () => {
  try {
    const Setting = require('./models/Setting');
    const settings = await Setting.findAll();
    let updatedCount = 0;
    
    for (const setting of settings) {
      if (setting.value && setting.value.match(/ezeewere/i)) {
        // Skip image URLs to avoid breaking uploads/Cloudinary assets folder paths
        if (setting.value.includes('cloudinary') || setting.value.includes('/uploads/')) {
          continue;
        }

        let newValue = setting.value.replace(/contact@ezeewere\.com/ig, 'contact@skyvex.com');
        newValue = newValue.replace(/ezeewere/ig, 'SKYVEX');
        
        setting.value = newValue;
        await setting.save();
        updatedCount++;
        console.log(`INFO: Migrated setting key "${setting.key}" to "${newValue}"`);
      }
    }
    
    if (updatedCount > 0) {
      console.log(`INFO: Database brand migration completed. Updated ${updatedCount} settings.`);
    } else {
      console.log('INFO: Database brand migration checked. No updates needed.');
    }
  } catch (error) {
    console.error('ERROR: Database brand migration failed:', error);
  }
};

// Database Sync and Server Listen
const startServer = async () => {
  try {
    // Model Associations
    const User = require('./models/User');
    const Address = require('./models/Address');
    const Order = require('./models/Order');

    User.hasMany(Address, { foreignKey: 'userId', onDelete: 'CASCADE' });
    Address.belongsTo(User, { foreignKey: 'userId' });

    User.hasMany(Order, { foreignKey: 'userId' });
    Order.belongsTo(User, { foreignKey: 'userId' });

    // Sync Database
    await sequelize.sync();
    console.log('INFO: Database successfully connected and models synced.');

    // Run brand migration
    await migrateDatabaseBrandName();

    app.listen(PORT, () => {
      console.log(`INFO: Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('ERROR: Unable to start server or sync database:', error);
    process.exit(1);
  }
};

startServer();
