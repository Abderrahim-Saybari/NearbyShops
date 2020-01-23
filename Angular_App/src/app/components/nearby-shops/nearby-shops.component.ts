import { Component, OnInit } from '@angular/core';
import { ShopService } from 'src/app/services/shop.service';
import { UserService } from 'src/app/services/user.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nearby-shops',
  templateUrl: './nearby-shops.component.html',
  styleUrls: ['./nearby-shops.component.css']
})
export class NearbyShopsComponent implements OnInit {

  preferredShops = [];
  nearbyShops = [];
  currentUser: any;
  currentLocalisation = { latitude: 0, longitude: 0 }; // this is the user location lat and lon

  constructor(private shopService: ShopService,
    private userService: UserService,
    private authService: AuthService) { }

  ngOnInit() {
    this.userService.getLocalization().subscribe((data: { latitude: number, longitude: number }) => {
      this.currentLocalisation.latitude = data.latitude;
      this.currentLocalisation.longitude = data.longitude;
    });
    this.shopService.getAllShops().subscribe((data) => {
      if ((data as { shops: [] }).shops.length !== 0) {
        this.nearbyShops = (data as { shops: [] }).shops;
        this.nearbyShops.sort(this.sortShops.bind(this))

        this.currentUser = this.authService.getCurrentUser();

        this.currentUser.preferredShops_id.forEach(shopId => {
          this.nearbyShops = this.nearbyShops.filter(shop => shop._id != shopId);
        })
      }
    });
  }
  // function that sorts the shops array by longitude and latitude using the calcDistanceWithLatLon method
  // we are going to pass this function as a custom sorting algorithm to the sort method of JS
  // see the constructor
  sortShops(shop1: any, shop2: any) {
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
  calcDistanceWithLatLon(lat1: any, lon1: any, lat2: any, lon2: any) {
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

  dislikeShop(shopId: any) {
    let dislikedShop = this.nearbyShops.find(shop => shop._id == shopId);
    let indexOfDislikedShop = this.nearbyShops.indexOf(dislikedShop);
    this.nearbyShops.splice(indexOfDislikedShop, 1);
    setTimeout(() => {
      this.nearbyShops.push(dislikedShop);
      this.nearbyShops.sort(this.sortShops.bind(this));
    }, 5000);
  }

  likeShop(shopId: any) {
    this.nearbyShops = this.nearbyShops.filter(shop => shop._id != shopId);

    this.userService.modifyPreferredShop(shopId).subscribe((data: { user: any }) => {
      this.authService.updateUserData(data.user);
      this.currentUser = this.authService.getCurrentUser();

    });
  }

}
