import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Subscription } from 'rxjs';
import { AuthService } from "src/app/auth/auth.service";

import { Post } from "../post.model";
import { PostsService } from "../posts.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.css"]
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];
  posts: Post[] = [];
  isLoading = false;
  private postsSub: Subscription;
  length = 0;
  pageSizeOptions = [2, 5, 10];
  pageSize = 2;
  currentPage = 1;
  private authStatusSub: Subscription;
  isAuthenticated: boolean = false;
  userID: string;



  constructor(public postsService: PostsService, private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.pageSize, this.currentPage);
    this.userID = this.authService.getUserID();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((posts: {post: Post[], count: number}) => {
        this.isLoading = false;
        this.posts = posts.post;
        this.length = posts.count;
      });
    this.isAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(res => {
      this.isAuthenticated = res;
      this.userID = this.authService.getUserID();
    })
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postsService.deletePost(postId).subscribe(() => {
      this.postsService.getPosts(this.pageSize, this.currentPage)
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }

  onChange(page: PageEvent){
    this.isLoading = true;
    this.currentPage = page.pageIndex + 1;
    this.pageSize = page.pageSize;
    this.postsService.getPosts(this.pageSize, this.currentPage);
  }
}
