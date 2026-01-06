import axios from 'axios';

const API_BASE_URL = '/api/v2';

/**
 * Upload single file to backend (local storage)
 * @param {File} file - File object from input
 * @param {string} folder - Folder name (e.g., 'products', 'brands', 'categories')
 * @param {function} onProgress - Progress callback (percent: 0-100)
 * @param {function} onError - Error callback
 * @param {function} onSuccess - Success callback with URL
 */
export const uploadSingleFile = (file, folder, onProgress, onError, onSuccess) => {
  // If file is already a URL string, return it immediately
  if (typeof file === 'string') {
    if (onSuccess) onSuccess(file);
    return;
  }

  const formData = new FormData();

  // Determine field name and endpoint based on folder
  if (folder === 'products') {
    formData.append('thumbnail', file);
  } else {
    formData.append('image', file);
  }

  const endpoint = folder === 'products' ? `${API_BASE_URL}/upload/product-images` : `${API_BASE_URL}/upload/image`;

  axios
    .post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (onProgress) onProgress(percent);
      }
    })
    .then((response) => {
      const { data } = response;

      // Extract image URL from response
      let imageUrl = data?.data?.thumbnail || data?.data?.url;

      if (!imageUrl) {
        console.error('Response data:', data);
        throw new Error('No image URL in response');
      }

      // Ensure imageUrl is a string
      if (typeof imageUrl !== 'string') {
        console.error('Invalid imageUrl type:', typeof imageUrl, imageUrl);
        throw new Error('Image URL is not a string');
      }

      // Ensure URL is absolute
      if (!imageUrl.startsWith('http')) {
        imageUrl = `http://localhost:3001${imageUrl}`;
      }

      if (onSuccess) onSuccess(imageUrl);
    })
    .catch((error) => {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
      if (onError) onError(errorMessage);
    });
};

/**
 * Upload multiple files to backend (local storage)
 * @param {File[]} files - Array of File objects
 * @param {string} _folder - Folder name
 * @param {function} onProgress - Progress callback
 * @param {function} onError - Error callback
 * @param {function} onSuccess - Success callback with array of URLs
 */
export const uploadMultipleFiles = (files, _folder, onProgress, onError, onSuccess) => {
  if (!files || files.length === 0) {
    if (onSuccess) onSuccess([]);
    return;
  }

  const formData = new FormData();

  // Append all files with field name 'pictures'
  files.forEach((file) => {
    formData.append('pictures', file);
  });

  const endpoint = `${API_BASE_URL}/upload/product-images`;

  axios
    .post(endpoint, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        authorization: `Bearer ${localStorage.getItem('accessToken')}`
      },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        if (onProgress) onProgress(percent);
      }
    })
    .then((response) => {
      const { data } = response;
      let imageUrls = data?.data?.pictures || [];

      // Ensure imageUrls is an array
      if (!Array.isArray(imageUrls)) {
        console.error('Invalid imageUrls type:', typeof imageUrls, imageUrls);
        imageUrls = [];
      }

      // Ensure all URLs are strings and absolute
      imageUrls = imageUrls
        .filter((url) => typeof url === 'string') // Only keep strings
        .map((url) => {
          if (!url.startsWith('http')) {
            return `http://localhost:3001${url}`;
          }
          return url;
        });

      if (onSuccess) onSuccess(imageUrls);
    })
    .catch((error) => {
      console.error('Upload error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Upload failed';
      if (onError) onError(errorMessage);
    });
};

// For backward compatibility with Firebase helper
export const firebaseUploadSingle = uploadSingleFile;
export const firebaseUploadMultiple = uploadMultipleFiles;
