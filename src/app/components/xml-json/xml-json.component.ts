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
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  }

  clearAll(): void {
    this.inputValue = '';
    this.outputValue = '';
    this.error = null;
    this.isValid = false;
  }

  downloadOutput(): void {
    if (!this.outputValue) {
      alert('No output to download');
      return;
    }

    const ext = this.mode === 'xml-to-json' ? 'json' : 'xml';
    const element = document.createElement('a');
    const file = new Blob([this.outputValue], { 
      type: this.mode === 'xml-to-json' ? 'application/json' : 'application/xml' 
    });
    element.href = URL.createObjectURL(file);
    element.download = `output.${ext}`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  uploadFile(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.inputValue = e.target.result;
        this.convert();
      };
      reader.readAsText(file);
    }
  }

  private xmlToJson(xml: string): string {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');

    if (xmlDoc.getElementsByTagName('parsererror').length > 0) {
      throw new Error('Invalid XML format');
    }

    const result = this.parseXmlElement(xmlDoc.documentElement);
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

    // Add children
    const childMap: any = {};
    for (let i = 0; i < element.children.length; i++) {
      const child = element.children[i] as Element;
      const childObj = this.parseXmlElement(child);
      const childName = child.nodeName;

      if (childMap[childName]) {
        if (!Array.isArray(childMap[childName])) {
          childMap[childName] = [childMap[childName]];
        }
        childMap[childName].push(childObj);
      } else {
        childMap[childName] = childObj;
      }
    }

    // Add text content
    const text = element.textContent?.trim() || '';
    if (text && element.children.length === 0) {
      return text;
    }

    return Object.keys(childMap).length > 0 ? { ...obj, ...childMap } : (text || obj);
  }

  private jsonToXml(json: string): string {
    const parsed = JSON.parse(json);
    const rootKey = Object.keys(parsed)[0] || 'root';
    const rootValue = parsed[rootKey];

    return this.valueToXml(rootKey, rootValue);
  }

  private valueToXml(key: string, value: any, indent: number = 0): string {
    const indentStr = '  '.repeat(indent);
    const nextIndentStr = '  '.repeat(indent + 1);

    if (value === null) {
      return `${indentStr}<${key} />`;
    }

    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
      return `${indentStr}<${key}>${value}</${key}>`;
    }

    if (Array.isArray(value)) {
      return value
        .map((item) => this.valueToXml(key, item, indent))
        .join('\n');
    }

    if (typeof value === 'object') {
      const entries = Object.entries(value);
      if (entries.length === 0) {
        return `${indentStr}<${key} />`;
      }

      const children = entries
        .map(([k, v]) => this.valueToXml(k, v, indent + 1))
        .join('\n');

      return `${indentStr}<${key}>\n${children}\n${indentStr}</${key}>`;
    }

    return `${indentStr}<${key}>${value}</${key}>`;
  }
}
