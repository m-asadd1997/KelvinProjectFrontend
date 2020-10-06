import { Component, OnInit, Inject } from '@angular/core';
import { ApplicantForm } from './ApplicantForm';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { JsonpInterceptor } from '@angular/common/http';
import csc from 'country-state-city'

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent implements OnInit {

  resume:File;
  photo:File;
  id : any;
  responseStatus = false;
  responseId :any;
  responseEmail : any;
  recieverEmailFlag = true;
  cities: Array<any> = [];
  provinces: Array<any> = [];
  countries: Array<Object> = [];

  dropdownOptions: any[] = [
    {value: 'yes', viewValue: 'Yes'},
    {value: 'no', viewValue: 'No'}
  ];
  Gender: any[] = [
    {value: 'male', viewValue: 'Male'},
    {value: 'female', viewValue: 'Female'},
    {value: 'other', viewValue: 'Other'}
  ];

  socialMediaPlatforms: any[] = [
    {value: 'facebook', viewValue: 'Facebook'},
    {value: 'instagram', viewValue: 'Instagram'},
    {value: 'linkedin', viewValue: 'LinkedIn'},
    {value: 'twitter', viewValue: 'Twitter'},
    {value: "pinterest" , viewValue: 'Pinterest'}
    

  ];

  appFormObj: ApplicantForm = new ApplicantForm();
  closeResult: string;
  durationInSeconds: number;
  success = "Success";
  showloading = false;
  showSaveLoading = false;
  disableSaveButton: boolean = false;
  socialLinks: any[] = [{
    socialLink : "",
    socialSite: ""
  }];
  cityObj: Object;
  countryObj: Object;
  provinceObj: any;
  viewResume;
 
  constructor(private _snackBar: MatSnackBar,private router:Router,private applicantService: ApplicantServiceService,private activateRoute: ActivatedRoute,private modalService: NgbModal) { }

  ngOnInit(): void {

    this.appFormObj.kpiCertified = false;
    this.id = this.activateRoute.snapshot.params['id'];
    this.getCountries();
  

    if(this.id){
    this.responseStatus = true;
      this.getApplicantById(this.id)
    }
      
  }

  check(){
    this.appFormObj.kpiCertified = !this.appFormObj.kpiCertified
    console.log(this.appFormObj.kpiCertified); 
  }
  
  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openDocument(content1) {
    this.modalService.open(content1, {ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openModalForPicture(content2) {
    this.modalService.open(content2, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


//   openImageInNewTab()
//   {
//     var newTab = window.open();
// newTab.document.body.innerHTML = `<img [src]="'data:image/jpeg;base64,'+${this.appFormObj.employeeIdentification}" >`;
//   }

openBase64InNewTab (data, mimeType) {
  var byteCharacters = atob(data);
  var byteNumbers = new Array(byteCharacters.length);
  for (var i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  var byteArray = new Uint8Array(byteNumbers);
  var file = new Blob([byteArray], { type: mimeType + ';base64' });
  var fileURL = URL.createObjectURL(file);
  window.open(fileURL);
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

  getApplicantById(id){
    this.applicantService.getApplicantById(id).subscribe(d=>{
      this.appFormObj = d.result;
      this.viewResume ="data:" + this.getMIMEtype(this.appFormObj['resumeContentType']) + ";base64," + encodeURI(this.appFormObj["resume"])
      this.socialLinks = JSON.parse(d.result.socialMediaLinks)
      this.countryObj = this.countries.find(c => c["name"] == d.result.country);
      this.provinceObj = csc.getStatesOfCountry(this.countryObj["id"]).find(s => s.name == d.result.province);
      this.cityObj =  csc.getCitiesOfState(this.provinceObj.id).find(cit => cit.name == d.result.city);
      this.provinces = csc.getStatesOfCountry(this.countryObj["id"]);
      this.cities = csc.getCitiesOfState(this.provinceObj.id);
      
      
    })

    
    
    
  }

  isemailPresent(){
    if(this.appFormObj.recevierEmail){
      return false;
    }
    else{
      return true;
    }
  }
  sendEmail(){
    if(this.id){
      if(this.responseEmail!= null){
        this.showloading = true;
        this.applicantService.sendEmail(this.id,this.responseEmail).subscribe(res=>{
          
          this._snackBar.open(res.message,"X",{duration: 3000});
          this.showloading = false;
         
        });      
      }
      else{      
        this._snackBar.open("Please Provide Email","X",{duration: 3000});
      }
    // }else{
    //   if(this.responseEmail!= null){
    //     this.showloading = true;
    //     this.applicantService.sendEmail(this.responseId,this.responseEmail).subscribe(res=>{
          
    //       this._snackBar.open(res.message,"X",{duration: 3000});
    //       this.showloading = false;
    //       if(!this.id){
    //         this.responseStatus = false;
    //       }
    //     });      
    //   }
    //   else{      
    //     this._snackBar.open("Please Provide Email","X",{duration: 3000});
    //   }
    // }
    }
    
   
    
  }


  openFile(){
    document.querySelector('input').click()
  }
  handle(e){
    console.log(e)
  }

  saveApplicantForm(myForm : NgForm){
    this.appFormObj.socialMediaLinks = JSON.stringify(this.socialLinks);
    // console.log("============>",JSON.stringify(this.socialLinks));
    
    this.disableSaveButton = true;
    // this.responseStatus = true;
    // this.disableSaveButton = true;
    this.responseId = null;
    console.log("this is form data "+this.appFormObj)
    if(this.id){
      this.showSaveLoading = true;
      this.applicantService.updateApplicantForm(this.id,this.appFormObj).subscribe(d=>{
        if(d['status']===200){
          
          this.showSaveLoading = false;
          this.responseId = d['result'].id;
          
          this.responseStatus = true;
          //this.openSnackBar("done")
          this._snackBar.open("Success","X",{duration: 3000});

        }
        else{
          this.responseStatus = false;
          this._snackBar.open("Error","X",{duration: 3000});
        }
        console.log(d);
      })
    }else{
      this.showSaveLoading = true;
      this.appFormObj.profileId = "p-" + this.GenerateUniqueID(); 
      this.applicantService.saveApplicantForm(this.appFormObj).subscribe(d=>{
        if(d['status']===200){
          this.showSaveLoading = false;
          this.responseId = d['result'].id;
          myForm.reset();
          console.log(this.responseId)
          // this.responseStatus = true;
          
          this._snackBar.open("Success","X",{duration: 3000});
          this.goToapplicantTable();
          
        }
        else{
          this.responseStatus = false;
          this._snackBar.open("Error","X",{duration: 3000});
        }
        console.log(d);
      },
      error=>{
        console.log(error)
      }
      )

    }
    
    // this.createBase64String(this.appFormObj);
   

  }

 


  
_handleReaderLoaded(readerEvt) {
   var binaryString = readerEvt.target.result;
          let base64textString= btoa(binaryString);
          //console.log(btoa(binaryString));
          this.appFormObj.resume = base64textString;
          this.viewResume = "data:" + this.getMIMEtype(this.appFormObj['resumeContentType']) + ";base64," + encodeURI(this.appFormObj["resume"])
          
          
  }
  
  _handleReaderImageLoaded(field,readerEvt) {
    var binaryString = readerEvt.target.result;
           let base64textString= btoa(binaryString);
           //console.log(btoa(binaryString));
           this.appFormObj[field] = base64textString;
          // console.log(this.appFormObj.resume)
           
   }


   

  onFileChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.onload =this._handleReaderLoaded.bind(this);
      this.appFormObj.resumeContentType = this.getFileExtension(file.name)
     // console.log("1"+this.appFormObj.resumeContentType)
      reader.readAsBinaryString(file);
      
    }


    // try {
    //   if (event.target.files && event.target.files.length > 0) {
    //     let file = event.target.files[0];
    //     if (this.fileExtensionAllowed(file.name)) {
    //       this.appFormObj.resumeContentType = this.getFileExtension(file.name)
        
    //       reader.onload = this._handleReaderLoaded.bind(this);
         
          
    //       reader.readAsBinaryString(file);
    //     }
    //     // else this.toastService.error('Unsuccessful', 'Candidate Profile failed');
    //     console.log("pdf type", this.appFormObj.resumeContentType);
        

    //   }
    // }
    // catch (error) {
    //   console.log(error);
    // }
  }

  onImageChange(event,field) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.onload =this._handleReaderImageLoaded.bind(this,field);
      this.appFormObj[field] = file.type
      //console.log("1"+this.appFormObj.resumeContentType)
      reader.readAsBinaryString(file);
      // console.log("field" , field);
      // console.log(this.appFormObj.userImage);
      
      
      
    }
  }

  getFileExtension = (filename) => filename.split('.').pop();
  fileExtensionAllowed(filename) {


    let extensionsAllowed = {
      "doc": true,
      "docx": true,
      "pdf": true
    }
    let ext = this.getFileExtension(filename)



    return extensionsAllowed[ext];
  }

  goToapplicantTable(){
    this.router.navigate(['browseProfiles'])
  }

  goToNewProfiles(){
    this.router.navigate(['applicantForm'])
  }

  logout(){
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('username');
    sessionStorage.removeItem('userType');
     this.router.navigate(['']);
  }

  downloadFile(){
    const extension =this.appFormObj.resumeContentType;
    const source =  "data:"+extension +";base64,"+this.appFormObj["resume"];//new Blob([this.applicantObj["resume"]], { type: this.getMIMEtype(this.applicantObj['resumeContentType']) });
    const downloadLink = document.createElement("a");
    const fileName = "download."+extension;

    downloadLink.href = source;
    downloadLink.download = fileName;
    downloadLink.click();
    //const url= window.URL.createObjectURL(blob);
    //window.open(url);


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


  formValidation(){

    if(this.appFormObj.name && (this.appFormObj.homeNumber || this.appFormObj.cellNumber) && this.appFormObj.placeOfBirth  && this.appFormObj.resume && this.appFormObj.visaDetails && this.appFormObj.gender && this.appFormObj.dateOfBirth && this.appFormObj.address && this.appFormObj.emergencyPhone && this.appFormObj.emergencyName && this.appFormObj.zipCode && this.appFormObj.city && this.appFormObj.country && this.appFormObj.province){
      
      return false;
      
    }
    else{
      return true;
    }
  }

  
  addSocialLink(){
    console.log(this.socialLinks)
   this.socialLinks.push({
    socialLink : "",
    socialSite: ""
   })
    //let socialLink = this.socialLink;
    // let socialSite = this.socialSite
    // this.socialLinks.push({
    //   link:socialLink,
    //   site:socialSite
    // })

    // console.log("social media obj", this.socialLinks)
    // socialLink = ""
    // socialSite = ""
  }

  removeSocialLink(i: number) {
    this.socialLinks.splice(i, 1);
  }


  //generate unique profile id
   GenerateUniqueID() {
    return (Math.random() * (78500000 - 78400101) + 78400101)|0;
  }

  getCountries(): void {

    this.countries = [
      {
        id: "38",
        name: "Canada",
        phonecode: "1",
        sortname: "CA"
      },
      {
        id: "231",
        name: "United States",
        phonecode: "1",
        sortname: "US",
      }
    ]

  }

  countryChange(countryObj): void {
    if (countryObj.value) {

      this.provinces = csc.getStatesOfCountry(countryObj.value.id)
      this.appFormObj.country = countryObj.value.name
      console.log(this.appFormObj.country);
      this.cities = null
    }
    else {
      this.provinces = null;
      this.cities = null
    }
  }
  provinceChange(provinceObj): void {
    if (provinceObj.value) {
      this.cities = csc.getCitiesOfState(provinceObj.value.id);
      this.appFormObj.province = provinceObj.value.name
      console.log(this.appFormObj.province);
      
    }
    else {
      this.cities = null;
    }
  }

cityChange(cityObj){
  this.appFormObj.city = cityObj.value.name
  console.log(this.appFormObj.city);
  

}
 
}


