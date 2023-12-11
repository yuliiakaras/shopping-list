// tags.component.ts

import { Component, OnInit } from '@angular/core';
import { TagService } from './tag.service';
import { ShoppingListService } from '../shopping-list/shopping-list.service';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css'],
})
export class TagsComponent implements OnInit {
  tags: string[] = [];

  constructor(private tagService: TagService, private shoppingListService: ShoppingListService) {}

  ngOnInit(): void {
    this.tagService.tags$.subscribe((tags) => {
      this.tags = tags;
    });
  }

  // filterByTag(tag: string): void {
  //   this.shoppingListService.filterProductsByTag(tag);
  // }
}
