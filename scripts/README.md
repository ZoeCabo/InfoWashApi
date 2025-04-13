# InfoWash API Database Scripts

This directory contains scripts for managing the InfoWash API database.

## Database Initialization

The `initDb.js` script creates initial data for the InfoWash API database, including:

- Clothing Types (Tops, Bottoms, Outerwear, etc.)
- Subtypes (T-Shirt, Jeans, Jacket, etc.)
- Care Characteristics (Delicate, Cotton Standard, Denim, etc.)
- Sample Wardrobes
- Sample Clothing Items

### Running the Script

To initialize your database with sample data:

1. Make sure MongoDB is running:
   ```
   mongod --dbpath ~/data/db
   ```

2. Navigate to the scripts directory:
   ```
   cd scripts
   ```

3. Run the initialization script:
   ```
   node initDb.js
   ```

4. You should see output confirming the creation of various collections.

## Database Structure

The InfoWash API database consists of the following collections:

- **Wardrobes**: Collections of clothing items
- **Clothing**: Individual clothing items with references to type, subtype, and care characteristics
- **Types**: Main clothing categories (Tops, Bottoms, etc.)
- **Subtypes**: Specific clothing types within categories (T-Shirt, Jeans, etc.)
- **Characteristics**: Care instructions for clothing items

## After Initialization

Once the database is initialized, you can:

1. Start the InfoWash API server:
   ```
   npm run dev
   ```

2. Access the API at http://localhost:5000

3. Use the following endpoints:
   - `/api/wardrobes` - Manage wardrobes
   - `/api/clothes` - Manage clothing items
   - `/api/types` - Manage clothing types
   - `/api/subtypes` - Manage clothing subtypes
   - `/api/characteristics` - Manage care characteristics