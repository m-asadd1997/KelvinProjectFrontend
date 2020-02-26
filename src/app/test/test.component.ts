import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { Router } from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  tableData = [];
  
  displayedColumns: string[] = ['id', 'name', 'phone', 'address','email','action'];
  dataSource = new MatTableDataSource<any>(this.tableData);

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  
  constructor(private applicantService:ApplicantServiceService, private router: Router) { }

  ngOnInit(): void {
    this.getDataInTable()
    this.dataSource.paginator = this.paginator;
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

  updateApplicantForm(id:any){
   this.router.navigate(['editapplicantform/'+id])
  }

  deleteApplicantById(id:any){
    this.tableData = [];
    this.applicantService.deleteApplicantById(id).subscribe(d=>{
      this.getDataInTable();
    })


  }
}
