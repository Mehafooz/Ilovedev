import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';
import { HttpClient, HttpClientModule } from '@angular/common/http';

interface IpInfo {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  org?: string;
  timezone?: string;
  postal?: string;
}

@Component({
  selector: 'app-ip-lookup',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './ip-lookup.component.html',
  styleUrl: './ip-lookup.component.css'
})
export class IpLookupComponent implements OnInit {
  myIpInfo: IpInfo | null = null;
  customIp: string = '';
  customIpInfo: IpInfo | null = null;
  loading: boolean = false;
  error: string = '';
  copiedField: string = '';

  ipExamples = [
    { name: 'Google DNS', ip: '8.8.8.8' },
    { name: 'Cloudflare DNS', ip: '1.1.1.1' },
    { name: 'OpenDNS', ip: '208.67.222.222' }
  ];

  constructor(
    private titleService: Title, 
    private metaService: Meta,
    private http: HttpClient
  ) {
    // SEO Optimization
    this.titleService.setTitle('Free IP Address Lookup Tool - Check IP Location & Details Online');
    this.metaService.updateTag({ 
      name: 'description', 
      content: 'Free IP address lookup tool. Check your IP address, location, ISP, and geolocation details. Find IP information for any IP address instantly.' 
    });
    this.metaService.updateTag({ 
      name: 'keywords', 
      content: 'ip lookup, ip address lookup, what is my ip, ip location, ip geolocation, find ip address, ip checker, my ip address' 
    });
  }

  ngOnInit() {
    this.getMyIp();
  }

  async getMyIp() {
    this.loading = true;
    this.error = '';
    
    try {
      // Using ipify for getting IP and ipapi for details
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();
      
      const detailsResponse = await fetch(`https://ipapi.co/${ipData.ip}/json/`);
      const details = await detailsResponse.json();
      
      this.myIpInfo = {
        ip: details.ip,
        city: details.city,
        region: details.region,
        country: details.country_name,
        loc: `${details.latitude}, ${details.longitude}`,
        org: details.org,
        timezone: details.timezone,
        postal: details.postal
      };
    } catch (err) {
      this.error = 'Could not fetch IP information. Please try again.';
      console.error('IP lookup error:', err);
    } finally {
      this.loading = false;
    }
  }

  async lookupCustomIp() {
    if (!this.customIp.trim()) {
      this.error = 'Please enter an IP address';
      return;
    }

    // Basic IP validation
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    if (!ipPattern.test(this.customIp)) {
      this.error = 'Invalid IP address format';
      return;
    }

    this.loading = true;
    this.error = '';
    this.customIpInfo = null;

    try {
      const response = await fetch(`https://ipapi.co/${this.customIp}/json/`);
      const details = await response.json();
      
      if (details.error) {
        this.error = 'IP address not found or invalid';
        return;
      }
      
      this.customIpInfo = {
        ip: details.ip,
        city: details.city,
        region: details.region,
        country: details.country_name,
        loc: `${details.latitude}, ${details.longitude}`,
        org: details.org,
        timezone: details.timezone,
        postal: details.postal
      };
    } catch (err) {
      this.error = 'Could not fetch IP information. Please try again.';
      console.error('Custom IP lookup error:', err);
    } finally {
      this.loading = false;
    }
  }

  loadExample(ip: string) {
    this.customIp = ip;
    this.lookupCustomIp();
  }

  copyToClipboard(text: string, field: string) {
    navigator.clipboard.writeText(text).then(() => {
      this.copiedField = field;
      setTimeout(() => {
        this.copiedField = '';
      }, 2000);
    });
  }

  openInMaps(loc: string) {
    const [lat, lng] = loc.split(', ');
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, '_blank');
  }

  clearCustom() {
    this.customIp = '';
    this.customIpInfo = null;
    this.error = '';
  }
}
