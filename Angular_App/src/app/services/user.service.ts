import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    constructor(private authService: AuthService, private http: HttpClient) { }

    getLocalization() {
        return this.http.get('http://ipapi.co/json');
    }
    modifyPreferredShop(shop_id: any){
        
        const authtoken = this.authService.getToken();
        let user = localStorage.getItem('user');
        return this.http.put('http://localhost:3000/users/preferredShops/'+shop_id, {'user':user}, {
            headers: { 'Content-Type': 'application/json', Authorization: authtoken }
        });
    }

}