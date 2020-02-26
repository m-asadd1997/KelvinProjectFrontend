import { Component, OnInit } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';

@Component({
  selector: 'app-viewportfolio',
  templateUrl: './viewportfolio.component.html',
  styleUrls: ['./viewportfolio.component.css']
})
export class ViewportfolioComponent implements OnInit {

  appObj : any;
  constructor(private applicantService: ApplicantServiceService) { }

  ngOnInit(): void {
    this.applicantService.productMessage$.subscribe(d=>{
       this.appObj = d
       console.log("app obj ",this.appObj)
    })
  }

}
