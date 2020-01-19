import { Component, OnInit } from '@angular/core';
import { ValidateService } from 'src/app/services/validate.service';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  name: string;
  email: string;
  password: string;
  dataRegister: any = {};

  constructor(private validateService: ValidateService,
              private flashMessages: FlashMessagesService,
              private auth: AuthService,
              private router: Router ) { }

  ngOnInit() {
  }
  onRegisterSubmit() {
    const user = {
      name: this.name,
      email: this.email,
      password: this.password
    };
    // required fields
    if (!this.validateService.validateRegister(user)) {
      this.flashMessages.show('please fill in all the fields', {cssClass: 'alert-danger', timeout: 4000});
      return false;
    }
    // Register user
    this.auth.registerUser(user).subscribe(data => {

      this.dataRegister = data;
      console.log(this.dataRegister);

      if (this.dataRegister.success) {
        this.flashMessages.show('Registration Succesfull, please log in ', { cssClass: 'alert-success', timeout: 4000 });
        this.router.navigate(['/login']);
      } else {
        this.flashMessages.show('something went wrong please try again', { cssClass: 'alert-danger', timeout: 4000 });
        this.router.navigate(['/register']);
      }
    });

  }

}
