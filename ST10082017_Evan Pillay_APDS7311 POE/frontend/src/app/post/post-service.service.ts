import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PostServiceService {
  private posts: { _id: string, id: string, name: string, __v: string }[] = [];
  private postsUpdated = new Subject<{ _id: string, id: string, name: string, __v: string }[]>();

  private readonly BASE_URL = 'https://localhost:3000';

  constructor(private http: HttpClient) { }

  getPosts() {
    this.http.get<{ message: string, posts: { _id: string, id: string, name: string, __v: string }[] }>(`${this.BASE_URL}/api/posts`)
      .subscribe(response => {
        if (response && response.posts && Array.isArray(response.posts)) {
          this.posts = response.posts;
          this.postsUpdated.next([...this.posts]);
        } else {
          console.error('Invalid response for posts:', response);
        }
      }, error => {
        console.error('Error while fetching posts:', error);
      });
  }  

  getUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(id: string, name: string) {
    this.http.post(`${this.BASE_URL}/api/posts`, { id, name })
      .subscribe(response => {
        console.log(response);
        this.getPosts(); 
      });
  }

  deletePost(postId: string) {
    this.http.delete(`${this.BASE_URL}/api/posts/${postId}`)
      .subscribe(() => {
        const updatedPosts = this.posts.filter(post => post._id !== postId);
        this.posts = updatedPosts;
        this.postsUpdated.next([...this.posts]);
      });
  }
}
