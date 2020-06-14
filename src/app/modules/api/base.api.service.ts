import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {BrandService} from './brand.service';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';
import {TranslateService} from '@ngx-translate/core';
import {WebStorageService} from '../../services/storage/web-storage.service';

@Injectable()
export class BaseApiService {
    private baseUrl: string;
    private lastDetectedLangId: string;

    private options = {
        headers: new HttpHeaders({'Content-Type': 'application/json'}),
        withCredentials: true
    };

    constructor(private brandService: BrandService,
                private translateService: TranslateService,
                private webStorageService: WebStorageService,
                private httpClient: HttpClient) {
        this.baseUrl = brandService.getApiUrl();
        this.lastDetectedLangId = this.webStorageService.getItem('current_lang') || this.translateService.currentLang || 'en';
    }

    get(url: string, params?: HttpParams): Observable<any> {
        return this.httpClient.get(this.baseUrl + url, {...this.options, params})
            .catch(error => ErrorObservable.create(error.error));
    }

    post(url: string, body: any | null): Observable<any> {
        return this.httpClient.post(this.baseUrl + url, body, this.options)
            .catch(error => ErrorObservable.create(error.error));
    }

    put(url: string, body: string): Observable<any> {
        return this.httpClient.put(this.baseUrl + url, body, this.options)
            .catch(error => ErrorObservable.create(error.error));
    }
}
