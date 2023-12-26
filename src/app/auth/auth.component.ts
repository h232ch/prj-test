import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "./user.model";
import {AuthService} from "./auth.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  userForm: FormGroup;
  loginMode = true;
  isLoading = false;
  error: string;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {
    this.authService.error.subscribe(res => {
      this.error = res;
    })
    this.initForm();
  }

  private initForm() {
    if (this.loginMode) {
      this.userForm = new FormGroup({
        userData: new FormGroup({
          'email': new FormControl<string>('',
            [
              Validators.email,
              Validators.required
            ]),
          'password': new FormControl<string>('', [
            Validators.minLength(6),
            Validators.required
          ]),
        })
      });
    } else {
      this.userForm = new FormGroup({
        userData: new FormGroup({
          'email': new FormControl<string>('',
            [
              Validators.email,
              Validators.required
            ]),
          'password': new FormControl<string>('', [
            Validators.minLength(6),
            Validators.required
          ])
        })
      })
    }
  }

  onSubmit() {
    this.isLoading = true;

    if (this.loginMode) {
      const user: User = this.userForm.value.userData;
      this.authService.login(user);
    } else {
      const user: User = this.userForm.value.userData;
      this.authService.join(user);
    }
    this.isLoading = false;
  }

  onSwitchMode() {
    this.loginMode = !this.loginMode;
    this.initForm();
  }

  onHandleError() {
    this.error = null;
  }
}
