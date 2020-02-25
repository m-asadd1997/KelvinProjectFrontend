import { Component, OnInit } from '@angular/core';
import { ApplicantForm } from './ApplicantForm';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent implements OnInit {

  resume:File;
  photo:File;
  id : any;

  foods: any[] = [
    {value: 'steak-0', viewValue: 'Steak'},
    {value: 'pizza-1', viewValue: 'Pizza'},
    {value: 'tacos-2', viewValue: 'Tacos'}
  ];
  Gender: any[] = [
    {value: 'male', viewValue: 'male'},
    {value: 'female', viewValue: 'female'}
  ];

  appFormObj: ApplicantForm = new ApplicantForm();
  constructor(private applicantService: ApplicantServiceService,private activateRoute: ActivatedRoute) { }

  ngOnInit(): void {

    this.id = this.activateRoute.snapshot.params['id'];
    console.log(this.id)

    if(this.id)
      this.getApplicantById(this.id)
      
  }

  getApplicantById(id){
    this.applicantService.getApplicantById(id).subscribe(d=>{
      this.appFormObj = d;
    })

  }

  openFile(){
    console.log('hell')
    document.querySelector('input').click()
  }
  handle(e){
    console.log(e)
  }

  saveApplicantForm(){
    console.log("this is form data "+this.appFormObj)
    console.log(this.resume)

    if(this.id){
      this.applicantService.updateApplicantForm(this.id,this.appFormObj).subscribe(d=>{
        console.log(d);
      })
    }else{
      this.applicantService.saveApplicantForm(this.appFormObj).subscribe(d=>{
        console.log(d);
      })

    }
    
    // this.createBase64String(this.appFormObj);
   

  }




_handleReaderLoaded(readerEvt) {
   var binaryString = readerEvt.target.result;
          let base64textString= btoa(binaryString);
          //console.log(btoa(binaryString));
          this.appFormObj.resume = base64textString;
          //console.log(this.appFormObj.resume)
          
  }
  
  _handleReaderImageLoaded(readerEvt) {
    var binaryString = readerEvt.target.result;
           let base64textString= btoa(binaryString);
           //console.log(btoa(binaryString));
           this.appFormObj.userImage = base64textString;
          // console.log(this.appFormObj.resume)
           
   }


  onFileChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.onload =this._handleReaderLoaded.bind(this);
      this.appFormObj.resumeContentType = file.type
     // console.log("1"+this.appFormObj.resumeContentType)
      reader.readAsBinaryString(file);
      
    }
  }

  onImageChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.onload =this._handleReaderImageLoaded.bind(this);
      this.appFormObj.userImage = file.type
      //console.log("1"+this.appFormObj.resumeContentType)
      reader.readAsBinaryString(file);
      
    }
  }

}


