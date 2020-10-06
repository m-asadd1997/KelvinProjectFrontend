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
    placeOfBirth?: string;
    dateOfBirth?: Date;
    visaDetails?: string;
    citizenship?: string;
    resumeContentType?: string;
    resume?: any;
    employeeApplication?: String;
    employeeOrientation?: boolean;
    employeeIdentification?: String;
    securityClearance?: boolean;
    medicalClearance?: String;
    employeeWellness?: boolean;
    emergencyContact?: boolean;
    emergencyContactInfo?: boolean;
    socialMediaLinks?: String;
    kpiCertified?:boolean;
    emergencyAddress?:String;
    emergencyPhone?:String;
    emergencyName?:String;
    profileId?:String;
    zipCode?:String;
    country?:String;
    province?:String;
    city?:String;
    canadianCitizenshipDetails?:String;
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
      public placeOfBirth?: string,
      public dateOfBirth?: Date,
      public visaDetails?: string,
      public citizenship?: string,
      public resumeContentType?: string,
      public resume?: any,
      // public employeeApplication?: boolean,
      public employeeOrientation?: boolean,
      public employeeIdentification?: String,
      public securityClearance?: boolean,
      // public medicalClearance?: boolean,
      public employeeWellness?: boolean,
      public emergencyContact?: boolean
    ) {
      // this.employeeApplication = this.employeeApplication || false;
      this.employeeOrientation = this.employeeOrientation || false;
      // this.employeeIdentification = this.employeeIdentification || false;
      this.securityClearance = this.securityClearance || false;
      // this.medicalClearance = this.medicalClearance || false;
      this.employeeWellness = this.employeeWellness || false;
      this.emergencyContact = this.emergencyContact || false;
    }
  }
  