import { HttpHeaders } from '@angular/common/http';

interface IHeaders {
  skipAuthorization?: string | 'false';
}

export class IRequestOptions {
  headers?: HttpHeaders | IHeaders | { [header: string]: string | Array<string> };
  observe?: 'body' | 'events' | 'response';
  params?: { [key: string]: any };
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
  withCredentials?: boolean;
  reportProgress?: boolean;
  retry?: number;
  showSpinner?: boolean;
  showError?: boolean;
}
