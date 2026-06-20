import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-base64-encoder',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './base64-encoder.component.html',
  styleUrl: './base64-encoder.component.css'
})
export class Base64EncoderComponent implements OnInit {
  constructor(private seo: SeoService) {}

  mode: 'encode' | 'decode' = 'encode';
  inputText: string = '';
  outputText: string = '';
  error: string = '';
  copied: boolean = false;

  ngOnInit(): void {
    this.seo.updateMetaTags(this.seo.getToolSEO('base64-encoder'));
  }

  switchMode(newMode: 'encode' | 'decode') {
    this.mode = newMode;
    this.error = '';
    this.convert();
  }

  convert() {
    this.error = '';
    this.copied = false;

    if (!this.inputText.trim()) {
      this.outputText = '';
      return;
    }

    try {
      if (this.mode === 'encode') {
        this.outputText = btoa(unescape(encodeURIComponent(this.inputText)));
      } else {
        this.outputText = decodeURIComponent(escape(atob(this.inputText)));
      }
    } catch (e) {
      this.error = this.mode === 'encode' 
        ? 'Error encoding text. Please check your input.'
        : 'Invalid Base64 string. Please check your input.';
      this.outputText = '';
    }
  }

  copyToClipboard() {
    if (this.outputText) {
      navigator.clipboard.writeText(this.outputText).then(() => {
        this.copied = true;
        setTimeout(() => {
          this.copied = false;
        }, 2000);
      });
    }
  }

  clearAll() {
    this.inputText = '';
    this.outputText = '';
    this.error = '';
    this.copied = false;
  }

  swapInputOutput() {
    if (this.outputText && !this.error) {
      const temp = this.inputText;
      this.inputText = this.outputText;
      this.outputText = temp;
      this.mode = this.mode === 'encode' ? 'decode' : 'encode';
      this.convert();
    }
  }

  loadExample() {
    if (this.mode === 'encode') {
      this.inputText = 'Hello, World! This is a Base64 encoding example.';
    } else {
      this.inputText = 'SGVsbG8sIFdvcmxkISBUaGlzIGlzIGEgQmFzZTY0IGVuY29kaW5nIGV4YW1wbGUu';
    }
    this.convert();
  }
}
