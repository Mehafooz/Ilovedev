import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-xml-json',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './xml-json.component.html',
  styleUrl: './xml-json.component.css'
})
export class XmlJsonComponent implements OnInit {
  inputValue: string = '';
  outputValue: string = '';
  error: string | null = null;
  notice: string | null = null;
  isValid: boolean = false;
  mode: 'xml-to-json' | 'json-to-xml' = 'xml-to-json';

  ngOnInit(): void {
    const sampleXml = `<root>
  <item>
    <name>Example</name>
    <value>123</value>
  </item>
</root>`;
    this.inputValue = sampleXml;
    this.convert();
  }

  convert(): void {
    try {
      this.error = null;
      this.notice = null;

      if (!this.inputValue.trim()) {
        this.outputValue = '';
        this.isValid = false;
        return;
      }

      if (this.mode === 'xml-to-json') {
        this.outputValue = this.xmlToJson(this.inputValue);
      } else {
        this.outputValue = this.jsonToXml(this.inputValue);
      }

      this.isValid = true;
    } catch (e: any) {
      this.isValid = false;
      this.error = e.message || 'Conversion error';
      this.outputValue = '';
    }
  }

  swapDirection(): void {
    if (this.mode === 'xml-to-json') {
      this.mode = 'json-to-xml';
    } else {
      this.mode = 'xml-to-json';
    }
    [this.inputValue, this.outputValue] = [this.outputValue, this.inputValue];
    this.convert();
  }

  setMode(newMode: 'xml-to-json' | 'json-to-xml'): void {
    this.mode = newMode;
    this.convert();
  }

  copyToClipboard(text: string): void {
    if (!text) {
      return;
    }

    navigator.clipboard.writeText(text)
      .then(() => this.showNotice('Copied to clipboard'))
      .catch(() => this.showNotice('Clipboard access was blocked'));
  }

  clearAll(): void {
    this.inputValue = '';
    this.outputValue = '';
    this.error = null;
    this.notice = null;
    this.isValid = false;
  }

  downloadOutput(): void {
    if (!this.outputValue) {
      this.showNotice('Convert valid input before downloading');
      return;
    }

    const ext = this.mode === 'xml-to-json' ? 'json' : 'xml';
    const element = document.createElement('a');
    const file = new Blob([this.outputValue], { 
      type: this.mode === 'xml-to-json' ? 'application/json' : 'application/xml' 
    });
    const url = URL.createObjectURL(file);
    element.href = url;
    element.download = `output.${ext}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    URL.revokeObjectURL(url);
    this.showNotice(`Downloaded output.${ext}`);
  }

  uploadFile(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.inputValue = String(reader.result || '');
        this.convert();
        input.value = '';
      };
      reader.onerror = () => {
        this.showNotice('Could not read that file');
        input.value = '';
      };
      reader.readAsText(file);
    }
  }

  private xmlToJson(xml: string): string {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');

    const parserError = xmlDoc.getElementsByTagName('parsererror')[0];
    if (parserError) {
      const message = parserError.textContent?.replace(/\s+/g, ' ').trim() || 'Invalid XML format';
      throw new Error(message);
    }

    const result = {
      [xmlDoc.documentElement.nodeName]: this.parseXmlElement(xmlDoc.documentElement)
    };
    return JSON.stringify(result, null, 2);
  }

  private parseXmlElement(element: Element): any {
    const obj: any = {};

    // Add attributes
    if (element.attributes.length > 0) {
      obj['@attributes'] = {};
      for (let i = 0; i < element.attributes.length; i++) {
        const attr = element.attributes[i];
        obj['@attributes'][attr.name] = attr.value;
      }
    }

    const childMap: any = {};
    const directText: string[] = [];

    for (let i = 0; i < element.childNodes.length; i++) {
      const child = element.childNodes[i];

      if (child.nodeType === Node.TEXT_NODE || child.nodeType === Node.CDATA_SECTION_NODE) {
        const text = child.textContent?.trim();
        if (text) {
          directText.push(text);
        }
        continue;
      }

      if (child.nodeType !== Node.ELEMENT_NODE) {
        continue;
      }

      const childElement = child as Element;
      const childObj = this.parseXmlElement(childElement);
      const childName = childElement.nodeName;

      if (childMap[childName]) {
        if (!Array.isArray(childMap[childName])) {
          childMap[childName] = [childMap[childName]];
        }
        childMap[childName].push(childObj);
      } else {
        childMap[childName] = childObj;
      }
    }

    const text = directText.join(' ');
    if (text && Object.keys(childMap).length === 0 && Object.keys(obj).length === 0) {
      return text;
    }

    const result = { ...obj, ...childMap };
    if (text) {
      result['#text'] = text;
    }

    return Object.keys(result).length > 0 ? result : '';
  }

  private jsonToXml(json: string): string {
    const parsed = JSON.parse(json);
    const keys = Object.keys(parsed);

    if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed) || keys.length !== 1) {
      return this.valueToXml('root', parsed);
    }

    return this.valueToXml(keys[0], parsed[keys[0]]);
  }

  private valueToXml(key: string, value: any, indent: number = 0): string {
    const indentStr = '  '.repeat(indent);
    const tagName = this.sanitizeTagName(key);

    if (value === null) {
      return `${indentStr}<${tagName} />`;
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return `${indentStr}<${tagName}>${this.escapeXml(String(value))}</${tagName}>`;
    }

    if (Array.isArray(value)) {
      return value
        .map((item) => this.valueToXml(tagName, item, indent))
        .join('\n');
    }

    if (typeof value === 'object') {
      const entries = Object.entries(value);
      if (entries.length === 0) {
        return `${indentStr}<${tagName} />`;
      }

      const attributes = value['@attributes'] && typeof value['@attributes'] === 'object'
        ? Object.entries(value['@attributes'])
            .map(([attrKey, attrValue]) => ` ${this.sanitizeTagName(attrKey)}="${this.escapeXml(String(attrValue))}"`)
            .join('')
        : '';
      const text = value['#text'] !== undefined ? this.escapeXml(String(value['#text'])) : '';
      const children = entries
        .filter(([k]) => k !== '@attributes' && k !== '#text')
        .map(([k, v]) => this.valueToXml(k, v, indent + 1))
        .join('\n');

      if (!children && !text) {
        return `${indentStr}<${tagName}${attributes} />`;
      }

      if (!children) {
        return `${indentStr}<${tagName}${attributes}>${text}</${tagName}>`;
      }

      const textLine = text ? `${'  '.repeat(indent + 1)}${text}\n` : '';
      return `${indentStr}<${tagName}${attributes}>\n${textLine}${children}\n${indentStr}</${tagName}>`;
    }

    return `${indentStr}<${tagName}>${this.escapeXml(String(value))}</${tagName}>`;
  }

  onInputChange(): void {
    this.convert();
  }

  private escapeXml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  private sanitizeTagName(name: string): string {
    const cleaned = name.replace(/[^A-Za-z0-9_.:-]/g, '_');
    return /^[A-Za-z_]/.test(cleaned) ? cleaned : `node_${cleaned}`;
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
