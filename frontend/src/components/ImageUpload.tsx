import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  IconButton,
  Typography,
  Paper,
  LinearProgress,
  Alert,
  Card,
  CardMedia,
  CardActions,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Visibility as PreviewIcon,
} from '@mui/icons-material';

interface UploadedImage {
  url: string;
  filename: string;
  size: number;
  type: string;
}

interface ImageUploadProps {
  images: UploadedImage[];
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  maxSize?: number; // in MB
  allowedTypes?: string[];
  label?: string;
  multiple?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onImagesChange,
  maxImages = 10,
  maxSize = 5,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  label = 'Upload Images',
  multiple = true,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [previewDialog, setPreviewDialog] = useState<{ open: boolean; image?: UploadedImage }>({ open: false });
  const [urlDialog, setUrlDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const selectedFiles = Array.from(files);
    
    // Validate files
    for (const file of selectedFiles) {
      if (!allowedTypes.includes(file.type)) {
        setError(`Invalid file type: ${file.type}. Allowed types: ${allowedTypes.join(', ')}`);
        return;
      }
      
      if (file.size > maxSize * 1024 * 1024) {
        setError(`File too large: ${file.name}. Maximum size: ${maxSize}MB`);
        return;
      }
    }

    if (images.length + selectedFiles.length > maxImages) {
      setError(`Too many files. Maximum: ${maxImages} images`);
      return;
    }

    setError(null);
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      
      if (multiple && selectedFiles.length > 1) {
        selectedFiles.forEach((file) => {
          formData.append('images[]', file);
        });
        
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/admin/upload/images`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const result = await response.json();
        if (result.success) {
          // Convert backend response to UploadedImage format
          const uploadedImages = result.data.map((img: any) => ({
            url: `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${img.url}`,
            filename: img.filename,
            size: img.size,
            type: 'image/uploaded',
          }));
          onImagesChange([...images, ...uploadedImages]);
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      } else {
        // Single file upload
        formData.append('image', selectedFiles[0]);
        
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080/api'}/admin/upload/image`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const result = await response.json();
        if (result.success) {
          // Convert backend response to UploadedImage format
          const uploadedImage = {
            url: `${import.meta.env.VITE_API_URL || 'http://localhost:8080'}${result.data.url}`,
            filename: result.data.filename,
            size: result.data.size,
            type: 'image/uploaded',
          };
          onImagesChange([...images, uploadedImage]);
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }

    // Reset input
    event.target.value = '';
  }, [images, onImagesChange, maxImages, maxSize, allowedTypes, multiple]);

  const handleRemoveImage = useCallback(async (index: number) => {
    const imageToRemove = images[index];
    console.log('Removing image:', imageToRemove); // Debug log
    
    try {
      // Only try to delete from server if it's an uploaded file (not a URL-based image)
      const isUploadedFile = imageToRemove.type === 'image/uploaded' || 
                           (imageToRemove.url.includes('/uploads/') && imageToRemove.type !== 'image/url');
      
      console.log('Is uploaded file?', isUploadedFile); // Debug log
      
      if (isUploadedFile) {
        console.log('Attempting to delete from server:', imageToRemove.filename); // Debug log
        
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8080'}/api/admin/delete/image`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filename: imageToRemove.filename
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Server delete error:', errorData); // Debug log
          throw new Error(`Failed to delete image from server: ${errorData.error || response.statusText}`);
        }
        console.log('Successfully deleted from server'); // Debug log
      } else {
        console.log('Skipping server deletion for URL-based image'); // Debug log
      }
      
      // Remove from local state (for both uploaded files and URL-based images)
      const newImages = images.filter((_, i) => i !== index);
      onImagesChange(newImages);
      console.log('Image removed from local state'); // Debug log
    } catch (err) {
      console.error('Error in handleRemoveImage:', err); // Debug log
      setError(err instanceof Error ? err.message : 'Failed to delete image');
    }
  }, [images, onImagesChange]);

  const handleAddByUrl = useCallback(() => {
    if (!imageUrl.trim()) return;

    // Simple URL validation
    try {
      new URL(imageUrl);
    } catch {
      setError('Invalid URL');
      return;
    }

    const newImage: UploadedImage = {
      url: imageUrl,
      filename: imageUrl.split('/').pop() || 'url-image',
      size: 0,
      type: 'image/url',
    };

    onImagesChange([...images, newImage]);
    setImageUrl('');
    setUrlDialog(false);
  }, [imageUrl, images, onImagesChange]);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        {label} ({images.length}/{maxImages})
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {/* Upload area */}
      <Paper
        sx={{
          p: 3,
          mb: 2,
          border: '2px dashed',
          borderColor: 'grey.300',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <input
          accept={allowedTypes.join(',')}
          style={{ display: 'none' }}
          id="image-upload"
          multiple={multiple}
          type="file"
          onChange={handleFileSelect}
          disabled={uploading || images.length >= maxImages}
        />
        
        <label htmlFor="image-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={<UploadIcon />}
            disabled={uploading || images.length >= maxImages}
            sx={{ mb: 1 }}
          >
            {uploading ? 'Uploading...' : 'Choose Files'}
          </Button>
        </label>

        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setUrlDialog(true)}
          disabled={uploading || images.length >= maxImages}
          sx={{ ml: 2, mb: 1 }}
        >
          Add by URL
        </Button>

        <Typography variant="body2" color="text.secondary">
          Drag & drop files here or click to browse
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Max {maxImages} files, up to {maxSize}MB each
        </Typography>

        {uploading && (
          <Box sx={{ mt: 2 }}>
            <LinearProgress variant="indeterminate" />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
              Uploading...
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Image grid */}
      {images.length > 0 && (
        <Grid container spacing={2}>
          {images.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card>
                <CardMedia
                  component="img"
                  height="150"
                  image={image.url}
                  alt={`Upload ${index + 1}`}
                  sx={{ objectFit: 'cover' }}
                />
                <CardActions sx={{ justifyContent: 'space-between', p: 1 }}>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="caption" noWrap>
                      {image.filename}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" display="block">
                      {formatFileSize(image.size)}
                    </Typography>
                  </Box>
                  <Box>
                    <IconButton
                      size="small"
                      onClick={() => setPreviewDialog({ open: true, image })}
                    >
                      <PreviewIcon />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveImage(index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={previewDialog.open}
        onClose={() => setPreviewDialog({ open: false })}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Image Preview</DialogTitle>
        <DialogContent>
          {previewDialog.image && (
            <Box sx={{ textAlign: 'center' }}>
              <img
                src={previewDialog.image.url}
                alt="Preview"
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '60vh', 
                  objectFit: 'contain' 
                }}
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                {previewDialog.image.filename} - {formatFileSize(previewDialog.image.size)}
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPreviewDialog({ open: false })}>
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* URL Dialog */}
      <Dialog open={urlDialog} onClose={() => setUrlDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add Image by URL</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Image URL"
            type="url"
            fullWidth
            variant="outlined"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUrlDialog(false)}>Cancel</Button>
          <Button onClick={handleAddByUrl} variant="contained">
            Add Image
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ImageUpload; 