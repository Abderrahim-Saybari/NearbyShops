import { Component, OnInit } from '@angular/core';
import { ValidateService } from 'src/app/services/validate.service';
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

  constructor(private validateService: ValidateService, private flashMessages: FlashMessagesService) { }

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
  }

}
