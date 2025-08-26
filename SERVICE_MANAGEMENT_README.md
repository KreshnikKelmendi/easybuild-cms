# Service Management System

This document describes the enhanced service management system that includes detailed service information with step-by-step content.

## Overview

The service management system now supports:
- Multi-language titles (English, German, Albanian)
- Two description fields per language
- Main service image
- Optional hover image
- Three step images with title keys
- Service status management

## Components

### 1. ServiceManager (Admin)
Located at: `src/app/components/admin/ServiceManager.tsx`

This component allows administrators to:
- Create new services with all required fields
- Upload images for main service and step-by-step process
- Manage service content in multiple languages
- View and delete existing services

### 2. ServiceDetail (Public)
Located at: `src/app/components/services/ServiceDetail.tsx`

This component displays services on the public services page with:
- Service image and information
- Expandable step-by-step process
- GSAP animations for enhanced user experience
- Responsive design for all screen sizes

## Database Schema

The Service model includes:

```typescript
interface Service {
  _id: string;
  title: {
    en: string;
    de: string;
    al: string;
  };
  description: {
    en: string;
    de: string;
    al: string;
  };
  description2: {
    en: string;
    de: string;
    al: string;
  };
  image: string;
  hoverImage?: string;
  stepImages: Array<{
    image: string;
    titleKey: string;
  }>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
```

## Usage

### Creating a New Service

1. Navigate to the admin dashboard
2. Go to Service Management
3. Fill in all required fields:
   - Title in all three languages
   - Description 1 in all three languages
   - Description 2 in all three languages
   - Upload main service image
   - Upload 3 step images with title keys
4. Click "Create Service"

### Required Fields

- **Title**: Service name in English, German, and Albanian
- **Description 1**: Primary service description in all languages
- **Description 2**: Secondary service description in all languages
- **Main Image**: Primary service image
- **Step Images**: Exactly 3 images with title keys (e.g., "planning", "construction", "completion")

### Step Image Title Keys

Common title keys for step images:
- `planning` - Planning phase
- `construction` - Construction phase
- `completion` - Completion phase
- `design` - Design phase
- `fabrication` - Fabrication phase
- `installation` - Installation phase
- `manufacturing` - Manufacturing phase
- `assembly` - Assembly phase

## API Endpoints

### GET /api/services
Retrieves all active services

### POST /api/services
Creates a new service (requires all fields)

### PUT /api/services
Updates an existing service

### DELETE /api/services?id={id}
Soft deletes a service (sets isActive to false)

## Seeding Data

To populate the database with sample services, use:
```
POST /api/seed-services
```

This will create three sample services with complete information.

## Translation Keys

The system uses the following translation keys for step-by-step content:
- `how_we_build` - "How We Build" section title
- `step_by_step` - "Step by Step" heading
- `step_by_step_desc` - Step by step description
- `view_more` - "View More" button
- `view_less` - "View Less" button

## Styling

The components use Tailwind CSS classes and follow the existing design system:
- Primary color: `#DD4624` (orange)
- Secondary color: `#191716` (dark)
- Text colors: `#F3F4F4` (light) and `#191716` (dark)
- Border radius: `15px` for main elements, `8px` for buttons

## Responsive Design

The components are fully responsive:
- Mobile-first approach
- Flexbox layouts that adapt to screen size
- Grid system for step images
- Optimized spacing and typography for all devices

## Animation

GSAP animations are used for:
- Slide-in effects for service information
- Fade-in effects for step-by-step content
- Smooth transitions for expandable sections

## File Structure

```
src/
├── app/
│   ├── components/
│   │   ├── admin/
│   │   │   └── ServiceManager.tsx
│   │   └── services/
│   │       ├── ServiceDetail.tsx
│   │       └── ServicesInPage.tsx
│   ├── services/
│   │   └── page.tsx
│   └── api/
│       └── services/
│           └── route.ts
├── models/
│   └── Service.ts
└── types/
    └── global.d.ts
```

## Troubleshooting

### Common Issues

1. **Missing Required Fields**: Ensure all language fields and images are provided
2. **Image Upload Failures**: Check file format and size limits
3. **Translation Issues**: Verify translation keys exist in i18n configuration
4. **Database Connection**: Ensure MongoDB connection is properly configured

### Validation

The system validates:
- All required language fields are filled
- Main image is uploaded
- Exactly 3 step images are provided with title keys
- File types are valid images

## Future Enhancements

Potential improvements:
- Image optimization and compression
- Bulk service import/export
- Service categories and tags
- Advanced search and filtering
- Service analytics and metrics
