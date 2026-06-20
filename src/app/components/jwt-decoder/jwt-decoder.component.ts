import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';

interface DecodedJWT {
  header: any;
  payload: any;
  signature: string;
  isValid: boolean;
  error?: string;
}

@Component({
  selector: 'app-jwt-decoder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './jwt-decoder.component.html',
  styleUrl: './jwt-decoder.component.css'
})
export class JwtDecoderComponent {
  jwtInput: string = '';
  decoded: DecodedJWT | null = null;
  copiedSection: string = '';

  constructor(private titleService: Title, private metaService: Meta) {
    // SEO Optimization
    this.titleService.setTitle('Free JWT Decoder Online - Decode JSON Web Tokens | DevTools');
    this.metaService.updateTag({ 
      name: 'description', 
      content: 'Free online JWT decoder tool. Decode and analyze JSON Web Tokens (JWT) instantly. View header, payload, and signature. Perfect for debugging authentication tokens.' 
    });
    this.metaService.updateTag({ 
      name: 'keywords', 
      content: 'jwt decoder, jwt parser, json web token decoder, decode jwt online, jwt debugger, jwt tool, jwt analyzer, free jwt decoder' 
    });
  }

  decodeJWT() {
    this.copiedSection = '';
    
    if (!this.jwtInput.trim()) {
      this.decoded = null;
      return;
    }

    try {
      const parts = this.jwtInput.trim().split('.');
      
      if (parts.length !== 3) {
        this.decoded = {
          header: null,
          payload: null,
          signature: '',
          isValid: false,
          error: 'Invalid JWT format. A JWT must have exactly 3 parts separated by dots.'
        };
        return;
      }

      const [headerB64, payloadB64, signature] = parts;

      try {
        // Decode header
        const headerJson = atob(headerB64.replace(/-/g, '+').replace(/_/g, '/'));
        const header = JSON.parse(headerJson);

        // Decode payload
        const payloadJson = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
        const payload = JSON.parse(payloadJson);

        this.decoded = {
          header,
          payload,
          signature,
          isValid: true
        };

      } catch (e) {
        this.decoded = {
          header: null,
          payload: null,
          signature: '',
          isValid: false,
          error: 'Failed to decode JWT. The token may be malformed or corrupted.'
        };
      }
    } catch (e) {
      this.decoded = {
        header: null,
        payload: null,
        signature: '',
        isValid: false,
        error: 'An unexpected error occurred while decoding the JWT.'
      };
    }
  }

  copyToClipboard(text: string, section: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.copiedSection = section;
      setTimeout(() => {
        this.copiedSection = '';
      }, 2000);
    });
  }

  formatJson(obj: any): string {
    return JSON.stringify(obj, null, 2);
  }

  clearAll() {
    this.jwtInput = '';
    this.decoded = null;
    this.copiedSection = '';
  }

  loadExample() {
    // Example JWT token
    this.jwtInput = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE3MzQ1Njc4OTAsImVtYWlsIjoiam9obkBleGFtcGxlLmNvbSIsInJvbGUiOiJhZG1pbiJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
    this.decodeJWT();
  }

  getTimestamp(timestamp: number): string {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  }

  isExpired(exp: number): boolean {
    if (!exp) return false;
    return Date.now() > exp * 1000;
  }
}
