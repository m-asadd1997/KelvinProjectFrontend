import { Component, OnInit, ViewChild } from '@angular/core';
import { ApplicantServiceService } from '../Services/applicant-service.service';
import { Router } from '@angular/router';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {  ViewLink } from '../main-screen/ApplicantForm';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {

  tableData:any[] = [];
  showLoader = true;
  displayedColumns: string[] = ['id', 'profileId','name', 'phone','email','profileStatus','action'];
  dataSource: MatTableDataSource<any>;
  closeResult: string;
  responseEmail : any;
  showloading = false;
  selectedIdForEmail;


  @ViewChild('scheduledOrdersPaginator') paginator: MatPaginator;
  
  constructor(private applicantService:ApplicantServiceService, 
    private router: Router,
    private modalService: NgbModal,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {    
    this.getDataInTable()
  }

  getDataInTable(){
    this.showLoader = true;
    this.applicantService.getApplicantFields().subscribe(data => {
    
      this.tableData = data;
      // this.responseEmail = data.recevierEmail
      // console.log(this.tableData.recevierEmail);
      
      
      if(this.tableData)
      {
        this.showLoader = false;
      }
      else{
        this.showLoader = false
      }
      
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.filterPredicate = function(data, filter: string): boolean {
      return data.name.toLowerCase().includes(filter);
    };
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

  viewPortfolio(id:any){
    this.router.navigate(['viewportfolio/'+id])
  }

  sendEmailPopup(element:any,id:any){
    this.selectedIdForEmail = id;
    this.modalService.open(element, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  goToapplicantTable(){
    this.router.navigate(['test'])
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

 applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
  
    this.dataSource.filter = filterValue;
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

viewLinkObj: ViewLink = new ViewLink()
sendEmail(email,id){
  if(id){
    if(email!= null){
      this.showloading = true;
      this.viewLinkObj.email = email;
      this.applicantService.sendEmail(this.viewLinkObj,id).subscribe(res=>{
        
        this._snackBar.open(res.message,"X",{duration: 3000});
        this.showloading = false;
       
      });      
    }
    else{      
      this._snackBar.open("Please Provide Email","X",{duration: 3000});
    }
  }
}
}
