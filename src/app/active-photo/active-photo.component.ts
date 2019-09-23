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
    photo: Photo

    photoSubscription: Subscription

    constructor(
        private photosService: PhotosService,
    ) {
        const subscription = this.photosService.activePhoto$.subscribe(photo => {
            this.photo = photo
        })

        this.photoSubscription = subscription
    }

    hidePhoto() {
        this.photosService.activePhotoID$.next("-1");
    }

    ngOnDestroy() {
        this.photoSubscription.unsubscribe()
    }
}
