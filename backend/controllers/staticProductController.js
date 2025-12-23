const fs = require('fs');
const path = require('path');

// Get static products from JSON file
exports.getStaticProducts = async (req, res) => {
  try {
    // Path to the static products.json file in frontend/public
    const productsPath = path.join(__dirname, '../../frontend/public/products.json');
    
    if (!fs.existsSync(productsPath)) {
      return res.json({
        success: true,
        data: { products: [] }
      });
    }

    const productsData = fs.readFileSync(productsPath, 'utf8');
    const products = JSON.parse(productsData);

    // Transform to match database product format
    const transformedProducts = products.map(product => ({
      id: `static_${product.id}`, // Prefix with 'static_' to distinguish
      name: product.name,
      price: product.price,
      description: product.desc || '',
      image: product.image,
      source: 'static' // Mark as static product
    }));

    res.json({
      success: true,
      data: { products: transformedProducts }
    });
  } catch (error) {
    console.error('Get static products error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching static products',
      error: process.env.NODE_ENV === 'development' ? error.message : {}
    });
  }
};


