import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-hash-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hash-generator.component.html',
  styleUrl: './hash-generator.component.css'
})
export class HashGeneratorComponent implements OnInit {
  constructor(private seo: SeoService) {}

  inputText: string = '';
  md5Hash: string = '';
  sha1Hash: string = '';
  sha256Hash: string = '';
  sha512Hash: string = '';
  copiedHash: string = '';

  ngOnInit(): void {
    this.seo.updateMetaTags(this.seo.getToolSEO('hash-generator'));
  }

  async generateHashes() {
    if (!this.inputText) {
      this.clearHashes();
      return;
    }

    const encoder = new TextEncoder();
    const data = encoder.encode(this.inputText);

    try {
      // Generate SHA-1
      const sha1Buffer = await crypto.subtle.digest('SHA-1', data);
      this.sha1Hash = this.bufferToHex(sha1Buffer);

      // Generate SHA-256
      const sha256Buffer = await crypto.subtle.digest('SHA-256', data);
      this.sha256Hash = this.bufferToHex(sha256Buffer);

      // Generate SHA-512
      const sha512Buffer = await crypto.subtle.digest('SHA-512', data);
      this.sha512Hash = this.bufferToHex(sha512Buffer);

      // MD5 (using a simple implementation)
      this.md5Hash = this.md5(this.inputText);
    } catch (error) {
      console.error('Error generating hashes:', error);
    }
  }

