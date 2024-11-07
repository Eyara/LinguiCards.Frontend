import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInfo } from '../../models/userInfo.model';
import { UserSettings } from '../../models/user-settings.model';

@Injectable({
    providedIn: 'root'
})
export class UserInfoService {
    private apiUrl = '/api';

    constructor(private http: HttpClient) { }

    getUserInfo(): Observable<UserInfo> {
        return this.http.get<UserInfo>(`${this.apiUrl}/user/info`);
    }

    getUserSettings(): Observable<UserSettings> {
        return this.http.get<UserSettings>(`${this.apiUrl}/UserSetting`);
    }

    createOrUpdateUserSettings(activeTrainingSize: number, passiveTrainingSize: number): Observable<void> {
        const params = { 
            activeTrainingSize, 
            passiveTrainingSize 
        };
        return this.http.post<void>(`${this.apiUrl}/UserSetting`, null, { params });
    }
}
