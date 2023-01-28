import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  private authListenerSub: Subscription;
  isAuthenticated = false;

  constructor(private authService: AuthService){}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService.getAuthStatusListener().subscribe(res => {
      console.log(res);
      this.isAuthenticated = res;

    })
  }

  ngOnDestroy(): void {
    this.authListenerSub.unsubscribe();
  }

  onLogOut(){
    this.authService.logout();
  }
}
