import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './login.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  errorVisible=false;
  showLoading = false;
  constructor(private router: Router, private service:LoginService,private toastr: ToastrService) { }

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

    check(uname: string, p: string) {
      this.showLoading = true;
      // var output = this.service.checkUserandPass(uname, p);
      this.service.checkUserandPass(uname, p).subscribe(
        res => {
          if(res.status=="200"){
            this.toastr.success(res.message,"Login Successfull");
            this.showLoading = false;
            console.log('toker', res);
  
            sessionStorage.setItem('token', res.result.token);
            sessionStorage.setItem('email',res.result.email);
            sessionStorage.setItem('username', res.result.username);
            sessionStorage.setItem('userType', res.result.userType);
            
            setTimeout(() => {
              this.router.navigate(['/applicantForm']);
            }, 1000);
          }
          else{
            this.toastr.error(res.message,"Login Unsuccessfull");
            
            this.router.navigate(['']);
          }
       
        },
        error => {
          this.showLoading = false;
          this.toastr.error("Unauthorized","Login Unsuccessfull")
        }
      );
  
      // if(output == true){
    }

}
