import { Component } from '@angular/core';
import { PhotosService } from "../photos.service"
import { Observable } from 'rxjs';
import { Photo } from "../photo"

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {
    photosList$: Observable<Photo[]> = this.photosService.getPhotosList$();

    constructor(
        private photosService: PhotosService,
    ) { }
}
