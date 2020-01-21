import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({
    providedIn: 'root'
})
export class ShopService {

    constructor(private http: HttpClient, private authService: AuthService) { }

    getAllShops() {
        const authtoken = this.authService.getToken();

        return this.http.get('http://localhost:3000/shops/all', {
            headers: { 'Content-Type': 'application/json', Authorization: authtoken}
        });
    }
    getShopById(id: string){
        const authtoken = this.authService.getToken();
        return this.http.get('http://localhost:3000/shops/'+id, {
            "headers": { 'Content-Type': 'application/json', Authorization: authtoken },
        });
    }

}
