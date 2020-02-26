import { Component, OnInit } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-viewportfolio',
  templateUrl: './viewportfolio.component.html',
  styleUrls: ['./viewportfolio.component.css']
})
export class ViewportfolioComponent implements OnInit {
  id: any;
  applicantObj;
  
  constructor(private applicantService: ApplicantServiceService,private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params['id'];
    if(this.id)
    this.getPortfolioDataById(this.id)
  }

  getPortfolioDataById(id: any){

    this.applicantService.getPortfolioDataById(id).subscribe(d=>{
       this.applicantObj = (d.result)
    })
  }

}
