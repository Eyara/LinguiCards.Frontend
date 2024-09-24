import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { UserInfo } from '../../models/userInfo.model';

@Injectable({
    providedIn: 'root'
})
export class UserInfoService {
    private apiUrl = '/api';

    constructor(private http: HttpClient) { }

    getUserInfo(): Observable<UserInfo> {
        return this.http.get<UserInfo>(this.apiUrl + '/user/info');
    }
}
