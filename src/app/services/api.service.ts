import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    origin: string;
    apiURL: string;
    centerId: string;
    tempToken: string;
     constructor(
        private http: HttpClient
    ) {
        this.ReadCookie();
        this.origin = window.location.origin;
        this.apiURL = environment.apiUrl;
    }

    private static formatErrors(error: any) {
        return throwError(error.error);
    }

    getRaw(path: string, responseType: 'arraybuffer' | 'text' | 'blob' | 'json' = 'text'): Observable<any> {
        return this.http.get(`${this.apiURL}${path}`, {responseType: (responseType as any)});
    }

    getThirdParty(path: string, responseType: 'arraybuffer' | 'text' | 'blob' | 'json' = 'text'): Observable<any> {
        return this.http.get(`${path}`, {responseType: (responseType as any)});
    }
    get(path: string, params: HttpParams | { [param: string]: string | string[] } = new HttpParams()): Observable<any> {
        const tempToken = localStorage.getItem('token');
        const tempHeader = new HttpHeaders().append('Authorization', 'Bearer ' + tempToken);
        return this.http.get(`${this.apiURL}${path}`, {params, headers: tempHeader});
    }

    put(path: string, body: any): Observable<any> {
        const tempToken = localStorage.getItem('token');
        const tempHeader = new HttpHeaders().append('Authorization', 'Bearer ' + tempToken);
        return this.http.put(
            `${this.apiURL}${path}`, body, { headers: tempHeader});
    }

   /* post(path: string, body: object = {}): Observable<any> {
        console.log(this.apiURL);
        return this.http.post(
            `${this.apiURL}${path}`,
            JSON.stringify(body)
        );
    }
*/
    postRaw(path: string, body: any): Observable<any> {
            const tempToken = localStorage.getItem('token');
            const tempHeader = new HttpHeaders().append('Authorization', 'Bearer ' + tempToken);
            return this.http.post(
            `${this.apiURL}${path}`,
            body, { headers: tempHeader}
        );
    }
    rzpPost(path: string, body: any): Observable<any> {
        return this.http.post(
        `${path}`,body
    );
}

    delete(path): Observable<any> {
        const tempToken = localStorage.getItem('token');
        const tempHeader = new HttpHeaders().append('Authorization', 'Bearer ' + tempToken);
        return this.http.delete(
            `${this.apiURL}${path}`, {headers: tempHeader}
        );
    }

    deleteAll(path, data: any): Observable<any> {
        const tempToken = localStorage.getItem('token');
        const tempHeader = new HttpHeaders().append('Authorization', 'Bearer ' + tempToken);
        return this.http.post(
            `${this.apiURL}${path}`,data ,{headers: tempHeader}
        );
    }

    request(type: string, path: string, body: object = {}): Observable<any> {
        return this.http.request(
            type,
            `${this.apiURL}${path}`,
            {
                body: JSON.stringify(body)
            }
        );
    }
    ReadCookie() {
        const allCookies = document.cookie;
        // Get all the cookies pairs in an array
        const  cookieArray = allCookies.split(';');
        // Now take key value pair out of this array
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < cookieArray.length; i++) {
            const   name = cookieArray[i].split('=')[0];
            const  value = cookieArray[i].split('=')[1];
            if (name === 'centerId') {
                this.centerId = value;
            }
        }
    }
}