import { Component, OnDestroy } from '@angular/core';
import { PhotosService } from "../photos.service"
import { Subscription } from 'rxjs';
import { Photo } from "../photo"

@Component({
    selector: 'app-active-photo',
    templateUrl: './active-photo.component.html',
    styleUrls: ['./active-photo.component.scss']
})
export class ActivePhotoComponent implements OnDestroy {
    private photo: Photo

    photoSubscription: Subscription =
        this.photosService.activePhoto$.subscribe(photo => {
            this.photo = photo
        })

    constructor(
        private photosService: PhotosService,
    ) { }

    hidePhoto() {
        this.photosService.activePhotoID$.next(this.photosService.noPhotoID);
    }

    ngOnDestroy() {
        this.photoSubscription.unsubscribe()
    }
}
