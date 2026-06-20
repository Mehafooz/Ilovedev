import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';

interface CompressedImage {
  original: {
    file: File;
    url: string;
    size: number;
    width: number;
    height: number;
  };
  compressed: {
    url: string;
    size: number;
    width: number;
    height: number;
  };
}

@Component({
  selector: 'app-image-compressor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './image-compressor.component.html',
  styleUrl: './image-compressor.component.css'
})
export class ImageCompressorComponent {
  quality: number = 0.8;
  maxWidth: number = 1920;
  maxHeight: number = 1080;
  maintainAspectRatio: boolean = true;
  compressedImage: CompressedImage | null = null;
  processing: boolean = false;
  error: string = '';

  qualityPresets = [
    { name: 'High Quality', value: 0.9, desc: 'Best quality, larger file' },
    { name: 'Balanced', value: 0.8, desc: 'Good quality, moderate size' },
    { name: 'Medium', value: 0.6, desc: 'Average quality, smaller size' },
    { name: 'Low', value: 0.4, desc: 'Lower quality, smallest file' }
  ];

  sizePresets = [
    { name: 'Original', width: 0, height: 0 },
    { name: 'Full HD', width: 1920, height: 1080 },
    { name: 'HD', width: 1280, height: 720 },
    { name: 'Standard', width: 800, height: 600 },
    { name: 'Thumbnail', width: 400, height: 300 }
  ];

  constructor(private titleService: Title, private metaService: Meta) {
    // SEO Optimization
    this.titleService.setTitle('Free Image Compressor Online - Reduce Image Size | DevTools');
    this.metaService.updateTag({ 
      name: 'description', 
      content: 'Free online image compressor. Compress JPEG, PNG, WebP images and reduce file size without losing quality. Fast, secure, and easy to use.' 
    });
    this.metaService.updateTag({ 
      name: 'keywords', 
      content: 'image compressor, compress image, reduce image size, image optimizer, compress jpeg, compress png, image compression online, free image compressor' 
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.match(/image.*/)) {
      this.error = 'Please select a valid image file (JPEG, PNG, WebP)';
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      this.error = 'File size must be less than 10MB';
      return;
    }

    this.error = '';
    this.compressImage(file);
  }

  async compressImage(file: File) {
    this.processing = true;
    this.error = '';

    try {
      // Create image element
      const img = await this.createImageElement(file);
      
      // Get original dimensions
      const originalWidth = img.width;
      const originalHeight = img.height;

      // Calculate new dimensions
      let targetWidth = this.maxWidth || originalWidth;
      let targetHeight = this.maxHeight || originalHeight;

      if (this.maintainAspectRatio) {
        const aspectRatio = originalWidth / originalHeight;
        
        if (targetWidth && !targetHeight) {
          targetHeight = targetWidth / aspectRatio;
        } else if (targetHeight && !targetWidth) {
          targetWidth = targetHeight * aspectRatio;
        } else if (targetWidth && targetHeight) {
          // Fit within bounds while maintaining aspect ratio
          const widthRatio = targetWidth / originalWidth;
          const heightRatio = targetHeight / originalHeight;
          const ratio = Math.min(widthRatio, heightRatio, 1);
          
          targetWidth = originalWidth * ratio;
          targetHeight = originalHeight * ratio;
        }
      }

      // Create canvas
      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        throw new Error('Could not get canvas context');
      }

      // Draw and compress
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
      
      // Convert to blob
      const compressedBlob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Compression failed'));
          },
          'image/jpeg',
          this.quality
        );
      });

      // Create result
      this.compressedImage = {
        original: {
          file: file,
          url: URL.createObjectURL(file),
          size: file.size,
          width: originalWidth,
          height: originalHeight
        },
        compressed: {
          url: URL.createObjectURL(compressedBlob),
          size: compressedBlob.size,
          width: targetWidth,
          height: targetHeight
        }
      };

    } catch (err) {
      this.error = 'Failed to compress image. Please try again.';
      console.error('Compression error:', err);
    } finally {
      this.processing = false;
    }
  }

  createImageElement(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  downloadCompressed() {
    if (!this.compressedImage) return;

    const link = document.createElement('a');
    link.href = this.compressedImage.compressed.url;
    link.download = `compressed-${this.compressedImage.original.file.name}`;
    link.click();
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  getCompressionRatio(): number {
    if (!this.compressedImage) return 0;
    const reduction = this.compressedImage.original.size - this.compressedImage.compressed.size;
    return Math.round((reduction / this.compressedImage.original.size) * 100);
  }

  setQualityPreset(quality: number) {
    this.quality = quality;
    if (this.compressedImage) {
      this.compressImage(this.compressedImage.original.file);
    }
  }

  setSizePreset(width: number, height: number) {
    this.maxWidth = width;
    this.maxHeight = height;
    if (this.compressedImage) {
      this.compressImage(this.compressedImage.original.file);
    }
  }

  reset() {
    if (this.compressedImage) {
      URL.revokeObjectURL(this.compressedImage.original.url);
      URL.revokeObjectURL(this.compressedImage.compressed.url);
    }
    this.compressedImage = null;
    this.error = '';
  }

  triggerFileInput() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput?.click();
  }
}
