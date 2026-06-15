import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-xml-formatter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './xml-formatter.component.html',
  styleUrl: './xml-formatter.component.css'
})
export class XmlFormatterComponent implements OnInit {
  inputXml: string = '';
  outputXml: string = '';
  error: string | null = null;
  notice: string | null = null;
  isValid = false;
  indentSize = 2;
  stats = {
    lines: 0,
    characters: 0,
    size: '0 B'
  };

  ngOnInit(): void {
    this.inputXml = `<catalog>
  <book id="bk101">
    <author>Gambardella, Matthew</author>
    <title>XML Developer's Guide</title>
    <price currency="USD">44.95</price>
  </book>
</catalog>`;
    this.format();
  }

  format(): void {
    try {
      this.error = null;
      this.notice = null;

      if (!this.inputXml.trim()) {
        this.outputXml = '';
        this.isValid = false;
        this.updateStats();
        return;
      }

      const document = this.parseXml(this.inputXml);
      const serialized = new XMLSerializer().serializeToString(document);
      this.outputXml = this.prettyPrint(serialized, this.indentSize);
      this.isValid = true;
      this.updateStats();
    } catch (error: any) {
      this.isValid = false;
      this.outputXml = '';
      this.error = error.message || 'Invalid XML';
      this.updateStats();
    }
  }

  minify(): void {
    try {
      this.error = null;
      this.notice = null;

      if (!this.inputXml.trim()) {
        this.outputXml = '';
        this.isValid = false;
        this.updateStats();
        return;
      }

      const document = this.parseXml(this.inputXml);
      this.outputXml = new XMLSerializer().serializeToString(document).replace(/>\s+</g, '><').trim();
      this.isValid = true;
      this.updateStats();
    } catch (error: any) {
      this.isValid = false;
      this.outputXml = '';
      this.error = error.message || 'Invalid XML';
      this.updateStats();
    }
  }

  validate(): void {
    this.format();
    if (this.isValid) {
      this.showNotice('XML is valid');
    }
  }

  useOutputAsInput(): void {
    if (!this.outputXml) {
      return;
    }

    this.inputXml = this.outputXml;
    this.format();
  }

  clearInput(): void {
    this.inputXml = '';
    this.outputXml = '';
    this.error = null;
    this.notice = null;
    this.isValid = false;
    this.updateStats();
  }

  copyToClipboard(text: string): void {
    if (!text) {
      return;
    }

    navigator.clipboard.writeText(text)
      .then(() => this.showNotice('Copied to clipboard'))
      .catch(() => this.showNotice('Clipboard access was blocked'));
  }

  downloadXml(): void {
    if (!this.outputXml) {
      this.showNotice('Format valid XML before downloading');
      return;
    }

    const element = document.createElement('a');
    const file = new Blob([this.outputXml], { type: 'application/xml' });
    const url = URL.createObjectURL(file);
    element.href = url;
    element.download = 'formatted.xml';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(url);
    this.showNotice('Downloaded formatted.xml');
  }

  uploadXml(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.inputXml = String(reader.result || '');
      this.format();
      input.value = '';
    };
    reader.onerror = () => {
      this.showNotice('Could not read that file');
      input.value = '';
    };
    reader.readAsText(file);
  }

  onIndentChange(): void {
    this.format();
  }

  onInputChange(): void {
    this.format();
  }

  private parseXml(xml: string): Document {
    const parser = new DOMParser();
    const document = parser.parseFromString(xml, 'application/xml');
    const parserError = document.getElementsByTagName('parsererror')[0];

    if (parserError) {
      const message = parserError.textContent?.replace(/\s+/g, ' ').trim() || 'Invalid XML format';
      throw new Error(message);
    }

    return document;
  }

  private prettyPrint(xml: string, indentSize: number): string {
    const indent = ' '.repeat(indentSize);
    const tokens = xml.replace(/>\s*</g, '><').replace(/(>)(<)(\/*)/g, '$1\n$2$3').trim().split('\n');
    let level = 0;

    return tokens
      .map((token) => {
        const isClosing = /^<\//.test(token);
        const isDeclaration = /^<\?/.test(token);
        const isComment = /^<!--/.test(token);
        const isSelfClosing = /\/>$/.test(token);
        const hasInlineClose = /^<[^!?/][\s\S]*>[^<]+<\/[^>]+>$/.test(token);

        if (isClosing) {
          level = Math.max(level - 1, 0);
        }

        const line = `${indent.repeat(level)}${token}`;

        if (!isClosing && !isDeclaration && !isComment && !isSelfClosing && !hasInlineClose) {
          level += 1;
        }

        return line;
      })
      .join('\n');
  }

  private updateStats(): void {
    const text = this.outputXml || this.inputXml;
    this.stats.lines = text ? text.split('\n').length : 0;
    this.stats.characters = text.length;
    this.stats.size = this.formatBytes(new Blob([text]).size);
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) {
      return '0 B';
    }

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.min(Math.floor(Math.log(bytes) / Math.log(k)), sizes.length - 1);
    return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
  }

  private showNotice(message: string): void {
    this.notice = message;
    window.setTimeout(() => {
      if (this.notice === message) {
        this.notice = null;
      }
    }, 1800);
  }
}
