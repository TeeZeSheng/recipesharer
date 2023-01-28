import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";

import { Post } from "./post.model";

@Injectable({ providedIn: "root" })
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{post: Post[], count: number}>();

  constructor(private http: HttpClient, private router: Router) {}

  getPosts(pageSize: number, currentPage: number) {
    const queryParam = `?pageSize=${pageSize}&page=${currentPage}`;
    this.http
      .get<{ message: string, posts: any, count: number }>("http://localhost:3000/api/posts" + queryParam)
      .pipe(
        map(postData => {
          return {post: postData.posts.map(post => {
            return {
              title: post.title,
              ingredients: post.ingredients,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
          }),
          count: postData.count
        }
        })
      )
      .subscribe(transformedPosts => {
        this.posts = transformedPosts.post;
        this.postsUpdated.next({post: [...this.posts], count: transformedPosts.count});
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, ingredients: string, content: string, imagePath: string, creator: string }>(
      "http://localhost:3000/api/posts/" + id
    );
  }

  addPost(title: string, ingredients: string, content: string, image: File) {
    const postData = new FormData();
    postData.append("title", title);
    postData.append("ingredients", ingredients);
    postData.append("content", content);
    postData.append("image", image, title);
    this.http
      .post<{ message: string; post: Post }>(
        "http://localhost:3000/api/posts",
        postData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updatePost(id: string, title: string, ingredients: string, content: string, image: File | string) {
    let postData: Post | FormData;
    if (typeof image === "object") {
      postData = new FormData();
      postData.append("id", id);
      postData.append("title", title);
      postData.append("ingredients", ingredients);
      postData.append("content", content);
      postData.append("image", image, title);
    } else {
      postData = {
        id: id,
        title: title,
        ingredients: ingredients,
        content: content,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put("http://localhost:3000/api/posts/" + id, postData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deletePost(postId: string) {
    return this.http
      .delete("http://localhost:3000/api/posts/" + postId)
  }
}
