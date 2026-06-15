import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface ToolItem {
  id: string;
  name: string;
  description: string;
  route: string;
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
      route: '/tools/json-formatter'
    },
    {
      id: 'xml-json',
      name: 'XML ↔ JSON',
      description: 'Convert between XML and JSON',
      route: '/tools/xml-json'
    },
    {
      id: 'code-converter',
      name: 'Code Converter',
      description: 'Convert between code formats',
      route: '/tools/code-converter'
    },
    {
      id: 'regex-tester',
      name: 'Regex Tester',
      description: 'Test regular expressions',
      route: '/tools/regex-tester'
    },
    {
      id: 'color-picker',
      name: 'Color Picker',
      description: 'Pick and convert colors',
      route: '/tools/color-picker'
    },
    {
      id: 'base64-encoder',
      name: 'Base64 Encoder',
      description: 'Encode/decode Base64',
      route: '/tools/base64-encoder'
    },
    {
      id: 'uuid-generator',
      name: 'UUID Generator',
      description: 'Generate UUIDs',
      route: '/tools/uuid-generator'
    },
    {
      id: 'yaml-validator',
      name: 'YAML Validator',
      description: 'Validate YAML files',
      route: '/tools/yaml-validator'
    },
    {
      id: 'sql-formatter',
      name: 'SQL Formatter',
      description: 'Format SQL queries',
      route: '/tools/sql-formatter'
    },
    {
      id: 'xml-formatter',
      name: 'XML Formatter',
      description: 'Format XML documents',
      route: '/tools/xml-formatter'
    },
    {
      id: 'markdown-preview',
      name: 'Markdown Preview',
      description: 'Preview markdown files',
      route: '/tools/markdown-preview'
    }
  ];
}
