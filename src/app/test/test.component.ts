import { Component, OnInit } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  tableData = [];
  
  constructor(private applicantService:ApplicantServiceService) { }

  ngOnInit(): void {
    this.getDataInTable()
  }

  getDataInTable(){
    //this.tableData = [];
    this.applicantService.getApplicantFields().subscribe(data=>{
      console.log(data)
      this.tableData = data; 
    //  data.map(d=>{
    //    this.tableData.push({
    //      id:d.id,
    //      name:d.name,
    //      email:d.email,
    //      address:d.address,
    //      phone:d.phone,
    //      gender:d.gender,
    //      placeOfBirth:d.placeOfBirth,
    //      dateOfBirth:d.dateOfBirth,
    //      visaDetails:d.visaDetails,
    //      citizenship:d.citizenship,
    //      employeeApplication:d.employeeApplication,
    //      employeeOrientation:d.employeeOrientation,
    //      employeeIdentification:d.employeeIdentification,
    //      securityClearance:d.securityClearance,
    //      medicalClearance:d.medicalClearance,
    //      employeeWellness:d.employeeWellness,
    //      emergencyContact:d.emergencyContact
    //    })
    //  })
     console.log(this.tableData)
    })
  }
}
