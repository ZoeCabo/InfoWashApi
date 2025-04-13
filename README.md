# InfoWashApi

A RESTful API for clothing care management built with Express.js and MongoDB. This API allows users to manage wardrobes, clothing items, and their care instructions based on types, subtypes, and detailed characteristics.

## Project Structure

```
├── controllers/            # Controller logic for handling requests
├── models/                 # MongoDB schemas
├── routes/                 # API routes
├── .env                    # Environment variables
├── package.json            # Project dependencies
├── server.js               # Entry point
```

## Entity Relationship

The API is structured around these main entities:

- **Wardrobe**: Collection of clothing items
- **Clothing**: Individual clothing items with references to type, subtype, and care characteristics
- **Type**: Categories of clothing (e.g., shirts, pants)
- **Subtype**: Subcategories of clothing types (e.g., t-shirt, dress shirt)
- **Characteristic**: Care instructions including washing temperature, drying options, ironing, etc.

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Configure environment variables in `.env` file:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/infowash
   NODE_ENV=development
   ```
4. Start the server:
   ```
   npm run dev
   ```

## API Endpoints

### Wardrobes

- `GET /api/wardrobes` - Get all wardrobes
- `GET /api/wardrobes/:id` - Get a specific wardrobe
- `POST /api/wardrobes` - Create a new wardrobe
- `PATCH /api/wardrobes/:id` - Update a wardrobe
- `DELETE /api/wardrobes/:id` - Delete a wardrobe

### Clothing Items

- `GET /api/clothes` - Get all clothing items
- `GET /api/clothes?wardrobe=:wardrobeId` - Get clothing items by wardrobe
- `GET /api/clothes/:id` - Get a specific clothing item
- `POST /api/clothes` - Create a new clothing item
- `PATCH /api/clothes/:id` - Update a clothing item
- `DELETE /api/clothes/:id` - Delete a clothing item

### Types

- `GET /api/types` - Get all clothing types
- `GET /api/types/:id` - Get a specific type
- `POST /api/types` - Create a new type
- `PATCH /api/types/:id` - Update a type
- `DELETE /api/types/:id` - Delete a type

### Subtypes

- `GET /api/subtypes` - Get all subtypes
- `GET /api/subtypes?type=:typeId` - Get subtypes by type
- `GET /api/subtypes/:id` - Get a specific subtype
- `POST /api/subtypes` - Create a new subtype
- `PATCH /api/subtypes/:id` - Update a subtype
- `DELETE /api/subtypes/:id` - Delete a subtype

### Characteristics

- `GET /api/characteristics` - Get all characteristics
- `GET /api/characteristics/:id` - Get a specific characteristic
- `POST /api/characteristics` - Create a new characteristic
- `PATCH /api/characteristics/:id` - Update a characteristic
- `DELETE /api/characteristics/:id` - Delete a characteristic