const Category = require('../models/Category');
const SubCategory = require('../models/SubCategory');
const Product = require('../models/Product');

const categoriesData = [
  { name: 'Abstract Painting', description: 'Non-representational artwork that uses colors and shapes.', image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=800' },
  { name: 'Landscape Painting', description: 'Depictions of natural scenery such as mountains, valleys, trees, rivers, and forests.', image: 'https://images.unsplash.com/photo-1505909182942-e2f09aee3e89?auto=format&fit=crop&q=80&w=800' },
  { name: 'Portrait Painting', description: 'Paintings where the intent is to depict a human subject.', image: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&q=80&w=800' },
  { name: 'Modern Art', description: 'Artworks produced during the approximate period 1860s to the 1970s.', image: 'https://images.unsplash.com/photo-1536924940846-227afb31e2a5?auto=format&fit=crop&q=80&w=800' },
  { name: 'Impressionism', description: '19th-century art movement characterized by relatively small, thin, yet visible brush strokes.', image: 'https://images.unsplash.com/photo-1578301978018-3005759f48f7?auto=format&fit=crop&q=80&w=800' },
  { name: 'Contemporary Art', description: 'Art of today, produced in the second half of the 20th century or in the 21st century.', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800' },
  { name: 'Still Life', description: 'Work of art depicting mostly inanimate subject matter.', image: 'https://images.unsplash.com/photo-1577083165249-14a0e230ce7e?auto=format&fit=crop&q=80&w=800' },
  { name: 'Surrealism', description: 'Cultural movement that developed in Europe in the aftermath of World War I.', image: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=800' },
  { name: 'Pop Art', description: 'Art movement that emerged in the United Kingdom and the United States during the mid-to late-1950s.', image: 'https://images.unsplash.com/photo-1601334468641-7a6c9d784a9e?auto=format&fit=crop&q=80&w=800' },
  { name: 'Minimalist Art', description: 'Visual art where the work is set out to expose the essence, essentials or identity of a subject.', image: 'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?auto=format&fit=crop&q=80&w=800' }
];

const subCategoriesData = {
  'Abstract Painting': ['Geometric Abstract', 'Fluid Abstract'],
  'Landscape Painting': ['Mountain Landscape', 'Seascape'],
  'Portrait Painting': ['Classical Portrait', 'Self Portrait'],
  'Modern Art': ['Cubism', 'Fauvism'],
  'Impressionism': ['Plein Air', 'Post-Impressionism'],
  'Contemporary Art': ['Digital Art', 'Mixed Media'],
  'Still Life': ['Floral Still Life', 'Fruit Still Life'],
  'Surrealism': ['Dreamscapes', 'Automatism'],
  'Pop Art': ['Comic Style', 'Commercial Art'],
  'Minimalist Art': ['Monochrome', 'Geometric Minimalism']
};

const productsData = [
  { name: 'Vibrant Geometric Dreams', cat: 'Abstract Painting', sub: 'Geometric Abstract', price: 1500, stock: 10, image: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800' },
  { name: 'Fluid Ocean Waves', cat: 'Abstract Painting', sub: 'Fluid Abstract', price: 1200, stock: 15, image: 'https://images.unsplash.com/photo-1573521193826-58c7dc2e13e3?auto=format&fit=crop&q=80&w=800' },
  { name: 'Majestic Peaks', cat: 'Landscape Painting', sub: 'Mountain Landscape', price: 2500, stock: 5, image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&q=80&w=800' },
  { name: 'Sunset at the Pier', cat: 'Landscape Painting', sub: 'Seascape', price: 2200, stock: 8, image: 'https://images.unsplash.com/photo-1495562569060-2eec283d3391?auto=format&fit=crop&q=80&w=800' },
  { name: 'Lady with a Pearl', cat: 'Portrait Painting', sub: 'Classical Portrait', price: 5000, stock: 2, image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800' },
  { name: 'Reflections of Self', cat: 'Portrait Painting', sub: 'Self Portrait', price: 1800, stock: 12, image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800' },
  { name: 'Fragmented Reality', cat: 'Modern Art', sub: 'Cubism', price: 3000, stock: 4, image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800' },
  { name: 'Wild Colors', cat: 'Modern Art', sub: 'Fauvism', price: 2800, stock: 6, image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&q=80&w=800' },
  { name: 'Garden in Spring', cat: 'Impressionism', sub: 'Plein Air', price: 3500, stock: 3, image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?auto=format&fit=crop&q=80&w=800' },
  { name: 'Starry Echoes', cat: 'Impressionism', sub: 'Post-Impressionism', price: 4200, stock: 2, image: 'https://images.unsplash.com/photo-1578922746465-3a80a228f223?auto=format&fit=crop&q=80&w=800' },
  { name: 'Cyberpunk City', cat: 'Contemporary Art', sub: 'Digital Art', price: 900, stock: 20, image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=800' },
  { name: 'Urban Decay', cat: 'Contemporary Art', sub: 'Mixed Media', price: 1600, stock: 7, image: 'https://images.unsplash.com/photo-1580192985016-80db61c28c89?auto=format&fit=crop&q=80&w=800' },
  { name: 'Sunflowers in Vase', cat: 'Still Life', sub: 'Floral Still Life', price: 2100, stock: 5, image: 'https://images.unsplash.com/photo-1562690868-60bbe7293e94?auto=format&fit=crop&q=80&w=800' },
  { name: 'Apple and Grapes', cat: 'Still Life', sub: 'Fruit Still Life', price: 1400, stock: 9, image: 'https://images.unsplash.com/photo-1579762715111-c94df620352e?auto=format&fit=crop&q=80&w=800' },
  { name: 'Melting Clocks', cat: 'Surrealism', sub: 'Dreamscapes', price: 4500, stock: 1, image: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=800' },
  { name: 'Unconscious Flow', cat: 'Surrealism', sub: 'Automatism', price: 2700, stock: 4, image: 'https://images.unsplash.com/photo-1518063319859-f136d26d8fd5?auto=format&fit=crop&q=80&w=800' },
  { name: 'Retro Cola', cat: 'Pop Art', sub: 'Comic Style', price: 1100, stock: 15, image: 'https://images.unsplash.com/photo-1582562124811-c09040d0a901?auto=format&fit=crop&q=80&w=800' },
  { name: 'Marilyn Monroe Colors', cat: 'Pop Art', sub: 'Commercial Art', price: 1300, stock: 12, image: 'https://images.unsplash.com/photo-1565373677928-8de48ebce26f?auto=format&fit=crop&q=80&w=800' },
  { name: 'Black on Black', cat: 'Minimalist Art', sub: 'Monochrome', price: 800, stock: 25, image: 'https://images.unsplash.com/photo-1501686632284-d5137cd9a405?auto=format&fit=crop&q=80&w=800' },
  { name: 'Primary Shapes', cat: 'Minimalist Art', sub: 'Geometric Minimalism', price: 1000, stock: 18, image: 'https://images.unsplash.com/photo-1550537687-c91072c4792d?auto=format&fit=crop&q=80&w=800' },
  { name: 'Emotional Strokes', cat: 'Abstract Painting', sub: 'Fluid Abstract', price: 1700, stock: 6, image: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&q=80&w=800' },
  { name: 'Quiet Forest', cat: 'Landscape Painting', sub: 'Mountain Landscape', price: 1900, stock: 8, image: 'https://images.unsplash.com/photo-1505909182942-e2f09aee3e89?auto=format&fit=crop&q=80&w=800' },
  { name: 'Hidden Emotions', cat: 'Portrait Painting', sub: 'Self Portrait', price: 2100, stock: 4, image: 'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?auto=format&fit=crop&q=80&w=800' },
  { name: 'City Lights', cat: 'Contemporary Art', sub: 'Digital Art', price: 1100, stock: 11, image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=800' },
  { name: 'The Lost Apple', cat: 'Surrealism', sub: 'Dreamscapes', price: 3200, stock: 2, image: 'https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=800' }
];

const seedData = async () => {
  try {
    const productCount = await Product.countDocuments();
    if (productCount > 0) {
      console.log('Seed data already exists. Skipping seed process.');
      return;
    }

    console.log('Starting seed process for painting categories, subcategories, and products...');

    // Delete existing data to start fresh (optional, but good if we want exactly this data)
    await Product.deleteMany({});
    await SubCategory.deleteMany({});
    await Category.deleteMany({});

    const categoryMap = {};
    const subCategoryMap = {};

    // 1. Create Categories
    for (const catData of categoriesData) {
      const category = await Category.create({
        name: catData.name,
        description: catData.description,
        image: catData.image
      });
      categoryMap[catData.name] = category._id;
    }

    // 2. Create SubCategories
    for (const [catName, subCats] of Object.entries(subCategoriesData)) {
      const categoryId = categoryMap[catName];
      if (!categoryId) continue;

      for (const subCatName of subCats) {
        const subCategory = await SubCategory.create({
          name: subCatName,
          description: `${subCatName} description`,
          image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=800', // default image
          category: categoryId,
          url: subCatName.toLowerCase().replace(/\s+/g, '-')
        });
        subCategoryMap[subCatName] = subCategory._id;
      }
    }

    // 3. Create Products
    for (const prodData of productsData) {
      const categoryId = categoryMap[prodData.cat];
      const subCategoryId = subCategoryMap[prodData.sub];

      if (categoryId && subCategoryId) {
        await Product.create({
          name: prodData.name,
          description: `High quality artwork representing ${prodData.name}`,
          price: prodData.price,
          stock: prodData.stock,
          salePrice: prodData.price * 0.9, // 10% off
          sku: `SKU-${Math.random().toString(36).substring(7).toUpperCase()}`,
          dimensions: '24x36 inches',
          creationYear: '2023',
          weight: 2.5,
          shippingClass: 'Standard',
          packaging: 'Box',
          category: categoryId,
          subCategory: subCategoryId,
          image: prodData.image,
          gallery: [prodData.image, prodData.image]
        });
      }
    }

    console.log('Painting data seeded successfully! 🎨');
  } catch (error) {
    console.error('Error seeding painting data:', error);
  }
};

module.exports = seedData;
