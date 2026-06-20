import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

export interface SEOConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly defaultImage = 'https://ilovedev.in/logo.png';
  private readonly siteName = 'ILoveDev';
  private readonly baseUrl = 'https://ilovedev.in';

  constructor(
    private meta: Meta,
    private title: Title
  ) {}

  updateMetaTags(config: SEOConfig): void {
    // Update title
    this.title.setTitle(config.title);

    // Update or create meta tags
    this.meta.updateTag({ name: 'title', content: config.title });
    this.meta.updateTag({ name: 'description', content: config.description });
    
    if (config.keywords) {
      this.meta.updateTag({ name: 'keywords', content: config.keywords });
    }

    // Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: config.title });
    this.meta.updateTag({ property: 'og:description', content: config.description });
    this.meta.updateTag({ property: 'og:image', content: config.image || this.defaultImage });
    this.meta.updateTag({ property: 'og:url', content: config.url || this.baseUrl });
    this.meta.updateTag({ property: 'og:type', content: config.type || 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: this.siteName });

    // Twitter Card tags
    this.meta.updateTag({ property: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ property: 'twitter:title', content: config.title });
    this.meta.updateTag({ property: 'twitter:description', content: config.description });
    this.meta.updateTag({ property: 'twitter:image', content: config.image || this.defaultImage });
    this.meta.updateTag({ property: 'twitter:url', content: config.url || this.baseUrl });

    // Update canonical URL
    this.updateCanonicalUrl(config.url || this.baseUrl);
  }

  private updateCanonicalUrl(url: string): void {
    let link: HTMLLinkElement | null = document.querySelector('link[rel="canonical"]');
    
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    
    link.setAttribute('href', url);
  }

  // Predefined SEO configs for each tool
  getToolSEO(toolId: string): SEOConfig {
    const configs: { [key: string]: SEOConfig } = {
      'qr-generator': {
        title: 'Free QR Code Generator Online - Create QR Codes Instantly | ILoveDev',
        description: 'Generate QR codes for free! Create custom QR codes for URLs, text, emails, WiFi, and more. Download as PNG or SVG. No signup required. Fast and secure.',
        keywords: 'qr code generator, free qr code, create qr code, qr code maker, online qr generator, qr code creator, custom qr code',
        url: `${this.baseUrl}/tools/qr-generator`
      },
      'uuid-generator': {
        title: 'Free UUID Generator Online - Generate UUIDs (v4) Instantly | ILoveDev',
        description: 'Generate universally unique identifiers (UUID v4) instantly. Create single or bulk UUIDs for your applications. Free online UUID generator tool.',
        keywords: 'uuid generator, guid generator, unique id generator, uuid v4, random uuid, bulk uuid generator',
        url: `${this.baseUrl}/tools/uuid-generator`
      },
      'jwt-decoder': {
        title: 'Free JWT Decoder Online - Decode and Verify JSON Web Tokens | ILoveDev',
        description: 'Decode and inspect JWT tokens online. View header, payload, and signature. Verify token expiration and claims. Free JWT decoder tool for developers.',
        keywords: 'jwt decoder, json web token decoder, jwt parser, decode jwt, jwt viewer, jwt debugger',
        url: `${this.baseUrl}/tools/jwt-decoder`
      },
      'base64-encoder': {
        title: 'Free Base64 Encoder/Decoder Online - Encode & Decode Text | ILoveDev',
        description: 'Encode and decode Base64 strings instantly. Free online Base64 encoder and decoder tool. Supports text encoding and decoding with instant results.',
        keywords: 'base64 encoder, base64 decoder, encode base64, decode base64, base64 converter, base64 tool',
        url: `${this.baseUrl}/tools/base64-encoder`
      },
      'regex-tester': {
        title: 'Free Regex Tester Online - Test Regular Expressions | ILoveDev',
        description: 'Test and debug regular expressions online. Real-time regex matching, pattern highlighting, and match details. Free regex tester with instant results.',
        keywords: 'regex tester, regular expression tester, regex validator, regex debugger, test regex online',
        url: `${this.baseUrl}/tools/regex-tester`
      },
      'hash-generator': {
        title: 'Free Hash Generator Online - MD5, SHA-1, SHA-256 & More | ILoveDev',
        description: 'Generate cryptographic hashes online. Supports MD5, SHA-1, SHA-256, SHA-512 algorithms. Free online hash generator for secure hashing.',
        keywords: 'hash generator, md5 generator, sha256 generator, sha1 hash, cryptographic hash, hash calculator',
        url: `${this.baseUrl}/tools/hash-generator`
      },
      'json-formatter': {
        title: 'Free JSON Formatter Online - Beautify & Validate JSON | ILoveDev',
        description: 'Format, beautify, and validate JSON data online. Free JSON formatter with syntax highlighting and error detection. Minify and prettify JSON instantly.',
        keywords: 'json formatter, json beautifier, json validator, prettify json, format json online, json viewer',
        url: `${this.baseUrl}/tools/json-formatter`
      },
      'xml-formatter': {
        title: 'Free XML Formatter Online - Beautify & Validate XML | ILoveDev',
        description: 'Format, beautify, and validate XML data online. Free XML formatter with syntax highlighting. Minify and prettify XML instantly.',
        keywords: 'xml formatter, xml beautifier, xml validator, format xml online, prettify xml, xml viewer',
        url: `${this.baseUrl}/tools/xml-formatter`
      },
      'xml-json': {
        title: 'Free XML to JSON Converter Online - Convert XML to JSON | ILoveDev',
        description: 'Convert XML to JSON and JSON to XML online. Free bidirectional converter with instant results. Fast and accurate XML/JSON conversion.',
        keywords: 'xml to json, json to xml, xml json converter, convert xml, convert json, xml parser',
        url: `${this.baseUrl}/tools/xml-json`
      },
      'image-compressor': {
        title: 'Free Image Compressor Online - Compress Images Without Losing Quality | ILoveDev',
        description: 'Compress images online for free. Reduce image file size without losing quality. Supports JPEG, PNG, WebP. Fast image optimization tool.',
        keywords: 'image compressor, compress image, image optimizer, reduce image size, compress jpeg, compress png',
        url: `${this.baseUrl}/tools/image-compressor`
      },
      'ip-lookup': {
        title: 'Free IP Lookup Tool - Get IP Address Information | ILoveDev',
        description: 'Lookup IP address information including location, ISP, and geolocation data. Free IP address lookup tool with detailed information.',
        keywords: 'ip lookup, ip address lookup, find ip location, ip geolocation, ip address info, whois ip',
        url: `${this.baseUrl}/tools/ip-lookup`
      }
    };

    return configs[toolId] || this.getDefaultSEO();
  }

  getDefaultSEO(): SEOConfig {
    return {
      title: 'ILoveDev - Free Developer Tools Online',
      description: 'Free online developer tools including QR Code Generator, UUID Generator, JWT Decoder, Base64 Encoder, Regex Tester, Hash Generator, and more. No signup required.',
      keywords: 'developer tools, online tools, qr code, uuid, jwt, base64, regex, hash, json, xml',
      url: this.baseUrl
    };
  }

  getAboutSEO(): SEOConfig {
    return {
      title: 'About ILoveDev - Free Developer Tools for Everyone',
      description: 'Learn about ILoveDev, your go-to platform for free online developer tools. Built with love using Angular to make developers\' lives easier.',
      keywords: 'about ilovedev, developer tools, online utilities, free tools',
      url: `${this.baseUrl}/about`
    };
  }
}
