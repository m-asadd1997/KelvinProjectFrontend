import { Component, OnInit, Inject, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ApplicantForm, ViewLink } from './ApplicantForm';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { ActivatedRoute, Router } from '@angular/router';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { JsonpInterceptor } from '@angular/common/http';
import csc from 'country-state-city'
import { MatStepper } from '@angular/material/stepper';
import { MapsAPILoader } from '@agm/core';
import { Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent implements OnInit {
isLinear = true;
  resume:File;
  photo:File;
  id : any;
  zoom: number = 15;
  responseStatus = false;
  responseId :any;
  responseEmail : any;
  recieverEmailFlag = true;
  cities: Array<any> = [];
  provinces: Array<any> = [];
  countries: Array<Object> = [];

  citiesForEmergency: Array<any> = [];
  provincesForEmergency: Array<any> = [];
  countriesForEmergency: Array<Object> = [];

  citiesForCompany: Array<any> = [];
  provincesForCompany: Array<any> = [];
  countriesForCompany: Array<Object> = [];

  citiesForPlaceOfBirth: Array<any> = [];
  provincesForPlaceOfBirth: Array<any> = [];
  countriesForPlaceOfBirth: Array<Object> = [];

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
  countryObjPlaceOfBirth: Object;
  provinceObjPlaceOfBirth: any;
  cityObjPlaceOfBirth: Object;
  cityObjForEmergency: Object;
  countryObjForEmergency: Object;
  provinceObjForEmergency: any;
  cityObjForCompany: Object;
  countryObjForCompany: Object;
  provinceObjForCompany: any;
  viewResume;
  longitude= 51.678418;address: any;
;
  latitude= 7.809007;
  private geoCoder;
  @ViewChild('stepper') stepper: MatStepper;
  @ViewChild('search')
  public searchElementRef: ElementRef;
  zoomvalue:any=1;
  checkZoomInOrOut=this.zoomvalue;
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  showCropper: boolean;
  
  constructor(private _snackBar: MatSnackBar,private router:Router,
    private applicantService: ApplicantServiceService,private activateRoute: ActivatedRoute,
    private modalService: NgbModal,private mapsAPILoader: MapsAPILoader,private ngZone: NgZone) { }

  ngOnInit(): void {

    this.appFormObj.kpiCertified = false;
    this.appFormObj.draft = true;
    this.id = this.activateRoute.snapshot.params['id'];
    this.getCountries();
  

    if(this.id){
    this.responseStatus = true;
      this.getApplicantById(this.id)
    }
    this.getCurrentLocationOnPageLoad();
    this.loadMap()
      
  }
  getCurrentLocationOnPageLoad() {
    this.getPosition().then(pos => {

      this.appFormObj.longitude = pos.lng;
      this.appFormObj.latitude = pos.lat;


    });
  }
  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      if(window.navigator.geolocation){
      navigator.geolocation.getCurrentPosition(resp => {

        resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
      },
        err => {
          reject(err);
        });
    }else{
      console.log("Geolocation is not supported by this browser");
    }
  });


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
      this.populateDropdowns(d)
      this.populateDropdownsForEmergencyContacts(d)
      this.populateDropdownsForPlaceOfBirth(d)
      this.populateDropdownsForCompanyContacts(d)
      
      
      console.log(this.countryObj,this.provinceObj,this.cityObj);
      
    })
  }

  populateDropdownsForEmergencyContacts(d){
    if(d.result.countryForEmergency){
    this.countryObjForEmergency = this.countriesForEmergency.find(coun => coun["name"] == d.result.countryForEmergency);
    this.provinceObjForEmergency = csc.getStatesOfCountry(this.countryObjForEmergency["id"]).find(ss => ss.name == d.result.provinceForEmergency);
    this.cityObjForEmergency =  csc.getCitiesOfState(this.provinceObjForEmergency.id).find(city => city.name == d.result.cityForEmergency);
    this.provincesForEmergency = csc.getStatesOfCountry(this.countryObjForEmergency["id"]);
    this.citiesForEmergency = csc.getCitiesOfState(this.provinceObjForEmergency.id);
    }
  }

  populateDropdownsForCompanyContacts(d){
    if(d.result.countryForCompany){
    this.countryObjForCompany = this.countriesForCompany.find(coun => coun["name"] == d.result.countryForCompany);
    this.provinceObjForCompany = csc.getStatesOfCountry(this.countryObjForCompany["id"]).find(ss => ss.name == d.result.provinceForCompany);
    this.cityObjForCompany =  csc.getCitiesOfState(this.provinceObjForCompany.id).find(city => city.name == d.result.cityForCompany);
    this.provincesForCompany = csc.getStatesOfCountry(this.countryObjForCompany["id"]);
    this.citiesForCompany = csc.getCitiesOfState(this.provinceObjForCompany.id);
  }
}

  populateDropdowns(d){
    if(d.result.country){
    this.countryObj = this.countries.find(c => c["name"] == d.result.country);
    this.provinceObj = csc.getStatesOfCountry(this.countryObj["id"]).find(s => s.name == d.result.province);
    this.cityObj =  csc.getCitiesOfState(this.provinceObj.id).find(cit => cit.name == d.result.city);
    this.provinces = csc.getStatesOfCountry(this.countryObj["id"]);
    this.cities = csc.getCitiesOfState(this.provinceObj.id);
      }
  }

  populateDropdownsForPlaceOfBirth(d){
    
    this.countryObjPlaceOfBirth = this.countriesForPlaceOfBirth.find(coun => coun["name"] == d.result.countryForPlaceOfBirth);
    this.provinceObjPlaceOfBirth = csc.getStatesOfCountry(this.countryObjPlaceOfBirth["id"]).find(ss => ss.name == d.result.provinceForPlaceOfBirth);
    this.cityObjPlaceOfBirth =  csc.getCitiesOfState(this.provinceObjPlaceOfBirth.id).find(city => city.name == d.result.cityForPlaceOfBirth);
    this.provincesForPlaceOfBirth = csc.getStatesOfCountry(this.countryObjPlaceOfBirth["id"]);
    this.citiesForPlaceOfBirth = csc.getCitiesOfState(this.provinceObjPlaceOfBirth.id);
  }

