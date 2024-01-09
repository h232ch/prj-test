import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "./user.model";
import {AuthService} from "./auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {
  userForm: FormGroup;
  loginMode = true;
  isLoading = false;

  error: string;
  isLoadingSub: Subscription;
  private errorSub: Subscription;
  private authSub: Subscription;

  constructor(
    private authService: AuthService,
  ) {

  }

  ngOnInit(): void {
    this.isLoadingSub = this.authService.isLoading
        .subscribe(res => {
          this.isLoading = res;
        })
    this.errorSub = this.authService.error
      .subscribe(res => {
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
    if (this.loginMode) {
      const user: User = this.userForm.value.userData;
      this.authSub = this.authService.login(user);
    } else {
      const user: User = this.userForm.value.userData;
      this.authSub = this.authService.join(user);
    }
  }

  onSwitchMode() {
    this.loginMode = !this.loginMode;
    this.initForm();
  }

  onHandleError() {
    this.isLoading = false;
    this.error = null;
  }

  ngOnDestroy(): void {

    if (this.errorSub) {
      this.errorSub.unsubscribe();
    }
    if (this.authSub) {
      this.authSub.unsubscribe();
    }
    if (this.isLoadingSub) {
      this.isLoadingSub.unsubscribe();
    }
  }
}
