import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeoService } from '../../services/seo.service';

interface Match {
  fullMatch: string;
  groups: string[];
  index: number;
}

@Component({
  selector: 'app-regex-tester',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './regex-tester.component.html',
  styleUrl: './regex-tester.component.css'
})
export class RegexTesterComponent implements OnInit {
  constructor(private seo: SeoService) {}

  pattern: string = '';
  flags: string = 'g';
  testString: string = '';
  matches: Match[] = [];
  error: string = '';
  highlightedText: string = '';
  
  flagOptions = [
    { value: 'g', label: 'Global', description: 'Find all matches' },
    { value: 'i', label: 'Case Insensitive', description: 'Ignore case' },
    { value: 'm', label: 'Multiline', description: '^ and $ match line starts/ends' },
    { value: 's', label: 'Dot All', description: '. matches newlines' }
  ];

  quickPatterns = [
    { name: 'Email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}' },
    { name: 'URL', pattern: 'https?://[^\\s/$.?#].[^\\s]*' },
    { name: 'Phone (US)', pattern: '\\(?\\d{3}\\)?[-\\s]?\\d{3}[-\\s]?\\d{4}' },
    { name: 'IP Address', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b' },
    { name: 'Hex Color', pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})' },
    { name: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-\\d{2}-\\d{2}' }
  ];

  ngOnInit(): void {
    this.seo.updateMetaTags(this.seo.getToolSEO('regex-tester'));
  }

  testRegex() {
    this.matches = [];
    this.error = '';
    this.highlightedText = this.testString;

    if (!this.pattern || !this.testString) {
      return;
    }

    try {
      const regex = new RegExp(this.pattern, this.flags);
      const matches: Match[] = [];
      let match;

      if (this.flags.includes('g')) {
        while ((match = regex.exec(this.testString)) !== null) {
          matches.push({
            fullMatch: match[0],
            groups: match.slice(1),
            index: match.index
          });
          // Prevent infinite loop for zero-width matches
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      } else {
        match = regex.exec(this.testString);
        if (match) {
          matches.push({
            fullMatch: match[0],
            groups: match.slice(1),
            index: match.index
          });
        }
      }

      this.matches = matches;
      this.highlightMatches();

    } catch (e: any) {
      this.error = e.message || 'Invalid regular expression';
    }
  }

  highlightMatches() {
    if (this.matches.length === 0) {
      this.highlightedText = this.escapeHtml(this.testString);
      return;
    }

    let result = '';
    let lastIndex = 0;

    this.matches.forEach((match, i) => {
      // Add text before match
      result += this.escapeHtml(this.testString.substring(lastIndex, match.index));
      
      // Add highlighted match
      result += `<mark class="match-${i % 3}">${this.escapeHtml(match.fullMatch)}</mark>`;
      
      lastIndex = match.index + match.fullMatch.length;
    });

    // Add remaining text
    result += this.escapeHtml(this.testString.substring(lastIndex));
    
    this.highlightedText = result;
  }

  escapeHtml(text: string): string {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  toggleFlag(flag: string) {
    if (this.flags.includes(flag)) {
      this.flags = this.flags.replace(flag, '');
    } else {
      this.flags += flag;
    }
    this.testRegex();
  }

  loadQuickPattern(pattern: string) {
    this.pattern = pattern;
    this.testRegex();
  }

  clearAll() {
    this.pattern = '';
    this.testString = '';
    this.matches = [];
    this.error = '';
    this.highlightedText = '';
  }

  loadExample() {
    this.pattern = '\\b[A-Z][a-z]+\\b';
    this.testString = 'Hello World! This is a Test of the Regular Expression Tester.';
    this.flags = 'g';
    this.testRegex();
  }
}
