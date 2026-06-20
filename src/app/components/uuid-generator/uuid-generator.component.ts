import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-uuid-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './uuid-generator.component.html',
  styleUrl: './uuid-generator.component.css'
})
export class UuidGeneratorComponent implements OnInit {
  constructor(private seo: SeoService) {}

  singleUuid: string = '';
  bulkUuids: string[] = [];
  bulkCount: number = 10;
  uuidVersion: 'v4' | 'v1' = 'v4';
  format: 'default' | 'uppercase' | 'no-hyphens' = 'default';
  copiedIndex: number = -1;

  ngOnInit(): void {
    this.seo.updateMetaTags(this.seo.getToolSEO('uuid-generator'));
    this.generateSingle();
  }

  generateSingle() {
    this.singleUuid = this.generateUUID();
    this.copiedIndex = -1;
  }

  generateBulk() {
    const count = Math.min(Math.max(this.bulkCount, 1), 1000);
    this.bulkUuids = Array.from({ length: count }, () => this.generateUUID());
    this.copiedIndex = -1;
  }

  generateUUID(): string {
    let uuid: string;
    
    if (this.uuidVersion === 'v4') {
      // Generate UUID v4
      uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    } else {
      // Generate UUID v1 (time-based)
      const now = Date.now();
      const clockSeq = Math.floor(Math.random() * 0x3fff);
      const node = Math.floor(Math.random() * 0xffffffffffff);
      
      const timeLow = (now & 0xffffffff).toString(16).padStart(8, '0');
      const timeMid = ((now / 0x100000000) & 0xffff).toString(16).padStart(4, '0');
      const timeHi = (((now / 0x1000000000000) & 0x0fff) | 0x1000).toString(16).padStart(4, '0');
      const clockSeqHi = ((clockSeq >>> 8) | 0x80).toString(16).padStart(2, '0');
      const clockSeqLow = (clockSeq & 0xff).toString(16).padStart(2, '0');
      const nodeStr = node.toString(16).padStart(12, '0');
      
      uuid = `${timeLow}-${timeMid}-${timeHi}-${clockSeqHi}${clockSeqLow}-${nodeStr}`;
    }

    return this.formatUUID(uuid);
  }

  formatUUID(uuid: string): string {
    switch (this.format) {
      case 'uppercase':
        return uuid.toUpperCase();
      case 'no-hyphens':
        return uuid.replace(/-/g, '');
      default:
        return uuid;
    }
  }

  copyToClipboard(uuid: string, index: number = -1) {
    navigator.clipboard.writeText(uuid).then(() => {
      this.copiedIndex = index;
      setTimeout(() => {
        this.copiedIndex = -1;
      }, 2000);
    });
  }

  copyAll() {
    const allUuids = this.bulkUuids.join('\n');
    navigator.clipboard.writeText(allUuids).then(() => {
      this.copiedIndex = -2;
      setTimeout(() => {
        this.copiedIndex = -1;
      }, 2000);
    });
  }

  downloadAsFile() {
    const content = this.bulkUuids.join('\n');
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `uuids-${Date.now()}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
  }
}
