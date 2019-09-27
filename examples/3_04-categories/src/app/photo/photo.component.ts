import { Input, Component } from '@angular/core';
import { PhotosService } from "../photos.service"

@Component({
    selector: 'app-photo',
    templateUrl: './photo.component.html',
    styleUrls: ['./photo.component.scss']
})
export class PhotoComponent {
    constructor(private photosService: PhotosService, ) { }

    @Input() photo: { description: string; };

    onPhotoClick(photoID: string) {
        this.photosService.activePhotoID$.next(photoID)
    }
}
