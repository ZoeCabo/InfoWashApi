/**
 * Database Initialization Script for InfoWash API
 * 
 * This script creates initial data for the InfoWash API database including:
 * - Clothing Types
 * - Subtypes
 * - Care Characteristics
 * - Sample Wardrobes
 * - Sample Clothing Items
 */

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Import models
const Type = require(path.join(__dirname, '../models/type.model'));
const Subtype = require(path.join(__dirname, '../models/subtype.model'));
const Characteristic = require(path.join(__dirname, '../models/characteristic.model'));
const Wardrobe = require(path.join(__dirname, '../models/wardrobe.model'));
const Clothing = require(path.join(__dirname, '../models/clothing.model'));
const User = require(path.join(__dirname, '../models/user.model')); // Add this line

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/infowash', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    initializeDatabase();
  })
  .catch((err) => {
    console.error('Failed to connect to MongoDB', err);
    process.exit(1);
  });

async function initializeDatabase() {
  try {
    // Clear existing data
    await clearCollections();
    
    // Create clothing types
    const types = await createTypes();
    
    // Create subtypes for each type
    const subtypes = await createSubtypes(types);
    
    // Create care characteristics
    const characteristics = await createCharacteristics();
    
    // Create sample wardrobes
    const wardrobes = await createWardrobes();
    
    // Create sample clothing items
    await createClothingItems(wardrobes, types, subtypes, characteristics);
    
    console.log('Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

async function clearCollections() {
  console.log('Clearing existing collections...');
  await Type.deleteMany({});
  await Subtype.deleteMany({});
  await Characteristic.deleteMany({});
  await Wardrobe.deleteMany({});
  await Clothing.deleteMany({});
  await User.deleteMany({}); // Add this line
}

async function createTypes() {
  console.log('Creating clothing types...');
  const typeData = [
    { name: 'Tops', description: 'Upper body garments' },
    { name: 'Bottoms', description: 'Lower body garments' },
    { name: 'Outerwear', description: 'Outdoor and protective clothing' },
    { name: 'Underwear', description: 'Undergarments' },
    { name: 'Accessories', description: 'Clothing accessories' },
    { name: 'Footwear', description: 'Shoes and foot coverings' },
  ];
  
  const types = await Type.insertMany(typeData);
  console.log(`Created ${types.length} clothing types`);
  return types;
}

async function createSubtypes(types) {
  console.log('Creating clothing subtypes...');
  
  const typeMap = types.reduce((map, type) => {
    map[type.name] = type._id;
    return map;
  }, {});
  
  const subtypeData = [
    // Tops subtypes
    { name: 'T-Shirt', description: 'Short-sleeved casual shirt', type: typeMap['Tops'] },
    { name: 'Dress Shirt', description: 'Formal button-up shirt', type: typeMap['Tops'] },
    { name: 'Blouse', description: 'Loose-fitting upper garment', type: typeMap['Tops'] },
    { name: 'Sweater', description: 'Knitted upper garment', type: typeMap['Tops'] },
    { name: 'Tank Top', description: 'Sleeveless upper garment', type: typeMap['Tops'] },
    
    // Bottoms subtypes
    { name: 'Jeans', description: 'Denim pants', type: typeMap['Bottoms'] },
    { name: 'Dress Pants', description: 'Formal pants', type: typeMap['Bottoms'] },
    { name: 'Shorts', description: 'Short pants', type: typeMap['Bottoms'] },
    { name: 'Skirt', description: 'Women\'s lower garment', type: typeMap['Bottoms'] },
    { name: 'Leggings', description: 'Tight-fitting stretch pants', type: typeMap['Bottoms'] },
    
    // Outerwear subtypes
    { name: 'Jacket', description: 'Light outer garment', type: typeMap['Outerwear'] },
    { name: 'Coat', description: 'Heavy outer garment', type: typeMap['Outerwear'] },
    { name: 'Hoodie', description: 'Hooded sweatshirt', type: typeMap['Outerwear'] },
    { name: 'Vest', description: 'Sleeveless outer garment', type: typeMap['Outerwear'] },
    
    // Underwear subtypes
    { name: 'Boxers', description: 'Men\'s loose underwear', type: typeMap['Underwear'] },
    { name: 'Briefs', description: 'Men\'s fitted underwear', type: typeMap['Underwear'] },
    { name: 'Bra', description: 'Women\'s support garment', type: typeMap['Underwear'] },
    { name: 'Panties', description: 'Women\'s underwear', type: typeMap['Underwear'] },
    { name: 'Socks', description: 'Foot coverings', type: typeMap['Underwear'] },
    
    // Accessories subtypes
    { name: 'Hat', description: 'Head covering', type: typeMap['Accessories'] },
    { name: 'Scarf', description: 'Neck covering', type: typeMap['Accessories'] },
    { name: 'Gloves', description: 'Hand coverings', type: typeMap['Accessories'] },
    { name: 'Belt', description: 'Waist accessory', type: typeMap['Accessories'] },
    
    // Footwear subtypes
    { name: 'Sneakers', description: 'Athletic shoes', type: typeMap['Footwear'] },
    { name: 'Dress Shoes', description: 'Formal footwear', type: typeMap['Footwear'] },
    { name: 'Sandals', description: 'Open footwear', type: typeMap['Footwear'] },
    { name: 'Boots', description: 'Heavy footwear', type: typeMap['Footwear'] },
  ];
  
  const subtypes = await Subtype.insertMany(subtypeData);
  
  // Update types with subtypes
  for (const subtype of subtypes) {
    await Type.findByIdAndUpdate(
      subtype.type,
      { $push: { subtypes: subtype._id } }
    );
  }
  
  console.log(`Created ${subtypes.length} clothing subtypes`);
  return subtypes;
}

async function createCharacteristics() {
  console.log('Creating care characteristics...');
  
  const characteristicsData = [
    {
      name: 'Delicate',
      notes: 'For delicate fabrics like silk and lace',
      washing_temperature: {
        temperature_max: 30,
        temperature_min: 20
      },
      dryer: {
        use: false,
        no_use: true,
        delicate: true
      },
      drying: {
        lay_flat: true,
        hang_shade: true
      },
      bleaching: {
        allowed: false,
        not_allowed: true
      },
      ironing: {
        no_steam: true,
        max_temperature: 110
      }
    },
    {
      name: 'Cotton Standard',
      notes: 'For regular cotton items',
      washing_temperature: {
        temperature_max: 40,
        temperature_min: 30
      },
      dryer: {
        use: true,
        normal_cycle: true
      },
      drying: {
        hang: true
      },
      bleaching: {
        allowed: true
      },
      ironing: {
        max_temperature: 150
      }
    },
    {
      name: 'Denim',
      notes: 'For jeans and denim items',
      washing_temperature: {
        temperature_max: 40,
        temperature_min: 30
      },
      dryer: {
        use: true,
        short_cycle_low_temp: true
      },
      drying: {
        hang: true
      },
      bleaching: {
        not_allowed: true
      },
      ironing: {
        max_temperature: 150
      }
    },
    {
      name: 'Wool',
      notes: 'For wool and cashmere items',
      washing_temperature: {
        temperature_max: 30,
        temperature_min: 20
      },
      dryer: {
        use: false,
        no_use: true
      },
      drying: {
        lay_flat: true
      },
      bleaching: {
        not_allowed: true
      },
      ironing: {
        no_steam: true,
        max_temperature: 110
      }
    },
    {
      name: 'Synthetic',
      notes: 'For polyester, nylon, and other synthetic fabrics',
      washing_temperature: {
        temperature_max: 40,
        temperature_min: 30
      },
      dryer: {
        use: true,
        short_cycle_low_temp: true
      },
      drying: {
        hang: true
      },
      bleaching: {
        oxygen_based_only: true
      },
      ironing: {
        max_temperature: 120
      }
    }
  ];
  
  const characteristics = await Characteristic.insertMany(characteristicsData);
  console.log(`Created ${characteristics.length} care characteristics`);
  return characteristics;
}

async function createUsers() {
  console.log('Creating sample users...');
  
  const userData = [
    {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user'
    },
    {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: 'password123',
      role: 'user'
    },
    {
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'adminpass123',
      role: 'admin'
    }
  ];
  
  const users = await User.insertMany(userData);
  console.log(`Created ${users.length} users`);
  return users;
}

async function createWardrobes(users) {
  console.log('Creating sample wardrobes...');
  
  // Create a map for easier lookup
  const userMap = users.reduce((map, user) => {
    map[user.name] = user._id;
    return map;
  }, {});
  
  const wardrobeData = [
    {
      name: 'Everyday Wardrobe',
      description: 'Regular clothes for daily wear',
      user: userMap['John Doe']
    },
    {
      name: 'Work Attire',
      description: 'Professional clothing for the office',
      user: userMap['Jane Smith']
    },
    {
      name: 'Seasonal',
      description: 'Clothes for specific seasons',
      user: userMap['John Doe']
    }
  ];
  
  const wardrobes = await Wardrobe.insertMany(wardrobeData);
  console.log(`Created ${wardrobes.length} wardrobes`);
  return wardrobes;
}

async function initializeDatabase() {
  try {
    // Clear existing data
    await clearCollections();
    
    // Create users
    const users = await createUsers();
    
    // Create clothing types
    const types = await createTypes();
    
    // Create subtypes for each type
    const subtypes = await createSubtypes(types);
    
    // Create care characteristics
    const characteristics = await createCharacteristics();
    
    // Create sample wardrobes with user associations
    const wardrobes = await createWardrobes(users);
    
    // Create sample clothing items
    await createClothingItems(wardrobes, types, subtypes, characteristics);
    
    console.log('Database initialized successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

async function createClothingItems(wardrobes, types, subtypes, characteristics) {
  console.log('Creating sample clothing items...');
  
  // Create maps for easier lookup
  const wardrobeMap = wardrobes.reduce((map, wardrobe) => {
    map[wardrobe.name] = wardrobe._id;
    return map;
  }, {});
  
  const typeMap = types.reduce((map, type) => {
    map[type.name] = type._id;
    return map;
  }, {});
  
  const subtypeMap = subtypes.reduce((map, subtype) => {
    map[subtype.name] = subtype._id;
    return map;
  }, {});
  
  const characteristicMap = characteristics.reduce((map, characteristic) => {
    map[characteristic.name] = characteristic._id;
    return map;
  }, {});
  
  const clothingData = [
    // Everyday Wardrobe items
    {
      name: 'Blue Jeans',
      description: 'Favorite pair of blue jeans',
      color: 'Blue',
      brand: 'Levi\'s',
      size: '32',
      wardrobe: wardrobeMap['Everyday Wardrobe'],
      type: typeMap['Bottoms'],
      subtype: subtypeMap['Jeans'],
      characteristics: characteristicMap['Denim'],
      purchase_date: new Date('2022-01-15')
    },
    {
      name: 'White T-Shirt',
      description: 'Plain white cotton t-shirt',
      color: 'White',
      brand: 'Hanes',
      size: 'M',
      wardrobe: wardrobeMap['Everyday Wardrobe'],
      type: typeMap['Tops'],
      subtype: subtypeMap['T-Shirt'],
      characteristics: characteristicMap['Cotton Standard'],
      purchase_date: new Date('2022-03-10')
    },
    {
      name: 'Black Hoodie',
      description: 'Comfortable black hoodie',
      color: 'Black',
      brand: 'Nike',
      size: 'L',
      wardrobe: wardrobeMap['Everyday Wardrobe'],
      type: typeMap['Outerwear'],
      subtype: subtypeMap['Hoodie'],
      characteristics: characteristicMap['Cotton Standard'],
      purchase_date: new Date('2021-11-20')
    },
    
    // Work Attire items
    {
      name: 'Navy Dress Pants',
      description: 'Professional navy dress pants',
      color: 'Navy',
      brand: 'Calvin Klein',
      size: '30',
      wardrobe: wardrobeMap['Work Attire'],
      type: typeMap['Bottoms'],
      subtype: subtypeMap['Dress Pants'],
      characteristics: characteristicMap['Synthetic'],
      purchase_date: new Date('2022-02-05')
    },
    {
      name: 'White Dress Shirt',
      description: 'Crisp white button-up shirt',
      color: 'White',
      brand: 'Brooks Brothers',
      size: 'M',
      wardrobe: wardrobeMap['Work Attire'],
      type: typeMap['Tops'],
      subtype: subtypeMap['Dress Shirt'],
      characteristics: characteristicMap['Cotton Standard'],
      purchase_date: new Date('2022-02-05')
    },
    {
      name: 'Black Dress Shoes',
      description: 'Formal black leather shoes',
      color: 'Black',
      brand: 'Cole Haan',
      size: '10',
      wardrobe: wardrobeMap['Work Attire'],
      type: typeMap['Footwear'],
      subtype: subtypeMap['Dress Shoes'],
      characteristics: characteristicMap['Delicate'],
      purchase_date: new Date('2021-12-15')
    },
    
    // Seasonal items
    {
      name: 'Wool Sweater',
      description: 'Warm wool sweater for winter',
      color: 'Gray',
      brand: 'J.Crew',
      size: 'M',
      wardrobe: wardrobeMap['Seasonal'],
      type: typeMap['Tops'],
      subtype: subtypeMap['Sweater'],
      characteristics: characteristicMap['Wool'],
      purchase_date: new Date('2021-10-10')
    },
    {
      name: 'Summer Shorts',
      description: 'Light cotton shorts for summer',
      color: 'Khaki',
      brand: 'Gap',
      size: '32',
      wardrobe: wardrobeMap['Seasonal'],
      type: typeMap['Bottoms'],
      subtype: subtypeMap['Shorts'],
      characteristics: characteristicMap['Cotton Standard'],
      purchase_date: new Date('2022-04-20')
    },
    {
      name: 'Winter Coat',
      description: 'Heavy winter coat',
      color: 'Black',
      brand: 'North Face',
      size: 'L',
      wardrobe: wardrobeMap['Seasonal'],
      type: typeMap['Outerwear'],
      subtype: subtypeMap['Coat'],
      characteristics: characteristicMap['Synthetic'],
      purchase_date: new Date('2021-09-15')
    }
  ];
  
  const clothingItems = await Clothing.insertMany(clothingData);
  
  // Update wardrobes with clothing items
  for (const item of clothingItems) {
    await Wardrobe.findByIdAndUpdate(
      item.wardrobe,
      { $push: { clothes: item._id } }
    );
  }
  
  console.log(`Created ${clothingItems.length} clothing items`);
  return clothingItems;
}