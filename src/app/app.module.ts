import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatFormFieldModule } from '@angular/material/form-field';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GalleryComponent } from './gallery/gallery.component';
import { PhotoComponent } from './photo/photo.component';
import { ActivePhotoComponent } from './active-photo/active-photo.component';
import { UploadPhotoComponent } from './upload-photo/upload-photo.component';
import { CategoriesComponent } from './categories/categories.component';

@NgModule({
    declarations: [
        AppComponent,
        GalleryComponent,
        PhotoComponent,
        ActivePhotoComponent,
        UploadPhotoComponent,
        CategoriesComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        FormsModule,
        MatProgressSpinnerModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
