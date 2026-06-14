import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { JsonFormatterComponent } from '../../components/json-formatter/json-formatter.component';

interface Tool {
  id: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-tools',
  standalone: true,
  imports: [CommonModule, JsonFormatterComponent],
  templateUrl: './tools.component.html',
  styleUrl: './tools.component.css'
})
export class ToolsComponent implements OnInit {
  tools: Tool[] = [
    {
      id: 'json-formatter',
      name: 'JSON Formatter',
      description: 'Format and validate JSON with syntax highlighting'
    },
    {
      id: 'code-converter',
      name: 'Code Converter',
      description: 'Convert between different code formats'
    },
    {
      id: 'regex-tester',
      name: 'Regex Tester',
      description: 'Test and validate regular expressions'
    },
    {
      id: 'color-picker',
      name: 'Color Picker',
      description: 'Pick colors and convert between formats'
    },
    {
      id: 'base64-encoder',
      name: 'Base64 Encoder',
      description: 'Encode and decode Base64 strings'
    },
    {
      id: 'uuid-generator',
      name: 'UUID Generator',
      description: 'Generate UUIDs (v1, v3, v4, v5)'
    }
  ];

  selectedTool: Tool | null = null;
  selectedToolId: string | null = null;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.selectedToolId = params['id'];
        this.selectedTool = this.tools.find(t => t.id === params['id']) || null;
      }
    });
  }
}
