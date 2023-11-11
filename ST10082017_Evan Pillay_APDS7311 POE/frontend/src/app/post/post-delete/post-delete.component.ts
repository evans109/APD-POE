import { Component, Input } from '@angular/core';
import { PostServiceService } from '../post-service.service';

@Component({
  selector: 'app-post-delete',
  templateUrl: './post-delete.component.html',
  styleUrls: ['./post-delete.component.css']
})
export class PostDeleteComponent {
  @Input() postId!: string;

  constructor(private postService: PostServiceService) { }

  onDelete() {
    this.postService.deletePost(this.postId);
  }
}
