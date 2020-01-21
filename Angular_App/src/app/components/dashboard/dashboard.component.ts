import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { ShopService } from 'src/app/services/shop.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  preferredShops= [];
  currentLocalisation = {latitude: 0, longitude: 0};
  currentUser;
  

  constructor(private userService: UserService,
              private shopService: ShopService,
              private authService: AuthService) { }

  ngOnInit() {
    this.userService.getLocalization().subscribe((data: { latitude: number, longitude: number }) => {
      this.currentLocalisation.latitude = data.latitude;
      this.currentLocalisation.longitude = data.longitude;
    });
    this.shopService.getAllShops().subscribe((data) => {
      if ((data as { shops: [] }).shops.length !== 0) {
        let allShops = (data as { shops: [] }).shops;
        this.currentUser = this.authService.getCurrentUser();
        console.log(allShops);
        
        this.currentUser.preferredShops_id.forEach(shop_id => {
          this.preferredShops.push(allShops.filter(shop => (shop as {_id})._id == shop_id)[0]);
        })

        this.preferredShops.sort(this.sortShops.bind(this))
      }
    });
  }

  unlikeShop(shopId) {
    this.preferredShops = this.preferredShops.filter(shop => shop._id != shopId);
    this.userService.modifyPreferredShop(shopId).subscribe((data: { user }) => {

      this.authService.updateUserData(data.user);
      this.currentUser = this.authService.getCurrentUser();

    });
  }

  sortShops(shop1, shop2) {
    let distanceToShop1 = this.calcDistanceWithLatLon(
      shop1.latitude, shop1.longitude, this.currentLocalisation.latitude, this.currentLocalisation.longitude
    )
    let distanceToShop2 = this.calcDistanceWithLatLon(
      shop2.latitude, shop2.longitude, this.currentLocalisation.latitude, this.currentLocalisation.longitude
    )
    if (distanceToShop1 < distanceToShop2) {
      return -1;
    }
    if (distanceToShop1 > distanceToShop2) {
      return 1;
    }
    return 0;
  }

  // function that calculates distances using longitude and latitude (a real pain in the a** calculations)
  calcDistanceWithLatLon(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1) * (Math.PI / 180)) * Math.cos((lat2) * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  }

}
