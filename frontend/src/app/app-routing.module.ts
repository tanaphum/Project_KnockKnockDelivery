import { IsNotLoggedInService } from './services/is-not-logged-in.service';
import { IsLoggedInService } from './services/is-logged-in.service';
import { RequestResetComponent } from './components/password/request-reset/request-reset.component';
import { LoginComponent } from './components/login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignupComponent } from './components/signup/signup.component';
import { ProfileComponent } from './components/profile/profile.component';
import { CreateProfileComponent } from './components/create-profile/create-profile.component';
import { ManageShopComponent } from './components/manage-shop/manage-shop.component';
import { ShopComponent } from './components/shop/shop.component';
import { ShopsComponent } from './components/shops/shops.component';
import { ResponseResetComponent } from './components/password/response-reset/response-reset.component';
import { CreateProductComponent } from './components/create-product/create-product.component';
import { AdminComponent } from './components/admin/admin.component';
import { CartComponent } from './components/cart/cart.component';
import { DeliverComponent } from './components/deliver/deliver.component';
import { OrderComponent } from './components/order/order.component';
import { DeliverOrdersComponent } from './components/deliver-orders/deliver-orders.component';
import { ScannerComponent } from './components/scanner/scanner.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { QRcodeComponent } from './components/qrcode/qrcode.component';
import { QrcodeResultComponent } from './components/qrcode-result/qrcode-result.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [IsNotLoggedInService]
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [IsNotLoggedInService]

  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [IsLoggedInService]
  },
  {
    path: 'shop',
    component: ShopComponent,
    canActivate: [IsLoggedInService]
  },  
  {
    path: 'shops',
    component: ShopsComponent,
    canActivate: [IsLoggedInService]
  },
  {
    path: 'cart',
    component: CartComponent,
    canActivate: [IsLoggedInService]
  },
  {
    path: 'qr-code',
    component: QRcodeComponent,
    canActivate: [IsLoggedInService]
  },
  {
  path: 'qr-code-result',
  component: QrcodeResultComponent,
  canActivate: [IsLoggedInService]
  },
  {
    path: 'order-detail',
    component: OrderDetailComponent,
    canActivate: [IsLoggedInService]
  },
  {
    path: 'scanner',
    component: ScannerComponent,
    canActivate: [IsLoggedInService]
  },
  {
    path: 'order',
    component: OrderComponent,
    canActivate: [IsLoggedInService]
  },
  {
    path: 'deliver',
    component: DeliverComponent,
    canActivate: [IsLoggedInService]
  },
  {
    path: 'deliver-order',
    component: DeliverOrdersComponent,
    canActivate: [IsLoggedInService]
  },
  {
    path: 'create-profile',
    component: CreateProfileComponent,
    canActivate: [IsLoggedInService]
  },
  {
    path: 'manage-shop',
    component: ManageShopComponent,
    canActivate: [IsLoggedInService]
  },
  {
    path: 'manage-shop/create-product',
    component: CreateProductComponent,
    canActivate: [IsLoggedInService]
  },
  {
    path: 'request-password-reset',
    component: RequestResetComponent,
    canActivate: [IsNotLoggedInService]
  },
  {
    path: 'response-password-reset',
    component: ResponseResetComponent,
    canActivate: [IsNotLoggedInService]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [IsLoggedInService]
  },
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  declarations: []
})
export class AppRoutingModule { }