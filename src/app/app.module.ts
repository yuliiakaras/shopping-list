import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ShoppingListComponent } from './components/shopping-list/shopping-list.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { MatSidenavModule } from '@angular/material/sidenav';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from './shared/shared.module';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { ProductDialogComponent } from './components/product-dialog/product-dialog.component';
import { TagsComponent } from './components/tags/tags.component';



@NgModule({
 declarations: [
    AppComponent,
    ShoppingListComponent,
    HeaderComponent,
    ProductDetailComponent,
    ProductDialogComponent,
    TagsComponent
 ],
 imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    SharedModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
 ],
 providers: [],
 bootstrap: [AppComponent]
})
export class AppModule { }