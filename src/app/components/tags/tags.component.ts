import { Component, OnInit } from '@angular/core';
import { TagService } from './tag.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css'],
})
export class TagsComponent implements OnInit {
  tags: string[] = [];

  constructor(
    private tagService: TagService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    this.tagService.tags$.subscribe((tags) => {
      this.tags = tags;
    });
  }

  filterByTag(tag: string): void {
    this.router.navigate(['/products', tag]);
  }
}
