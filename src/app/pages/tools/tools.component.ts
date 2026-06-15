import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { JsonFormatterComponent } from '../../components/json-formatter/json-formatter.component';
import { XmlJsonComponent } from '../../components/xml-json/xml-json.component';

interface Tool {
  id: string;
  name: string;
  description: string;
  status: 'available' | 'building';
}

@Component({
  selector: 'app-tools',
  standalone: true,
  imports: [CommonModule, JsonFormatterComponent, XmlJsonComponent],
  templateUrl: './tools.component.html',
  styleUrl: './tools.component.css'
})
export class ToolsComponent implements OnInit {
  tools: Tool[] = [
    {
      id: 'json-formatter',
      name: 'JSON Formatter',
      description: 'Format and validate JSON with syntax highlighting',
      status: 'available'
    },
    {
      id: 'xml-json',
      name: 'XML ↔ JSON',
      description: 'Bidirectional conversion between XML and JSON',
      status: 'available'
    },
    {
      id: 'code-converter',
      name: 'Code Converter',
      description: 'Currently building',
      status: 'building'
    },
    {
      id: 'regex-tester',
      name: 'Regex Tester',
      description: 'Currently building',
      status: 'building'
    },
    {
      id: 'color-picker',
      name: 'Color Picker',
      description: 'Currently building',
      status: 'building'
    },
    {
      id: 'base64-encoder',
      name: 'Base64 Encoder',
      description: 'Currently building',
      status: 'building'
    },
    {
      id: 'uuid-generator',
      name: 'UUID Generator',
      description: 'Currently building',
      status: 'building'
    },
    {
      id: 'yaml-validator',
      name: 'YAML Validator',
      description: 'Currently building',
      status: 'building'
    },
    {
      id: 'sql-formatter',
      name: 'SQL Formatter',
      description: 'Currently building',
      status: 'building'
    },
    {
      id: 'xml-formatter',
      name: 'XML Formatter',
      description: 'Currently building',
      status: 'building'
    },
    {
      id: 'markdown-preview',
      name: 'Markdown Preview',
      description: 'Currently building',
      status: 'building'
    }
  ];

  selectedTool: Tool | null = null;
  selectedToolId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      if (params['id']) {
        this.selectedToolId = params['id'];
        this.selectedTool = this.tools.find((t: Tool) => t.id === params['id']) || null;
      }
    });
  }
}