//TODO:Need to remove below code
  isemailPresent(){
    if(this.appFormObj.recevierEmail){
      return false;
    }
    else{
      return true;
    }
  }
   isEmpty(value){
    return (value == null || value.length === 0);
  }
  onNextPersonalInformation(form : NgForm,callApi:Boolean) {
    // Validate your value in the function
    if (this.isEmpty(this.appFormObj.name) || this.isEmpty(this.appFormObj.email) 
        || (this.isEmpty(this.appFormObj.homeNumber)  || this.isEmpty(this.appFormObj.cellNumber)) 
        || this.isEmpty(this.appFormObj.gender) || this.isEmpty(this.appFormObj.dateOfBirth) 
        || this.isEmpty(this.appFormObj.cityForPlaceOfBirth)) {      
      this.stepper.selected.completed = false;
    }
    else{
      if(callApi){
        this.savePersonalInformation(form);
      }else{
      this.stepper.selected.completed = true;
      this.stepper.next();
      }
    }
  }


  onNextAddressDetail(form:NgForm,callApi:Boolean){
    if (this.isEmpty(this.appFormObj.address) || this.isEmpty(this.appFormObj.zipCode) 
        || this.isEmpty(this.appFormObj.city)) {      
      this.stepper.selected.completed = false;
    }
    else{
      if(callApi){
        this.savePersonalInformation(form);
      }else{
      this.stepper.selected.completed = true;
      this.stepper.next();
      }
    }
  }

  onNextEmergencyContact(form:NgForm,callApi:Boolean){
    if (this.isEmpty(this.appFormObj.emergencyName) || this.isEmpty(this.appFormObj.emergencyEmail) 
        || this.isEmpty(this.appFormObj.emergencyPhone)|| this.isEmpty(this.appFormObj.emergencyAddress) 
        || this.isEmpty(this.appFormObj.cityForEmergency) || this.isEmpty(this.appFormObj.zipCodeForEmergency)) {      
      this.stepper.selected.completed = false;
    }
    else{
      if(callApi){
        this.savePersonalInformation(form);
      }else{
      this.stepper.selected.completed = true;
      this.stepper.next();
      }
    }
  }

  onNextAssignmentDetail(form:NgForm,callApi:Boolean){
    if (this.isEmpty(this.appFormObj.position) || this.isEmpty(this.appFormObj.wage)
    || this.isEmpty(this.appFormObj.companyName) ||
    // this.isEmpty(this.appFormObj.cityForCompany)
    this.isEmpty(this.appFormObj.addressForCompany)
    ) {      
      this.stepper.selected.completed = false;
    }
    else{
      if(callApi){
        this.savePersonalInformation(form);
      }else{
      this.stepper.selected.completed = true;
      this.stepper.next();
      }
    }
  }

  onNextSupportingDoc(form:NgForm,callApi:Boolean){
    if (this.isEmpty(this.appFormObj.visaDetails) || this.isEmpty(this.appFormObj.citizenship) 
        || this.isEmpty(this.appFormObj.securityClearance)|| this.isEmpty(this.appFormObj.employeeApplication) 
        || this.isEmpty(this.appFormObj.employeeIdentification) || this.isEmpty(this.appFormObj.resume)) {      
      this.stepper.selected.completed = false;
    }
    else{
      if(callApi){
        this.savePersonalInformation(form);
      }else{
      this.stepper.selected.completed = true;
      this.stepper.next();
      }
    }
  }

  onNextVisaDetails(form:NgForm,callApi:Boolean){
    
      if(callApi){
        this.savePersonalInformation(form);
      }else{
      this.stepper.selected.completed = true;
      this.stepper.next();
      }
    
  }

  onSaveApplicantForm(form:NgForm,){
    this.appFormObj.draft =false;
    this.savePersonalInformation(form);
  }

  viewLinkObj: ViewLink = new ViewLink()
  sendEmail(){
    // if(this.id){
    //   if(this.responseEmail!= null){
    //     this.showloading = true;
    //     this.viewLinkObj.email = this.responseEmail;
    //     this.applicantService.sendEmail(this.viewLinkObj,this.id).subscribe(res=>{
    //       this._snackBar.open(res.message,"X",{duration: 3000});
    //       this.showloading = false;
    //     });      
    //   }
    //   else{      
    //     this._snackBar.open("Please Provide Email","X",{duration: 3000});
    //   }
    // }
    if(this.appFormObj.recevierEmail){
      this.showloading = true;
      this.viewLinkObj.email = this.appFormObj.recevierEmail;
      this.applicantService.sendEmail(this.viewLinkObj,this.id).subscribe(res=>{
        this._snackBar.open("Email has been sent to "+this.appFormObj.recevierEmail,"X",{duration: 3000});
        this.showloading = false;
      }); 
    }else{
      this._snackBar.open("Please Provide Email","X",{duration: 3000});
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
    this.disableSaveButton = true;
    this.responseId = null;

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

 
  savePersonalInformation(myForm : NgForm){
    this.appFormObj.socialMediaLinks = JSON.stringify(this.socialLinks);
    
    this.showSaveLoading = true;
    if(this.responseId || this.id){
      let recordId = this.responseId != null ?this.responseId :this.id;
      
      this.appFormObj.draft=this.formValidation();
      
      this.applicantService.updateApplicantForm(recordId,this.appFormObj).subscribe(d=>{
        if(d['status'] === 200){
          this.showSaveLoading = false;
          this.responseId = d['result'].id;
          
          this.responseStatus = true;
          //this.openSnackBar("done")
          this._snackBar.open("Success","X",{duration: 3000});
          if(!this.formValidation()){
            myForm.reset();
            this.goToapplicantTable();
          }else{
            this.stepper.selected.completed = true;
            this.stepper.next();
          }
        }
        else{
          this.responseStatus = false;
          this._snackBar.open("Error","X",{duration: 3000});
        }
        console.log(d);
      })
    }else{
      this.appFormObj.profileId = "p-" + this.GenerateUniqueID(); 
      this.applicantService.saveApplicantForm(this.appFormObj).subscribe(d=>{
        if(d['status']===200){
          this.showSaveLoading = false;
          this.responseId = d['result'].id;
          console.log(this.responseId)
          this._snackBar.open("Success","X",{duration: 3000});
          if(!this.formValidation()){
            myForm.reset();
            this.goToapplicantTable();
          }else{
            this.stepper.selected.completed = true;
            this.stepper.next();
          }
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
}

  
_handleReaderLoaded(readerEvt) {
   var binaryString = readerEvt.target.result;
          let base64textString= btoa(binaryString);
          this.appFormObj.resume = base64textString;
          this.viewResume = "data:" + this.getMIMEtype(this.appFormObj['resumeContentType']) + ";base64," + encodeURI(this.appFormObj["resume"])
          
          
  }
  
  _handleReaderImageLoaded(field,readerEvt) {
      var binaryString = readerEvt.target.result;
      let base64textString= btoa(binaryString);
      this.appFormObj[field] = base64textString;
   }

  onFileChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.onload =this._handleReaderLoaded.bind(this);
      this.appFormObj.resumeContentType = this.getFileExtension(file.name)
      reader.readAsBinaryString(file);
      
    }


  }

  onImageChange(event,field) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.onload =this._handleReaderImageLoaded.bind(this,field);
      this.appFormObj[field] = file.type
      reader.readAsBinaryString(file);
     
      
    }
  }

  onImageChangeWithCropper(event) {
    let reader = new FileReader();
    this.fileChangeEvent(event)
    if(event.target.files && event.target.files.length > 0) {
    
      let file = event.target.files[0];
      if(event.target.files[0].size > 5000000){
        // this.message.error("image size cannot be greater than 5mb", {
        //   nzDuration: 3000
        // });
        this.disableSaveButton = true;
      }
      else{
        this.disableSaveButton = false;
      }
      console.log(event.target.files[0].size)
      reader.onload =this._handleReaderImageLoadedForCropper.bind(this);

      this.appFormObj.userImage = file.type
      console.log( this.appFormObj.userImage)
      //console.log("1"+this.appFormObj.resumeContentType)
      reader.readAsBinaryString(file);
      
    }

  }

  _handleReaderImageLoadedForCropper(readerEvt) {
    var binaryString = readerEvt.target.result;
           let base64textString= btoa(binaryString);
           //console.log(btoa(binaryString));
           this.appFormObj.userImage = base64textString;
          // console.log(this.appFormObj.resume)
          // console.log(this.companyObj.companyimage) 
           
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
    if(this.appFormObj.name && (this.appFormObj.homeNumber || this.appFormObj.cellNumber) && this.appFormObj.cityForPlaceOfBirth  &&
     this.appFormObj.resume && this.appFormObj.visaDetails && this.appFormObj.gender && this.appFormObj.dateOfBirth &&
      this.appFormObj.address && this.appFormObj.emergencyPhone && this.appFormObj.emergencyName && this.appFormObj.emergencyEmail && this.appFormObj.zipCode &&
       this.appFormObj.city && this.appFormObj.country && this.appFormObj.province && this.appFormObj.zipCodeForEmergency &&
        this.appFormObj.position && this.appFormObj.wage && this.appFormObj.cityForEmergency && this.appFormObj.provinceForEmergency &&
        this.appFormObj.countryForEmergency && this.appFormObj.emergencyAddress && this.appFormObj.securityClearance && this.appFormObj.employeeApplication
        && this.appFormObj.employeeIdentification && this.appFormObj.companyName && 
        // this.appFormObj.cityForCompany
        this.appFormObj.addressForCompany && this.appFormObj.recevierEmail
        ){
      
      return false;
      
    }
    else{
      return true;
    }
  }
  
  addSocialLink(){
   this.socialLinks.push({
    socialLink : "",
    socialSite: ""
   })
  
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

    this.countriesForEmergency = [
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

    this.countriesForPlaceOfBirth = [
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
    
    this.countriesForCompany = [
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
      this.appFormObj.country = countryObj.value.name;
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
      this.appFormObj.province = provinceObj.value.name;
    }
    else {
      this.cities = null;
    }
  }

cityChange(cityObj){
  this.appFormObj.city = cityObj.value.name
}


countryChangeForEmergency(countryObj): void {
  if (countryObj.value) {
    this.provincesForEmergency = csc.getStatesOfCountry(countryObj.value.id)
    this.appFormObj.countryForEmergency = countryObj.value.name;
    this.citiesForEmergency = null
  }
  else {
    this.provincesForEmergency = null;
    this.citiesForEmergency = null
  }
}
provinceChangeForEmergency(provinceObj): void {
  if (provinceObj.value) {
    this.citiesForEmergency = csc.getCitiesOfState(provinceObj.value.id);
    this.appFormObj.provinceForEmergency = provinceObj.value.name;
  }
  else {
    this.citiesForEmergency = null;
  }
}

cityChangeForEmergency(cityObj){
  this.appFormObj.cityForEmergency = cityObj.value.name;
}
 

countryChangeForPlaceOfBirth(countryObj): void {
  if (countryObj.value) {

    this.provincesForPlaceOfBirth = csc.getStatesOfCountry(countryObj.value.id)
    this.appFormObj.countryForPlaceOfBirth = countryObj.value.name;
    this.citiesForPlaceOfBirth = null
  }
  else {
    this.provincesForPlaceOfBirth = null;
    this.citiesForPlaceOfBirth = null
  }
}
provinceChangeForPlaceOfBirth(provinceObj): void {
  if (provinceObj.value) {
    this.citiesForPlaceOfBirth = csc.getCitiesOfState(provinceObj.value.id);
    this.appFormObj.provinceForPlaceOfBirth = provinceObj.value.name 
  }
  else {
    this.citiesForPlaceOfBirth = null;
  }
}

cityChangeForPlaceOfBirth(cityObj){
  this.appFormObj.cityForPlaceOfBirth = cityObj.value.name
}

countryChangeForCompany(countryObj): void {
  if (countryObj.value) {

    this.provincesForCompany = csc.getStatesOfCountry(countryObj.value.id)
    this.appFormObj.countryForCompany = countryObj.value.name
    console.log(this.appFormObj.countryForCompany);
    this.citiesForCompany = null
  }
  else {
    this.provincesForCompany = null;
    this.citiesForCompany = null
  }
}
provinceChangeForCompany(provinceObj): void {
  if (provinceObj.value) {
    this.citiesForCompany = csc.getCitiesOfState(provinceObj.value.id);
    this.appFormObj.provinceForCompany = provinceObj.value.name
  }
  else {
    this.citiesForCompany = null;
  }
}

cityChangeForCompany(cityObj){
  this.appFormObj.cityForCompany = cityObj.value.name
}


loadMap(): Promise<any> {
  return new Promise((resolve, reject) => {

    this.mapsAPILoader.load().then(() => {
    
        this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;

      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }


          //set latitude, longitude and zoom
          this.appFormObj.latitude = place.geometry.location.lat();
          this.appFormObj.longitude = place.geometry.location.lng();

        });
      });

      resolve();
    })
  })

}

