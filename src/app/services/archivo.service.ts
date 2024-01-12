import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { catchError, map, Observable, of } from 'rxjs';
import { ApiService } from './api/api.service';
import {
  FilesResponse,
  ISearchRetailVentasArchRequest,
  UploadFileModel,
  UploadFileResponse,
} from './archivo.model';
import { IFile, IGeneralResponse } from './shared.model';

@Injectable({
  providedIn: 'root',
})
export class ArchivoService {
  private urlBase: string;
  constructor(private apiService: ApiService, private http: HttpClient) {
    this.urlBase = `${environment.baseUrl}/api/archivos`;
  }

  Search(request: ISearchRetailVentasArchRequest): Observable<FilesResponse> {
    return this.apiService.get(`${this.urlBase}`, { params: { ...request } });
  }

  UploadFile(
    type: string,
    file: IFile,
    jsonData: UploadFileModel
  ): Observable<UploadFileResponse> {
    const promise = new Promise<UploadFileResponse>((resolve, rejects) => {
      const formData: FormData = new FormData();

      formData.append('file', file.data, file.data.name);
      formData.append('jsonData', JSON.stringify(jsonData));
      this.http
        .post(`${this.urlBase}?type=${type}`, formData, {
          reportProgress: true,
          observe: 'events',
        })
        .pipe(
          map((event) => {
            switch (event.type) {
              case HttpEventType.UploadProgress:
                file.progress = Math.round((event.loaded * 100) / event.total);
                const eventUploadfile = new CustomEvent('UPLOAD-FILE-REPORT', { bubbles: true, cancelable: true, composed: false, detail: file.progress });
                window.dispatchEvent(eventUploadfile);
                break;
              case HttpEventType.Response:
                return event;
            }
          }),
          catchError((error: HttpErrorResponse) => {
            file.inProgress = false;
            return of(`${file.data.name} upload failed.`);
          })
        )
        .subscribe((event: any) => {
          if (typeof event === 'object') {
            resolve(event.body as UploadFileResponse);
          }
        });
    });

    const uploadFileResponse$ = new Observable<UploadFileResponse>(
      (observer) => {
        promise
          .then((response) => {
            observer.next(response);
            observer.complete();
          })
          .catch((error) => {
            observer.next({ status: 500 });
            observer.complete();
          });
      }
    );

    return uploadFileResponse$;
  }

  deleteFile(sec: number): Observable<IGeneralResponse<boolean>> {
    return this.apiService.delete(`${this.urlBase}/${sec}`);
  }
}
