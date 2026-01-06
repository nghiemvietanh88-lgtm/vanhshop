import { Router } from 'express';
import { allowImageMineTypes } from '../../constants.js';
import UploadUtils from '../../utils/UploadUtils.js';
import { isAdminOrStaff } from '../../middlewares/jwt-auth.js';

const router = Router();

// Upload for products
const uploadProduct = UploadUtils.multerUpload('/products/', allowImageMineTypes, 21);
const uploadProductFields = [{ name: 'thumbnail', maxCount: 1 }, { name: 'pictures', maxCount: 20 }];

// Upload for brands/categories
const uploadSingle = UploadUtils.multerUpload('/brands/', allowImageMineTypes, 1);

/**
 * POST /upload/product-images
 * Upload thumbnail and/or pictures for products
 */
router.post('/product-images',
  isAdminOrStaff,
  uploadProduct.fields(uploadProductFields),
  UploadUtils.handleFilePath(uploadProductFields),
  (req, res) => {
    console.log('Upload req.body:', req.body);
    console.log('Upload req.files:', req.files);

    // handleFilePath sets:
    // - thumbnail: array with 1 string (from single file)
    // - pictures: array of strings (from multiple files)

    const thumbnail = Array.isArray(req.body.thumbnail)
      ? req.body.thumbnail[0]  // Get first item if array
      : req.body.thumbnail;     // Or use as-is if already string

    const pictures = Array.isArray(req.body.pictures)
      ? req.body.pictures       // Use array as-is
      : [];                     // Default to empty array

    res.json({
      success: true,
      data: {
        thumbnail,
        pictures
      }
    });
  }
);

/**
 * POST /upload/image
 * Upload single image (for brands, categories, etc.)
 */
router.post('/image',
  isAdminOrStaff,
  uploadSingle.single('image'),
  UploadUtils.handleFilePath('image'),
  (req, res) => {
    res.json({
      success: true,
      data: {
        url: req.body.image
      }
    });
  }
);

export default router;
