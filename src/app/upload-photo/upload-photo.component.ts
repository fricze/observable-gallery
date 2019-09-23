import { Component } from '@angular/core';
import { forkJoin } from "rxjs"
import { map } from "rxjs/operators"
import { PhotosService } from "../photos.service"
import uuid from "uuidv4"
import { FileContent, readFileContent } from "../read-file-content"

@Component({
    selector: 'app-upload-photo',
    templateUrl: './upload-photo.component.html',
    styleUrls: ['./upload-photo.component.scss']
})
export class UploadPhotoComponent {
    constructor(
        private photosService: PhotosService,
    ) { }

    handleFileInput(images: File[]) {
        const imagesCollection = Array.from(images)
        const imagesContent: Array<Promise<FileContent>> =
            imagesCollection.map(file => readFileContent(file))

        const uploadedImages$ = forkJoin(imagesContent).pipe(
            map(imagesSources => {
                const imagesWithSource = imagesCollection.map(
                    (image, idx) => ({
                        name: image.name,
                        id: uuid(),
                        url: imagesSources[idx]
                    })
                )

                return imagesWithSource
            }),
        )

        uploadedImages$.subscribe(
            photos => this.photosService.newPhotos$.next(photos),
        )
    }
}
