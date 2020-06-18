import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { timeout } from 'rxjs/operators';
import { TimeoutError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  validateForm: FormGroup;
  error;
  loading = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public toastController: ToastController,
  ) { }

  ngOnInit() {
    this.validateForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  async submitForm() {
    this.loading = true;

    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
    }
    const email = this.validateForm.controls.email.value;
    const password = this.validateForm.controls.password.value;

    if (email && password){
      this.authService
        .login(this.validateForm.value)
        .pipe(timeout(5000))
        .subscribe(async (res: any) => {
          localStorage.setItem('authorization', res.token);
          const toast = await this.toastController.create({
            message: 'Successfully logged in',
            duration: 2000,
          });
          toast.present();
          this.router.navigate(['/home']);
          this.validateForm.reset();
        },
        async err => {
          if (err instanceof TimeoutError) {
            const toast = await this.toastController.create({
              message: 'Server taking too long to respond',
              duration: 2000,
            })
            toast.present();
          } else {
            const toast = await this.toastController.create({
              message: `${err.error.error}`,
              duration: 2000,
            });
            toast.present();
          }
        });
    }
    this.loading = false;
  }
}
