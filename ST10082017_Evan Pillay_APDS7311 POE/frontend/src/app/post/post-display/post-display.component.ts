import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { PostServiceService } from '../post-service.service';

@Component({
  selector: 'app-post-display',
  templateUrl: './post-display.component.html',
  styleUrls: ['./post-display.component.css']
})
export class PostDisplayComponent implements OnInit, OnDestroy {
  posts: { _id: string, id: string, name: string, __v: string }[] = [];

  constructor(public postService: PostServiceService) { }
  private postSubscription!: Subscription;

  ngOnInit() {
    this.postService.getPosts();
    this.postSubscription = this.postService.getUpdateListener()
      .subscribe((posts: { _id: string, id: string, name: string, __v: string }[]) => {
        this.posts = posts;
      });
  }

  ngOnDestroy() {
    this.postSubscription.unsubscribe();
  }

  onDelete(postId: string) {
    this.postService.deletePost(postId);
  }
}
