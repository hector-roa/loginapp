import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user:UsuarioModel;
  recordarme = false;

  constructor(private auth:AuthService, private router:Router) { }

  ngOnInit() {
    this.user = new UsuarioModel();

    if(localStorage.getItem('email')) {
      this.user.email = localStorage.getItem('email');
      this.recordarme = true;
    }
    console.log(this.auth.estaAutenticado());
    
    if(this.auth.estaAutenticado()) {
      this.router.navigateByUrl('/home');
    }
  }

  login(form:NgForm) {
    if(form.invalid) { return; }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espera por favor...'
    });
    Swal.showLoading();

    this.auth.login(this.user)
      .subscribe( (res) => {
        
        if(this.recordarme) {
          localStorage.setItem('email', this.user.email);
        }
        
        Swal.close();
        console.log(res);
        
        this.router.navigateByUrl('/home');

      }, (err) => {
        console.log(err.error.error.message);
        Swal.fire('Error al autenticar',err.error.error.message, 'error');
      }, );
  }

}
