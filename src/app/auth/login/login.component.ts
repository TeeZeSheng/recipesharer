import { Component, OnInit, OnDestroy } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

@Component({
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]

})
export class LoginComponent implements OnInit, OnDestroy{
  constructor(public authService: AuthService){}

  isLoading = false;
  private authStatusSub: Subscription;

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      status => {
        this.isLoading = false;
      }
    );

  }

  onLogin(form: NgForm){
    if (form.invalid){
      return
    }else{
      this.isLoading = true;
      this.authService.login(form.value.email, form.value.password);
    }

  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }


}
