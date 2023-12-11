import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private tagsSubject = new BehaviorSubject<string[]>([]);
  tags$: Observable<string[]> = this.tagsSubject.asObservable();

  updateTags(tags: string[]): void {
    this.tagsSubject.next(tags);
  }
}
