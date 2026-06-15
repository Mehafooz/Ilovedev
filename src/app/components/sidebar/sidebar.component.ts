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
      id: 'regex-tester',
      name: 'Regex Tester',
      description: 'Currently building',
      route: '/tools/regex-tester',
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
      id: 'base64-encoder',
      name: 'Base64 Encoder',
      description: 'Currently building',
      route: '/tools/base64-encoder',
      status: 'building'
    },
    {
      id: 'uuid-generator',
      name: 'UUID Generator',
      description: 'Currently building',
      route: '/tools/uuid-generator',
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
      id: 'xml-formatter',
      name: 'XML Formatter',
      description: 'Currently building',
      route: '/tools/xml-formatter',
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
