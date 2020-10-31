export interface ApplicantForm {
    id?: number;
    userImageContentType?: string;
    userImage?: any;
    name?: string;
    email?: string;
    recevierEmail?: string;
    homeNumber?: string;
    cellNumber?: string;
    visaWorkOptions?:string;
    address?: string;
    gender?: string;
    cityForPlaceOfBirth?:String;
    provinceForPlaceOfBirth?:String;
    countryForPlaceOfBirth?:String;
    dateOfBirth?: Date;
    visaDetails?: string;
    citizenship?: string;
    resumeContentType?: string;
    resume?: any;
    employeeApplication?: String;
    employeeOrientation?: boolean;
    employeeIdentification?: String;
    otherCertification?: String;
    securityClearance?: String;
    medicalClearance?: String;
    employeeWellness?: boolean;
    emergencyContact?: boolean;
    emergencyContactInfo?: boolean;
    socialMediaLinks?: String;
    kpiCertified?:boolean;
    emergencyAddress?:String;
    emergencyPhone?:String;
    emergencyName?:String;
    emergencyEmail?:String;
    profileId?:String;
    zipCode?:String;
    country?:String;
    province?:String;
    city?:String;
    zipCodeForEmergency?:String;
    countryForEmergency?:String;
    provinceForEmergency?:String;
    cityForEmergency?:String;
    canadianCitizenshipDetails?:String;
    visaExpiryDate?:String;
    wage?:String;
    position?:String;
    draft?: boolean;
    companyName?:String;
    countryForCompany?:String;
    provinceForCompany?:String;
    cityForCompany?:String;
    latitude?:any;
    longitude?:any;
    addressForCompany?:String;
  }
  
  export class ApplicantForm implements ApplicantForm {
    constructor(
      public id?: number,
      public userImageContentType?: string,
      public userImage?: any,
      public name?: string,
      public email?: string,
      public recevierEmail?: string,
      public address?: string,
      public gender?: string,
      public dateOfBirth?: Date,
      public visaDetails?: string,
      public citizenship?: string,
      public resumeContentType?: string,
      public resume?: any,
      // public employeeApplication?: boolean,
      public employeeOrientation?: boolean,
      public employeeIdentification?: String,
      // public securityClearance?: boolean,
      // public medicalClearance?: boolean,
      public employeeWellness?: boolean,
      public emergencyContact?: boolean,
      public companyName?:String,
      public addressForCompany?:String,
      public draft?: boolean
    ) {
      // this.employeeApplication = this.employeeApplication || false;
      this.draft = this.draft || true;
      this.employeeOrientation = this.employeeOrientation || false;
      // this.employeeIdentification = this.employeeIdentification || false;
      // this.securityClearance = this.securityClearance || false;
      // this.medicalClearance = this.medicalClearance || false;
      this.employeeWellness = this.employeeWellness || false;
      this.emergencyContact = this.emergencyContact || false;
    }
  }

  export class ViewLink{
    email?:String;
    token?:String;
  }
  