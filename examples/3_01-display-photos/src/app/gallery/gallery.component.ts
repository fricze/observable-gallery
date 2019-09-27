import { Component } from '@angular/core';
import { PhotosService } from "../photos.service"
import { Photo } from "../photo"

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {
    photosList: Photo[] = this.photosService.photos;

    constructor(
        private photosService: PhotosService,
    ) { }
}
