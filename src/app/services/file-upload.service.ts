import { Injectable } from '@angular/core';
import {ApiService} from './api.service';
import {UtilityService} from './utility.service';
import {catchError, map} from 'rxjs/operators';
import {of, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpEvent, HttpEventType, HttpHeaderResponse} from '@angular/common/http';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class FileuploadService {
  private endPoint = 'uploadFile/multipleUpload';
  origin: string;
  apiURL: string;
  constructor(
      public apiService: ApiService,
      public utilityService: UtilityService,
      private http: HttpClient
  ) {
    this.origin = window.location.origin;
    this.apiURL = environment.apiUrl;
  }

  uploadImg = (image: File, imageFor, imageType?: string) => {
    this.utilityService.showPreloader();
    const formData = new FormData();
    formData.append('file_for', imageFor);
    formData.append('file', image);
    return this.http.post<any>(`${this.apiURL}/${this.endPoint}`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
        map((event: any) => {
          if (event.ok === true) {
            this.utilityService.hidePreloader();
            this.utilityService.showSnackBar('File Upload SuccessFully', 'customSuccess');
          }
          return  this.getEventMessage(event, formData);
        }),
        catchError(this.handleError)
    );
  }
  getEventMessage(event: any, formData) {
    switch (event.type) {
      case HttpEventType.UploadProgress:
        return this.fileUploadProgress(event);
        break;
      case HttpEventType.Response:
        return this.apiResponse(event);
        break;
      default:
        return `wait...`;
    }
  }
  public fileUploadProgress(event) {
    const percentDone = Math.round(100 * event.loaded / event.total);
    return { status: 'progress', message: percentDone };
  }

  public apiResponse(event) {
    return event.body;
  }
  public handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      this.utilityService.hidePreloader();
      this.utilityService.showSnackBar(error, 'error');
      console.error('An error occurred:', error.error.message);
    }
    return throwError(error);
  }
}