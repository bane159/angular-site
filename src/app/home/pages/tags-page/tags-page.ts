import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TagsService } from '../../../questions/services/tags.service';
import { Tag } from '../../../questions/interfaces/tag';
import { Layout } from '../../../shared/components/layout/layout';

@Component({
  selector: 'app-tags-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    Layout
  ],
  templateUrl: './tags-page.html',
  styleUrl: './tags-page.scss'
})
export class TagsPage implements OnInit {
  tags: Tag[] = [];
  isLoading = true;
  errorMessage: string | null = null;
  
  constructor(private tagsService: TagsService) {}
  
  ngOnInit(): void {
    this.loadTags();
  }
  
  loadTags(): void {
    this.isLoading = true;
    this.tagsService.getAllTags().subscribe({
      next: (tags) => {
        this.tags = tags;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading tags', error);
        this.errorMessage = 'Failed to load tags. Please try again later.';
        this.isLoading = false;
      }
    });
  }
}
