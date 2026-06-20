import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SeoService } from '../../services/seo.service';
import { JsonFormatterComponent } from '../../components/json-formatter/json-formatter.component';
import { XmlJsonComponent } from '../../components/xml-json/xml-json.component';
import { XmlFormatterComponent } from '../../components/xml-formatter/xml-formatter.component';
import { HashGeneratorComponent } from '../../components/hash-generator/hash-generator.component';
import { Base64EncoderComponent } from '../../components/base64-encoder/base64-encoder.component';
import { UuidGeneratorComponent } from '../../components/uuid-generator/uuid-generator.component';
import { JwtDecoderComponent } from '../../components/jwt-decoder/jwt-decoder.component';
import { RegexTesterComponent } from '../../components/regex-tester/regex-tester.component';
import { QrGeneratorComponent } from '../../components/qr-generator/qr-generator.component';
import { IpLookupComponent } from '../../components/ip-lookup/ip-lookup.component';
import { ImageCompressorComponent } from '../../components/image-compressor/image-compressor.component';

interface Tool {
  id: string;
  name: string;
  description: string;
  status: 'available' | 'building';
}

@Component({
  selector: 'app-tools',
  standalone: true,
  imports: [CommonModule, JsonFormatterComponent, XmlJsonComponent, XmlFormatterComponent, HashGeneratorComponent, Base64EncoderComponent, UuidGeneratorComponent, JwtDecoderComponent, RegexTesterComponent, QrGeneratorComponent, IpLookupComponent, ImageCompressorComponent],
  templateUrl: './tools.component.html',
  styleUrl: './tools.component.css'
})
export class ToolsComponent implements OnInit {
  tools: Tool[] = [
    {
      id: 'json-formatter',
      name: 'JSON Formatter',
      description: 'Format and validate JSON',
      status: 'available'
    },
    {
      id: 'hash-generator',
      name: 'Hash Generator',
      description: 'Generate MD5, SHA1, SHA256, SHA512 hashes',
      status: 'available'
    },
    {
      id: 'base64-encoder',
      name: 'Base64 Encoder/Decoder',
      description: 'Encode and decode Base64 strings',
      status: 'available'
    },
    {
      id: 'uuid-generator',
      name: 'UUID Generator',
      description: 'Generate unique identifiers (UUID/GUID)',
      status: 'available'
    },
    {
      id: 'jwt-decoder',
      name: 'JWT Decoder',
      description: 'Decode JSON Web Tokens',
      status: 'available'
    },
    {
      id: 'regex-tester',
      name: 'Regex Tester',
      description: 'Test regular expressions online',
      status: 'available'
    },
    {
      id: 'qr-generator',
      name: 'QR Code Generator',
      description: 'Generate QR codes',
      status: 'available'
    },
    {
      id: 'ip-lookup',
      name: 'IP Address Lookup',
      description: 'Lookup IP address information',
      status: 'available'
    },
    {
      id: 'image-compressor',
      name: 'Image Compressor',
      description: 'Compress images online',
      status: 'available'
    },
    {
      id: 'xml-json',
      name: 'XML ↔ JSON',
      description: 'Convert between XML and JSON',
      status: 'available'
    },
    {
      id: 'xml-formatter',
      name: 'XML Formatter',
      description: 'Format and validate XML',
      status: 'available'
    },
    {
      id: 'code-converter',
      name: 'Code Converter',
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
      id: 'markdown-preview',
      name: 'Markdown Preview',
      description: 'Currently building',
      status: 'building'
    }
  ];

  selectedTool: Tool | null = null;
  selectedToolId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: any) => {
      if (params['id']) {
        this.selectedToolId = params['id'];
        this.selectedTool = this.tools.find((t: Tool) => t.id === params['id']) || null;
        
        // Update SEO for specific tool
        if (this.selectedToolId) {
          this.seo.updateMetaTags(this.seo.getToolSEO(this.selectedToolId));
        }
      } else {
        // Update SEO for tools listing page
        this.seo.updateMetaTags({
          title: 'All Developer Tools - Free Online Utilities | ILoveDev',
          description: 'Browse all free online developer tools. QR Code Generator, UUID Generator, JWT Decoder, Base64 Encoder, Regex Tester, and more. No signup required.',
          keywords: 'developer tools, online tools, free utilities, web tools',
          url: 'https://ilovedev.in/tools'
        });
      }
    });
  }
}
