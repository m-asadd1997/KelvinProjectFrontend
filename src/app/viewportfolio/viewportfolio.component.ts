import { Component,ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';


@Component({
  selector: 'app-viewportfolio',
  templateUrl: './viewportfolio.component.html',
  styleUrls: ['./viewportfolio.component.css']
})
export class ViewportfolioComponent implements OnInit {
  id: any;
  applicantObj;
  exportAsConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementId: 'myTableElementId', // the id of html/table element
  }
  
  constructor(private exportAsService: ExportAsService,private router: Router,private applicantService: ApplicantServiceService,private activateRoute: ActivatedRoute) { }

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

  goToapplicantTable(){
    this.router.navigate(['test'])
  }

  goToNewProfiles(){
    this.router.navigate(['applicantForm'])
  }

   exportFile(type) {
     console.log("hello")
     this.exportAsConfig.type = type;
    // download the file using old school javascript method
    this.exportAsService.save(this.exportAsConfig, 'myFile').subscribe(() => {
      // save started
    });
    // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
   
  }

  logout(){
   
    this.router.navigate(['']);
 }

 
 


}
