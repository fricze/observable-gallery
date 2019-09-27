import { Component } from '@angular/core';
import { PhotosService } from "../photos.service"
import { Observable } from 'rxjs';
import { Photo } from "../photo"

@Component({
    selector: 'app-active-photo',
    templateUrl: './active-photo.component.html',
    styleUrls: ['./active-photo.component.scss']
})
export class ActivePhotoComponent {
    photo: Photo
    activePhoto$: Observable<Photo> = this.photosService.activePhoto$;

    constructor(
        private photosService: PhotosService,
    ) { }

    hidePhoto() {
        this.photosService.activePhotoID$.next(this.photosService.noPhotoID);
    }
}
