# Woods Management System

This document describes the new Woods Management system that has been integrated into the EasyBuild Next.js application.

## Overview

The Woods Management system allows administrators to dynamically manage wood materials that are displayed on the homepage. Instead of hardcoded wood materials, the system now fetches data from a MongoDB database and provides a user-friendly admin interface for management.

## Features

- **Dynamic Content Management**: Add, edit, delete, and activate/deactivate wood materials
- **Multi-language Support**: Supports English, German, and Albanian languages
- **Image Upload**: Integrated with the existing image upload system
- **Ordering System**: Automatic ordering of materials
- **Admin Panel Integration**: Seamlessly integrated into the existing admin dashboard

## Components

### 1. WoodsManager (Admin Component)
- **Location**: `src/app/components/admin/WoodsManager.tsx`
- **Purpose**: Admin interface for managing wood materials
- **Features**:
  - Create new wood materials with multi-language titles
  - Upload images for each material
  - View all existing materials
  - Activate/deactivate materials
  - Delete materials
  - Refresh data

### 2. Woods (Frontend Component)
- **Location**: `src/app/components/materials/Woods.tsx`
- **Purpose**: Displays wood materials on the homepage
- **Features**:
  - Fetches data from the database
  - Responsive grid layout
  - Multi-language support
  - Loading states
  - Error handling

### 3. Wood Model
- **Location**: `src/models/Wood.ts`
- **Purpose**: MongoDB schema for wood materials
- **Fields**:
  - `title`: Multi-language titles (en, de, al)
  - `imageUrl`: Path to the material image
  - `isActive`: Whether the material is displayed
  - `order`: Display order
  - `createdAt`/`updatedAt`: Timestamps

## API Endpoints

### GET `/api/woods`
- **Purpose**: Fetch all active wood materials
- **Response**: List of wood materials sorted by order

### POST `/api/woods`
- **Purpose**: Create a new wood material
- **Body**: `{ title: { en, de, al }, imageUrl }`
- **Response**: Created wood material

### PUT `/api/woods?id={id}`
- **Purpose**: Update an existing wood material
- **Body**: `{ title, imageUrl, isActive, order }`
- **Response**: Updated wood material

### DELETE `/api/woods?id={id}`
- **Purpose**: Delete a wood material
- **Response**: Success message

### POST `/api/seed-woods`
- **Purpose**: Seed the database with initial wood materials
- **Response**: Success message with count of created materials

## Setup Instructions

### 1. Database Setup
The system automatically creates the necessary MongoDB collections when first used.

### 2. Initial Data Population
To populate the database with initial wood materials, make a POST request to `/api/seed-woods`:

```bash
curl -X POST http://localhost:3000/api/seed-woods
```

### 3. Admin Access
1. Navigate to `/dashboard`
2. Sign in with admin credentials
3. Click on "Woods Management" in the left sidebar
4. Start managing your wood materials

## Usage

### Adding a New Wood Material
1. Go to the Woods Management tab in the admin panel
2. Fill in the title for all three languages (English, German, Albanian)
3. Upload an image for the material
4. Click "Create Wood Material"

### Managing Existing Materials
- **View**: All materials are displayed in a grid layout
- **Activate/Deactivate**: Use the toggle button to show/hide materials
- **Delete**: Use the delete button to remove materials permanently
- **Refresh**: Use the refresh button to reload data

### Frontend Display
The Woods component automatically displays all active materials on the homepage in a responsive grid layout, with proper multi-language support based on the user's selected language.

## File Structure

```
src/
├── app/
│   ├── api/
│   │   └── woods/
│   │       └── route.ts          # API endpoints
│   │   └── seed-woods/
│   │       └── route.ts          # Database seeding
│   ├── components/
│   │   ├── admin/
│   │   │   └── WoodsManager.tsx  # Admin interface
│   │   └── materials/
│   │       └── Woods.tsx         # Frontend display
│   └── dashboard/
│       └── page.tsx              # Updated dashboard
├── models/
│   └── Wood.ts                   # Database model
└── i18n.ts                       # Updated translations
```

## Benefits

1. **Dynamic Content**: No need to modify code to update wood materials
2. **Multi-language**: Easy management of content in multiple languages
3. **User-friendly**: Intuitive admin interface
4. **Scalable**: Easy to add more materials or modify existing ones
5. **Integrated**: Seamlessly integrated with existing admin panel
6. **Responsive**: Frontend component is fully responsive

## Future Enhancements

- Drag and drop reordering
- Bulk operations (delete multiple, activate/deactivate multiple)
- Image optimization and resizing
- Material categories and filtering
- Export/import functionality
- Version history and rollback

## Troubleshooting

### Common Issues

1. **Images not displaying**: Check if the image path is correct and accessible
2. **Translation not working**: Ensure all language keys are properly set in i18n.ts
3. **Database connection**: Verify MongoDB connection in the console
4. **Admin access**: Ensure you're logged in with proper credentials

### Debug Steps

1. Check browser console for JavaScript errors
2. Verify API endpoints are responding correctly
3. Check MongoDB connection and collections
4. Verify image upload paths and permissions

## Support

For technical support or questions about the Woods Management system, please refer to the main project documentation or contact the development team.
