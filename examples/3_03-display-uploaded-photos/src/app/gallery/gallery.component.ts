import { Component } from '@angular/core';
import { PhotosService } from "../photos.service"
import { Photo } from "../photo"
import { Observable } from 'rxjs';

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {
    photosList$: Observable<Photo[]> = this.photosService.photos$;

    constructor(
        private photosService: PhotosService,
    ) { }
}
