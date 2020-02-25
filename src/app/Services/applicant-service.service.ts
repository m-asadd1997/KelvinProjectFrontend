import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApplicantServiceService {

  constructor(private http: HttpClient) { }

  saveApplicantForm(appObj: any):Observable<any>{
    return this.http.post("http://localhost:3000/applicant-form",appObj)
  }

  getApplicantFields():Observable<any>{
    return this.http.get("http://localhost:3000/applicant-form")
  }

  updateApplicantForm(id:any,appObj:any):Observable<any>{
    return this.http.post("http://localhost:3000/applicant-form/"+id,appObj)
  }

  getApplicantById(id):Observable<any>{
    return this.http.get("http://localhost:3000/applicant-form/"+id)
  }

  deleteApplicantById(id):Observable<any>{
    return this.http.delete("http://localhost:3000/applicant-form/"+id);
  }
}
