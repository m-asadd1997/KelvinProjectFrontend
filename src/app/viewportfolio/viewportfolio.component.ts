import { Component,ElementRef, OnInit, ViewChild } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExportAsService, ExportAsConfig } from 'ngx-export-as';
import { NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-viewportfolio',
  templateUrl: './viewportfolio.component.html',
  styleUrls: ['./viewportfolio.component.css']
})
export class ViewportfolioComponent implements OnInit {
  id: any;
  applicantObj;
  showLoading = false;
  exportAsConfig: ExportAsConfig = {
    type: 'pdf', // the type you want to download
    elementId: 'myTableElementId', // the id of html/table element
  }
  socialLinks: any[] = [{
    socialLink : "",
    socialSite: ""
  }];

  closeResult: string;
  viewResume;
  token;
  showLinkExpired = false;
  url;

  
  
  constructor(private exportAsService: ExportAsService,private router: Router,private applicantService: ApplicantServiceService,private activateRoute: ActivatedRoute,private modalService: NgbModal) { }

  ngOnInit(): void {
    this.url = this.router.url
    
    
    this.id = this.activateRoute.snapshot.params['id'];
    if(this.url !== "/viewportfolio/"+this.id){
      console.log(this.url);
      
      this.checkLinkExpiry();
    }
    if(this.id)
    this.getPortfolioDataById(this.id)
    this.checkToken();
    
  }

  getPortfolioDataById(id: any){
    this.showLoading = true;
    this.applicantService.getPortfolioDataById(id).subscribe(d=>{
       this.applicantObj = (d.result)
       this.socialLinks = JSON.parse(d.result.socialMediaLinks)
      
       
       
       if(this.applicantObj){
        this.viewResume ="data:" + this.getMIMEtype(this.applicantObj['resumeContentType']) + ";base64," + encodeURI(this.applicantObj["resume"])

         this.showLoading = false;
        
         
       }
       else{
         this.showLoading = true;
       }
      
      
    })
    
  }

  goToapplicantTable(){
    this.router.navigate(['browseProfiles'])
  }

  goToNewProfiles(){
    this.router.navigate(['applicantForm'])
  }

   exportFile(type) {
    
     this.exportAsConfig.type = type;
    // download the file using old school javascript method
    this.exportAsService.save(this.exportAsConfig, 'myFile').subscribe(() => {
      // save started
    });
    // get the data as base64 or json object for json type - this will be helpful in ionic or SSR
   
  }

  downloadFile(){
    const extension =this.applicantObj['resumeContentType']
    const source =  "data:"+extension +";base64,"+this.applicantObj["resume"];//new Blob([this.applicantObj["resume"]], { type: this.getMIMEtype(this.applicantObj['resumeContentType']) });
    const downloadLink = document.createElement("a");
    const fileName = "download."+extension;

    downloadLink.href = source;
    downloadLink.download = fileName;
    downloadLink.click();
    //const url= window.URL.createObjectURL(blob);
    //window.open(url);
  }

  logout(){
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userType');

    this.router.navigate(['']);
 }
 getMIMEtype(extn) {
  let ext = extn
  let MIMETypes = {
    'text/plain': 'txt',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx',
    'application/msword': 'doc',
    'application/pdf': 'pdf',
    'image/jpeg': 'jpg',
    'image/bmp': 'bmp',
    'image/png': 'png',
    'application/vnd.ms-excel': 'xls',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/rtf': 'rtf',
    'application/vnd.ms-powerpoint': 'ppt',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'pptx',
    'docx': 'docx',
    'pdf': 'application/pdf',
    "doc":"doc"
  }
  console.log(MIMETypes[ext]);
  return MIMETypes[ext];
}
 
 
checkToken(){
  if(sessionStorage.getItem('token')){
    return true;
  }
  else{
    return false;
  }
}

openModalForPicture(content2) {
  this.modalService.open(content2, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}

private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return  `with: ${reason}`;
  }
}

openDocument(content1) {
  this.modalService.open(content1, {ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}


checkLinkExpiry(){
  this.token = this.activateRoute.snapshot.params["token"];
  this.applicantService.checkTokenExpiry(this.token).subscribe(d=>{
    if(d.status==200){
      if(d.result.visited==="no"){
        this.applicantService.changeVisitedToYes(this.token).subscribe(d=>{
          if(d.status==200){
            this.showLinkExpired = false;
            console.log("Success");
            
          }
          else{
            console.log("Error");     
          }
        })
      }
      else if(d.result.visited==="yes"){
        this.showLinkExpired = true;
      }

    }
    else{
      console.log("Error");
      
    }
  })
}

// this.stockCategory = location.hash.substr(1,location.hash.length);

}
