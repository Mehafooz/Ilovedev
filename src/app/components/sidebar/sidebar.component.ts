import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface ToolItem {
  id: string;
  name: string;
  description: string;
  route: string;
  status: 'available' | 'building';
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  tools: ToolItem[] = [
    {
      id: 'json-formatter',
      name: 'JSON Formatter',
      description: 'Format and validate JSON',
      route: '/tools/json-formatter',
      status: 'available'
    },
    {
      id: 'hash-generator',
      name: 'Hash Generator',
      description: 'MD5, SHA1, SHA256, SHA512',
      route: '/tools/hash-generator',
      status: 'available'
    },
    {
      id: 'base64-encoder',
      name: 'Base64 Encoder',
      description: 'Encode & decode Base64',
      route: '/tools/base64-encoder',
      status: 'available'
    },
    {
      id: 'uuid-generator',
      name: 'UUID Generator',
      description: 'Generate unique IDs',
      route: '/tools/uuid-generator',
      status: 'available'
    },
    {
      id: 'jwt-decoder',
      name: 'JWT Decoder',
      description: 'Decode JSON Web Tokens',
      route: '/tools/jwt-decoder',
      status: 'available'
    },
    {
      id: 'regex-tester',
      name: 'Regex Tester',
      description: 'Test regular expressions',
      route: '/tools/regex-tester',
      status: 'available'
    },
    {
      id: 'qr-generator',
      name: 'QR Code Generator',
      description: 'Generate QR codes',
      route: '/tools/qr-generator',
      status: 'available'
    },
    {
      id: 'ip-lookup',
      name: 'IP Address Lookup',
      description: 'Lookup IP information',
      route: '/tools/ip-lookup',
      status: 'available'
    },
    {
      id: 'image-compressor',
      name: 'Image Compressor',
      description: 'Compress images online',
      route: '/tools/image-compressor',
      status: 'available'
    },
     {
      id: 'xml-formatter',
      name: 'XML Formatter',
      description: 'Format and validate XML',
      route: '/tools/xml-formatter',
      status: 'available'
    },
    {
      id: 'xml-json',
      name: 'XML ↔ JSON',
      description: 'Convert between XML and JSON',
      route: '/tools/xml-json',
      status: 'available'
    },
    {
      id: 'code-converter',
      name: 'Code Converter',
      description: 'Currently building',
      route: '/tools/code-converter',
      status: 'building'
    },
    {
      id: 'color-picker',
      name: 'Color Picker',
      description: 'Currently building',
      route: '/tools/color-picker',
      status: 'building'
    },
    {
      id: 'yaml-validator',
      name: 'YAML Validator',
      description: 'Currently building',
      route: '/tools/yaml-validator',
      status: 'building'
    },
    {
      id: 'sql-formatter',
      name: 'SQL Formatter',
      description: 'Currently building',
      route: '/tools/sql-formatter',
      status: 'building'
    },
    {
      id: 'markdown-preview',
      name: 'Markdown Preview',
      description: 'Currently building',
      route: '/tools/markdown-preview',
      status: 'building'
    }
  ];
}