private setCurrentLocation() {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition((position) => {
      this.appFormObj.latitude = position.coords.latitude;
      this.appFormObj.longitude = position.coords.longitude;

      this.getAddress(this.appFormObj.latitude, this.appFormObj.longitude);
    });
  }
}

getAddress(latitude, longitude) {
  this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
    if (status === 'OK') {
      if (results[0]) {

        this.address = results[0].formatted_address;
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }

  });
}

focusOutFunction(event){
  this.appFormObj.addressForCompany = event.target.value
}

imageLoaded() {
  this.showCropper = true;
  console.log('Image loaded');
}

cropperReady(sourceImageDimensions: Dimensions) {
  console.log('Cropper ready', sourceImageDimensions);
}





resetImage() {
  this.scale = 1;
  this.rotation = 0;
  this.canvasRotation = 0;
  this.transform = {};
}




  zoomCropper(a) {

    this.zoomvalue = a;
    this.transform = {
      ...this.transform,
      scale: this.zoomvalue
    };
  }


toggleContainWithinAspectRatio() {
  this.containWithinAspectRatio = !this.containWithinAspectRatio;
}

updateRotation() {
  this.transform = {
    ...this.transform,
    rotate: this.rotation
  };
}




fileChangeEvent(event: any): void {
  
  this.isVisible = true;
  this.imageChangedEvent = event;
}

imageCropped(event: ImageCroppedEvent) {
  this.croppedImage = event.base64.replace(/^data:image\/[a-z]+;base64,/, "");

}




updateCroppedImage() {
  sessionStorage.removeItem('companyImage');
  this.appFormObj.userImage = this.croppedImage;
  sessionStorage.setItem('companyImage', this.appFormObj.userImage);
  // this.logoChangeObservable.next();
  // console.log(event, base64ToFile(event.base64));
  // base64 to blob file
  this.isVisible = false;
}

isVisible = false;



showModal(): void {
  this.isVisible = true;
}

handleOk(): void {
  console.log('Button ok clicked!');
  this.isVisible = false;
}

handleCancel(): void {
  this.appFormObj.userImage = null; 
  console.log('Button cancel clicked!', this.appFormObj.userImage);
  this.isVisible = false;
}

}


