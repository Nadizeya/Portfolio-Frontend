# Cloudinary Image Upload Setup

This guide will help you set up Cloudinary for uploading skill icons in your admin dashboard.

## Prerequisites

- Cloudinary account (free tier works fine)
- Your Cloudinary credentials from `.env.backend` or Cloudinary dashboard

## Step 1: Create an Unsigned Upload Preset

Unsigned upload presets allow you to upload images from the frontend without exposing your API secret.

### Instructions:

1. **Log in to Cloudinary**
   - Go to [cloudinary.com](https://cloudinary.com)
   - Log in to your account

2. **Navigate to Settings**
   - Click on the gear icon (⚙️) in the top right
   - Go to **Upload** tab

3. **Create Upload Preset**
   - Scroll down to **Upload presets** section
   - Click **Add upload preset**

4. **Configure the Preset**
   - **Upload preset name**: `portfolio_unsigned` (or any name you prefer)
   - **Signing Mode**: Select **Unsigned** ⚠️ (This is important!)
   - **Folder**: `portfolio/skills` (optional but recommended for organization)
   - **Allowed formats**: `png, jpg, jpeg, svg, webp`
   - **Max file size**: `2000000` (2MB)
   - **Transformation**: Optional - you can set default transformations like resizing

5. **Save the Preset**
   - Click **Save** at the bottom

## Step 2: Update Environment Variables

### Frontend `.env` file:

Already configured! Just verify these values:

```env
VITE_CLOUDINARY_CLOUD_NAME=dmkhpdmvz
VITE_CLOUDINARY_UPLOAD_PRESET=portfolio_unsigned
```

**Note**: If you used a different preset name in Step 1, update `VITE_CLOUDINARY_UPLOAD_PRESET` accordingly.

### Backend `.env` file (if you have one):

```env
CLOUDINARY_CLOUD_NAME=dmkhpdmvz
CLOUDINARY_API_KEY=311493246792852
CLOUDINARY_API_SECRET=X7ZpKXM0EzZlid3zebsVJKEZgJU
```

## Step 3: Test the Upload

1. **Restart your dev server** (important for env variables to load):

   ```bash
   npm run dev
   ```

2. **Navigate to Admin Skills**
   - Go to `/admin/login`
   - Log in to your admin panel
   - Go to Skills section
   - Click "Add Skill"

3. **Upload an Icon**
   - Click "Upload Image" button
   - Select an image file (PNG, JPG, SVG, WebP)
   - Wait for upload to complete
   - You should see a preview of the uploaded image

## Troubleshooting

### Upload fails with "Invalid upload preset"

- **Solution**: Make sure you created the unsigned upload preset in Cloudinary
- Double-check the preset name matches what's in your `.env` file

### Upload fails with CORS error

- **Solution**: In Cloudinary settings, add your domain to allowed origins
  1. Go to Settings → Security
  2. Add `http://localhost:5173` (or your dev server URL)
  3. Add your production domain if deployed

### "Failed to upload image" error

- **Solution**: Check browser console for detailed error
- Verify file size is under 2MB
- Verify file format is supported (png, jpg, jpeg, svg, webp)

### Image uploads but doesn't display

- **Solution**: Check if the URL is valid
- Verify the image is accessible (try opening the URL in a browser)
- Check browser console for errors

## Alternative: Using Icon URLs

Don't want to upload? You can still paste icon URLs directly:

### Simple Icons CDN (Recommended)

```
https://cdn.simpleicons.org/react
https://cdn.simpleicons.org/typescript
https://cdn.simpleicons.org/nodejs
```

Browse icons: [simpleicons.org](https://simpleicons.org/)

### With Custom Colors

```
https://cdn.simpleicons.org/react/61DAFB
https://cdn.simpleicons.org/typescript/3178C6
```

## Features

✅ **Upload from device**: Choose images from your computer
✅ **Paste URL**: Use external icon URLs (Simple Icons, etc.)
✅ **Image preview**: See the icon before saving
✅ **Size validation**: Max 2MB per image
✅ **Format validation**: PNG, JPG, SVG, WebP supported
✅ **Error handling**: Clear error messages
✅ **Loading states**: Visual feedback during upload

## Security Notes

- ✅ No API secrets exposed in frontend code
- ✅ Unsigned uploads use secure presets
- ✅ File size and format validation
- ✅ Images stored in Cloudinary (CDN)
- ✅ Automatic optimization and caching

## Need Help?

If you encounter issues:

1. Check the browser console for errors
2. Verify your Cloudinary credentials
3. Test the upload preset in Cloudinary's Media Library
4. Make sure your dev server restarted after env changes
