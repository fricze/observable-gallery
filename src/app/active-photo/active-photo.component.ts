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
    activePhoto$: Observable<Photo> = this.photosService.getActivePhoto$();

    constructor(
        private photosService: PhotosService,
    ) { }

    hidePhoto() {
        this.photosService.activePhoto$.next("-1");
    }
}
