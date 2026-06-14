import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-json-formatter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './json-formatter.component.html',
  styleUrl: './json-formatter.component.css'
})
export class JsonFormatterComponent implements OnInit {
  inputJson: string = '';
  outputJson: string = '';
  error: string | null = null;
  isValid: boolean = false;
  stats = {
    lines: 0,
    characters: 0,
    size: '0 B'
  };
  indentSize: number = 2;
  showMinified: boolean = false;

  ngOnInit(): void {
    // Initialize with sample JSON
    this.inputJson = JSON.stringify({
      name: 'JSON Formatter',
      version: '1.0.0',
      features: ['Format', 'Validate', 'Minify'],
      isActive: true
    }, null, 2);
    this.format();
  }

  format(): void {
    try {
      this.error = null;
      
      if (!this.inputJson.trim()) {
        this.outputJson = '';
        this.isValid = false;
        this.updateStats();
        return;
      }

      // Parse the JSON
      const parsed = JSON.parse(this.inputJson);
      
      // Format with selected indentation
      const formatted = JSON.stringify(parsed, null, this.indentSize);
      this.outputJson = formatted;
      this.isValid = true;
      this.updateStats();
    } catch (e: any) {
      this.isValid = false;
      this.error = e.message || 'Invalid JSON';
      this.outputJson = '';
    }
  }

  minify(): void {
    try {
      this.error = null;
      
      if (!this.inputJson.trim()) {
        this.outputJson = '';
        this.isValid = false;
        return;
      }

      const parsed = JSON.parse(this.inputJson);
      this.outputJson = JSON.stringify(parsed);
      this.isValid = true;
      this.updateStats();
    } catch (e: any) {
      this.isValid = false;
      this.error = e.message || 'Invalid JSON';
      this.outputJson = '';
    }
  }

  beautify(): void {
    this.showMinified = false;
    this.format();
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  }

  swapInputOutput(): void {
    [this.inputJson, this.outputJson] = [this.outputJson, this.inputJson];
    this.format();
  }

  clearInput(): void {
    this.inputJson = '';
    this.outputJson = '';
    this.error = null;
    this.isValid = false;
    this.updateStats();
  }

  downloadJson(): void {
    if (!this.outputJson) {
      alert('No formatted JSON to download');
      return;
    }

    const element = document.createElement('a');
    const file = new Blob([this.outputJson], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = 'formatted.json';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  uploadJson(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.inputJson = e.target.result;
        this.format();
      };
      reader.readAsText(file);
    }
  }

  private updateStats(): void {
    const outputText = this.outputJson || this.inputJson;
    this.stats.lines = outputText ? outputText.split('\n').length : 0;
    this.stats.characters = outputText.length;
    this.stats.size = this.formatBytes(new Blob([outputText]).size);
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  onIndentChange(): void {
    this.format();
  }
}
