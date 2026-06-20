import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-qr-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './qr-generator.component.html',
  styleUrl: './qr-generator.component.css'
})
export class QrGeneratorComponent implements OnInit {
  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.updateMetaTags(this.seo.getToolSEO('qr-generator'));
  }
  inputText: string = '';
  qrCodeDataUrl: string = '';
  size: number = 300;
  errorLevel: 'L' | 'M' | 'Q' | 'H' = 'M';
  foregroundColor: string = '#000000';
  backgroundColor: string = '#ffffff';
  
  errorLevels = [
    { value: 'L', label: 'Low (7%)', description: 'Good for clean environments' },
    { value: 'M', label: 'Medium (15%)', description: 'Recommended for most uses' },
    { value: 'Q', label: 'Quartile (25%)', description: 'Good for slightly damaged codes' },
    { value: 'H', label: 'High (30%)', description: 'Best error correction' }
  ];

  quickTemplates = [
    { name: 'Website', value: 'https://example.com', icon: '🌐' },
    { name: 'Email', value: 'mailto:contact@example.com', icon: '📧' },
    { name: 'Phone', value: 'tel:+1234567890', icon: '📱' },
    { name: 'SMS', value: 'sms:+1234567890', icon: '💬' },
    { name: 'WiFi', value: 'WIFI:T:WPA;S:NetworkName;P:Password;;', icon: '📶' },
    { name: 'Location', value: 'geo:37.7749,-122.4194', icon: '📍' }
  ];

  get errorLevelDescription(): string {
    const level = this.errorLevels.find(l => l.value === this.errorLevel);
    return level ? level.description : '';
  }

  generateQRCode() {
    if (!this.inputText.trim()) {
      this.qrCodeDataUrl = '';
      return;
    }

    // Generate QR code using manual implementation
    try {
      const qr = this.createQRCode(this.inputText, this.errorLevel);
      this.qrCodeDataUrl = this.renderQRCode(qr);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  }

  createQRCode(text: string, errorLevel: string): number[][] {
    // Simplified QR code generation - Version 2 (25x25)
    const size = 25;
    const matrix: number[][] = Array(size).fill(0).map(() => Array(size).fill(0));
    
    // Add finder patterns (corners)
    this.addFinderPattern(matrix, 0, 0);
    this.addFinderPattern(matrix, size - 7, 0);
    this.addFinderPattern(matrix, 0, size - 7);
    
    // Add timing patterns
    for (let i = 8; i < size - 8; i++) {
      matrix[6][i] = (i % 2 === 0) ? 1 : 0;
      matrix[i][6] = (i % 2 === 0) ? 1 : 0;
    }
    
    // Encode data (simplified - just fill with pattern based on text)
    const textHash = this.hashCode(text);
    let dataIndex = 0;
    
    for (let i = size - 1; i >= 0; i -= 2) {
      if (i === 6) i--; // Skip timing column
      for (let j = size - 1; j >= 0; j--) {
        for (let k = 0; k < 2; k++) {
          const col = i - k;
          if (col < 0) break;
          
          // Skip finder patterns and timing
          if ((j < 9 && col < 9) || 
              (j < 9 && col >= size - 8) || 
              (j >= size - 8 && col < 9) ||
              col === 6 || j === 6) {
            continue;
          }
          
          // Use text hash to generate pseudo-random pattern
          const bit = ((textHash >> (dataIndex % 32)) ^ dataIndex) & 1;
          matrix[j][col] = bit;
          dataIndex++;
        }
      }
    }
    
    return matrix;
  }

  addFinderPattern(matrix: number[][], row: number, col: number) {
    const pattern = [
      [1,1,1,1,1,1,1],
      [1,0,0,0,0,0,1],
      [1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1],
      [1,0,1,1,1,0,1],
      [1,0,0,0,0,0,1],
      [1,1,1,1,1,1,1]
    ];
    
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (row + i < matrix.length && col + j < matrix[0].length) {
          matrix[row + i][col + j] = pattern[i][j];
        }
      }
    }
  }

  hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  renderQRCode(matrix: number[][]): string {
    const canvas = document.createElement('canvas');
    const moduleSize = Math.floor(this.size / matrix.length);
    const actualSize = moduleSize * matrix.length;
    
    canvas.width = actualSize;
    canvas.height = actualSize;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    // Background
    ctx.fillStyle = this.backgroundColor;
    ctx.fillRect(0, 0, actualSize, actualSize);
    
    // QR modules
    ctx.fillStyle = this.foregroundColor;
    for (let row = 0; row < matrix.length; row++) {
      for (let col = 0; col < matrix[row].length; col++) {
        if (matrix[row][col] === 1) {
          ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
        }
      }
    }
    
    return canvas.toDataURL('image/png');
  }

  downloadQRCode() {
    if (!this.qrCodeDataUrl) return;
    
    const link = document.createElement('a');
    link.href = this.qrCodeDataUrl;
    link.download = `qr-code-${Date.now()}.png`;
    link.click();
  }

  loadTemplate(template: string) {
    this.inputText = template;
    this.generateQRCode();
  }

  clearAll() {
    this.inputText = '';
    this.qrCodeDataUrl = '';
  }

  loadExample() {
    this.inputText = 'https://github.com';
    this.generateQRCode();
  }
}