  bufferToHex(buffer: ArrayBuffer): string {
    return Array.from(new Uint8Array(buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');
  }

  // Simple MD5 implementation
  md5(string: string): string {
    function rotateLeft(value: number, amount: number): number {
      return (value << amount) | (value >>> (32 - amount));
    }

    function addUnsigned(x: number, y: number): number {
      const lsw = (x & 0xFFFF) + (y & 0xFFFF);
      const msw = (x >> 16) + (y >> 16) + (lsw >> 16);
      return (msw << 16) | (lsw & 0xFFFF);
    }

    function f(x: number, y: number, z: number): number {
      return (x & y) | ((~x) & z);
    }

    function g(x: number, y: number, z: number): number {
      return (x & z) | (y & (~z));
    }

    function h(x: number, y: number, z: number): number {
      return x ^ y ^ z;
    }

    function i(x: number, y: number, z: number): number {
      return y ^ (x | (~z));
    }

    function ff(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
      a = addUnsigned(a, addUnsigned(addUnsigned(f(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }

    function gg(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
      a = addUnsigned(a, addUnsigned(addUnsigned(g(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }

    function hh(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
      a = addUnsigned(a, addUnsigned(addUnsigned(h(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }

    function ii(a: number, b: number, c: number, d: number, x: number, s: number, ac: number): number {
      a = addUnsigned(a, addUnsigned(addUnsigned(i(b, c, d), x), ac));
      return addUnsigned(rotateLeft(a, s), b);
    }

    function convertToWordArray(string: string): number[] {
      const wordArray: number[] = [];
      const asciiLength = string.length;

      for (let i = 0; i < asciiLength; i++) {
        wordArray[i >> 2] |= (string.charCodeAt(i) & 0xFF) << ((i % 4) * 8);
      }

      return wordArray;
    }

    function utf8Encode(string: string): string {
      return unescape(encodeURIComponent(string));
    }

    let x = convertToWordArray(utf8Encode(string));
    let a = 0x67452301;
    let b = 0xEFCDAB89;
    let c = 0x98BADCFE;
    let d = 0x10325476;

    const messageLength = string.length;
    const numberOfWords = (((messageLength + 8) >>> 6) + 1) << 4;

    for (let i = x.length; i < numberOfWords; i++) {
      x[i] = 0;
    }

    x[messageLength >> 2] |= 0x80 << ((messageLength % 4) * 8);
    x[numberOfWords - 2] = messageLength << 3;

    for (let i = 0; i < x.length; i += 16) {
      const aa = a;
      const bb = b;
      const cc = c;
      const dd = d;

      a = ff(a, b, c, d, x[i + 0], 7, 0xD76AA478);
      d = ff(d, a, b, c, x[i + 1], 12, 0xE8C7B756);
      c = ff(c, d, a, b, x[i + 2], 17, 0x242070DB);
      b = ff(b, c, d, a, x[i + 3], 22, 0xC1BDCEEE);
      a = ff(a, b, c, d, x[i + 4], 7, 0xF57C0FAF);
      d = ff(d, a, b, c, x[i + 5], 12, 0x4787C62A);
      c = ff(c, d, a, b, x[i + 6], 17, 0xA8304613);
      b = ff(b, c, d, a, x[i + 7], 22, 0xFD469501);
      a = ff(a, b, c, d, x[i + 8], 7, 0x698098D8);
      d = ff(d, a, b, c, x[i + 9], 12, 0x8B44F7AF);
      c = ff(c, d, a, b, x[i + 10], 17, 0xFFFF5BB1);
      b = ff(b, c, d, a, x[i + 11], 22, 0x895CD7BE);
      a = ff(a, b, c, d, x[i + 12], 7, 0x6B901122);
      d = ff(d, a, b, c, x[i + 13], 12, 0xFD987193);
      c = ff(c, d, a, b, x[i + 14], 17, 0xA679438E);
      b = ff(b, c, d, a, x[i + 15], 22, 0x49B40821);

      a = gg(a, b, c, d, x[i + 1], 5, 0xF61E2562);
      d = gg(d, a, b, c, x[i + 6], 9, 0xC040B340);
      c = gg(c, d, a, b, x[i + 11], 14, 0x265E5A51);
      b = gg(b, c, d, a, x[i + 0], 20, 0xE9B6C7AA);
      a = gg(a, b, c, d, x[i + 5], 5, 0xD62F105D);
      d = gg(d, a, b, c, x[i + 10], 9, 0x02441453);
      c = gg(c, d, a, b, x[i + 15], 14, 0xD8A1E681);
      b = gg(b, c, d, a, x[i + 4], 20, 0xE7D3FBC8);
      a = gg(a, b, c, d, x[i + 9], 5, 0x21E1CDE6);
      d = gg(d, a, b, c, x[i + 14], 9, 0xC33707D6);
      c = gg(c, d, a, b, x[i + 3], 14, 0xF4D50D87);
      b = gg(b, c, d, a, x[i + 8], 20, 0x455A14ED);
      a = gg(a, b, c, d, x[i + 13], 5, 0xA9E3E905);
      d = gg(d, a, b, c, x[i + 2], 9, 0xFCEFA3F8);
      c = gg(c, d, a, b, x[i + 7], 14, 0x676F02D9);
      b = gg(b, c, d, a, x[i + 12], 20, 0x8D2A4C8A);

      a = hh(a, b, c, d, x[i + 5], 4, 0xFFFA3942);
      d = hh(d, a, b, c, x[i + 8], 11, 0x8771F681);
      c = hh(c, d, a, b, x[i + 11], 16, 0x6D9D6122);
      b = hh(b, c, d, a, x[i + 14], 23, 0xFDE5380C);
      a = hh(a, b, c, d, x[i + 1], 4, 0xA4BEEA44);
      d = hh(d, a, b, c, x[i + 4], 11, 0x4BDECFA9);
      c = hh(c, d, a, b, x[i + 7], 16, 0xF6BB4B60);
      b = hh(b, c, d, a, x[i + 10], 23, 0xBEBFBC70);
      a = hh(a, b, c, d, x[i + 13], 4, 0x289B7EC6);
      d = hh(d, a, b, c, x[i + 0], 11, 0xEAA127FA);
      c = hh(c, d, a, b, x[i + 3], 16, 0xD4EF3085);
      b = hh(b, c, d, a, x[i + 6], 23, 0x04881D05);
      a = hh(a, b, c, d, x[i + 9], 4, 0xD9D4D039);
      d = hh(d, a, b, c, x[i + 12], 11, 0xE6DB99E5);
      c = hh(c, d, a, b, x[i + 15], 16, 0x1FA27CF8);
      b = hh(b, c, d, a, x[i + 2], 23, 0xC4AC5665);

      a = ii(a, b, c, d, x[i + 0], 6, 0xF4292244);
      d = ii(d, a, b, c, x[i + 7], 10, 0x432AFF97);
      c = ii(c, d, a, b, x[i + 14], 15, 0xAB9423A7);
      b = ii(b, c, d, a, x[i + 5], 21, 0xFC93A039);
      a = ii(a, b, c, d, x[i + 12], 6, 0x655B59C3);
      d = ii(d, a, b, c, x[i + 3], 10, 0x8F0CCC92);
      c = ii(c, d, a, b, x[i + 10], 15, 0xFFEFF47D);
      b = ii(b, c, d, a, x[i + 1], 21, 0x85845DD1);
      a = ii(a, b, c, d, x[i + 8], 6, 0x6FA87E4F);
      d = ii(d, a, b, c, x[i + 15], 10, 0xFE2CE6E0);
      c = ii(c, d, a, b, x[i + 6], 15, 0xA3014314);
      b = ii(b, c, d, a, x[i + 13], 21, 0x4E0811A1);
      a = ii(a, b, c, d, x[i + 4], 6, 0xF7537E82);
      d = ii(d, a, b, c, x[i + 11], 10, 0xBD3AF235);
      c = ii(c, d, a, b, x[i + 2], 15, 0x2AD7D2BB);
      b = ii(b, c, d, a, x[i + 9], 21, 0xEB86D391);

      a = addUnsigned(a, aa);
      b = addUnsigned(b, bb);
      c = addUnsigned(c, cc);
      d = addUnsigned(d, dd);
    }

    const temp = [a, b, c, d];
    let result = '';

    for (let i = 0; i < 4; i++) {
      result += ((temp[i] & 0xFF)).toString(16).padStart(2, '0');
      result += ((temp[i] >>> 8) & 0xFF).toString(16).padStart(2, '0');
      result += ((temp[i] >>> 16) & 0xFF).toString(16).padStart(2, '0');
      result += ((temp[i] >>> 24) & 0xFF).toString(16).padStart(2, '0');
    }

    return result;
  }

  copyToClipboard(hash: string, type: string) {
    navigator.clipboard.writeText(hash).then(() => {
      this.copiedHash = type;
      setTimeout(() => {
        this.copiedHash = '';
      }, 2000);
    });
  }

  clearAll() {
    this.inputText = '';
    this.clearHashes();
  }

  clearHashes() {
    this.md5Hash = '';
    this.sha1Hash = '';
    this.sha256Hash = '';
    this.sha512Hash = '';
  }

  loadExample() {
    this.inputText = 'Hello, World!';
    this.generateHashes();
  }
}
