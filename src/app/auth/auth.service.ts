import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core"
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AuthData } from "./auth.data.model";

@Injectable({ providedIn: "root" })
export class AuthService{
  private token: string;
  private authStatusListener = new Subject<boolean>()
  private isAuthenticated = false;
  private tokenTimer: any;
  private userID: string;

  constructor(private http: HttpClient, private router: Router){

  }

  getToken(){
    return this.token
  }

  getIsAuth(){
    return this.isAuthenticated;
  }

  getAuthStatusListener(){
    return this.authStatusListener.asObservable();
  }

  createUser(email: string, password: string){
    const auth: AuthData = {email: email, password: password};
    this.http.post("http://localhost:3000/user/signup", auth).subscribe((res) => {
      this.router.navigate(["/"]);
    }, error => {
        this.authStatusListener.next(false);
    });


  }

  login(email: string, password: string){
    const auth: AuthData = {email: email, password: password};
    console.log(auth.email);
    this.http.post<{token: string, expiresIn: number, userID: string}>("http://localhost:3000/user/login", auth).subscribe((res) => {
      console.log(res);
      this.token = res.token;
      if (this.token){
        const expireDuration = res.expiresIn
        this.setAuthTimer(expireDuration);
        this.isAuthenticated = true;
        this.userID = res.userID;
        this.authStatusListener.next(true);
        const now = new Date();
        const expiration = new Date(now.getTime() + expireDuration * 1000);
        console.log(now);
        this.saveAuthData(this.token, expiration, this.userID);
        this.router.navigate(["/"]);
      }
    }, error => {
        this.authStatusListener.next(false);
    })
  }

  logout(){
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userID = null;
    this.router.navigate(["/login"]);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
  }

  private saveAuthData(token: string, expirationDate: Date, userID: string){
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userID", userID);
  }

  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userID");
  }

  autoAuthUser(){
    const info = this.getAuthData();
    if (!info){
      return;
    }
    const now = new Date();
    const expiresIn = info.expiration.getTime() - now.getTime();
    if (expiresIn > 0){
      this.token = info.token;
      this.isAuthenticated = true;
      this.userID = info.userID;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }

  }

  private getAuthData(){
    const token = localStorage.getItem("token");
    const expiration = localStorage.getItem("expiration");
    const userID = localStorage.getItem("userID")
    if (!token || !expiration){
      return;
    }else{
      return {
        token: token,
        expiration: new Date(expiration),
        userID: userID
      }
    }
  }

  private setAuthTimer(duration: number){
    this.tokenTimer = setTimeout(() => {

    }, duration * 1000)
  }

  getUserID(){
    return this.userID;
  }

}
