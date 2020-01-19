import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  dataRegister: any = {};

  constructor(private authService: AuthService,
              private router: Router,
              private flashMessage: FlashMessagesService) { }

  ngOnInit() {
  }
  onLoginSubmit() {
      const user = {
        email: this.email,
        password: this.password
      };
      this.authService.authenticateUser(user).subscribe(data => {
        this.dataRegister = data;
        console.log(this.dataRegister);
        if (this.dataRegister.success) {
          this.authService.storeUserData(this.dataRegister.token, this.dataRegister.user);
          this.flashMessage.show('You are logged now',
           { cssClass: 'alert-success',
            timeout: 3000 });
          this.router.navigate(['/']);

        } else {
          this.flashMessage.show('something went wrong please try again',
           { cssClass: 'alert-danger',
            timeout: 4000 });
          this.router.navigate(['/login']);
        }
      });
  }

}
