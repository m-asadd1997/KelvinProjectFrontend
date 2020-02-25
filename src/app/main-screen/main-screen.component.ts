import { Component, OnInit } from '@angular/core';
import { ApplicantForm } from './ApplicantForm';
import { ApplicantServiceService } from '../Services/applicant-service.service';

@Component({
  selector: 'app-main-screen',
  templateUrl: './main-screen.component.html',
  styleUrls: ['./main-screen.component.css']
})
export class MainScreenComponent implements OnInit {

  resume:File;
  photo:File;

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
  constructor(private applicantService: ApplicantServiceService) { }

  ngOnInit(): void {
    console.log("Hello")
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
    // this.photo
    //this.createBase64String(this.appFormObj);
    this.applicantService.saveApplicantForm(this.appFormObj).subscribe(d=>{
      console.log(d);
    })
  }




_handleReaderLoaded(readerEvt) {
   var binaryString = readerEvt.target.result;
          let base64textString= btoa(binaryString);
          //console.log(btoa(binaryString));
          this.appFormObj.resume = base64textString;
          console.log(this.appFormObj.resume)
          
  }
  


  onFileChange(event) {
    let reader = new FileReader();
    if(event.target.files && event.target.files.length > 0) {
      let file = event.target.files[0];
      reader.onload =this._handleReaderLoaded.bind(this);
      this.appFormObj.resumeContentType = file.type
      console.log("1"+this.appFormObj.resumeContentType)
      reader.readAsBinaryString(file);
      
    }
  }

}


