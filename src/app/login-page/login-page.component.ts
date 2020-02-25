import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  errorVisible=false;
  constructor(private router: Router) { }

  ngOnInit(): void {
    localStorage.clear();
  }
  login(email,password){
    this.errorVisible=false;
     if(email=='stepway'&&password=='123'){
       localStorage.setItem('user','admin');
       this.router.navigate(['applicantForm'])
       
     }
     else{
      this.errorVisible=true;
     }
     
      
    }

}
