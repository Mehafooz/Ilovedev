import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SeoService } from '../../services/seo.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  description = 'Essential utilities for developers';

  constructor(private seo: SeoService) {}

  ngOnInit(): void {
    this.seo.updateMetaTags(this.seo.getDefaultSEO());
  }
}
