import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApplicantServiceService {

  constructor(private http: HttpClient) { }
   url:any = environment.baseUrl;
  saveApplicantForm(appObj: any):Observable<any>{
    return this.http.post(this.url+"api/applicant-form",appObj)
  }

  getApplicantFields():Observable<any>{
    return this.http.get("http://localhost:3000/applicant-form")
  }
}
