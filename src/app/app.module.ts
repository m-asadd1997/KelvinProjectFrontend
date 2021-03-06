import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatInputModule} from '@angular/material/input';
import { LoginPageComponent } from './login-page/login-page.component';
import { MainScreenComponent } from './main-screen/main-screen.component';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatBadgeModule} from '@angular/material/badge';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatCardModule} from '@angular/material/card';
import { CommonModule } from '@angular/common';
import {MatTableModule} from '@angular/material/table';
import { TestComponent } from './test/test.component';
import { NoopInterceptor } from './request.intercept';
import {MatDialogModule} from '@angular/material/dialog';
import { EmailPopupComponent } from './email-popup/email-popup.component';
import {MatIconModule} from '@angular/material/icon';
import { ViewportfolioComponent } from './viewportfolio/viewportfolio.component';
import {MatDividerModule} from '@angular/material/divider';
import { AgmCoreModule } from '@agm/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { NotificationsComponent } from './notifications/notifications.component';
import { ExportAsModule } from 'ngx-export-as';
import {MatRadioModule} from '@angular/material/radio';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer'
import { NgxUiLoaderModule,NgxUiLoaderHttpModule  } from 'ngx-ui-loader';
import {MatStepperModule} from '@angular/material/stepper';
import {MatTooltipModule} from '@angular/material/tooltip';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { ImageCropperModule } from 'ngx-image-cropper';

import uk from '@angular/common/locales/uk';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { ToastrModule } from 'ngx-toastr';
import { NgZorroAntdModule, NZ_I18N, en_US } from 'ng-zorro-antd';
import en from '@angular/common/locales/en';


registerLocaleData(uk);


@NgModule({
  declarations: [
    AppComponent,
    LoginPageComponent,
    MainScreenComponent,
    TestComponent,
    EmailPopupComponent,
    ViewportfolioComponent,
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatCheckboxModule,
    MatBadgeModule,
    FormsModule,
    HttpClientModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,  
    MatDividerModule,
    NgbModule,
    MatIconModule,
    MatPaginatorModule,
    MatDividerModule,
    MatSnackBarModule,
    ExportAsModule,
    MatRadioModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    NgxDocViewerModule,
    NgxExtendedPdfViewerModule,
    NgxUiLoaderHttpModule.forRoot({ showForeground: true }),
    NgxUiLoaderModule,
    MatStepperModule,
    MatTooltipModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyALCjeF10g7eOsE7zV9XT1R7k0iyMzWJWw',
      libraries: ['places']
    }),
    ImageCropperModule,
    NzModalModule,
    NzSliderModule,
    NzMessageModule,
    ToastrModule.forRoot(),
    NgZorroAntdModule

  
    
  ],
  providers: [
    MatDatepickerModule,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: NoopInterceptor,
      multi: true
    },
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    { provide: NZ_I18N, useValue: en_US  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
