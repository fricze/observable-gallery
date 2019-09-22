import { Component } from '@angular/core';
import { forkJoin, combineLatest, Observable } from "rxjs"
import { tap, withLatestFrom, map } from "rxjs/operators"
import { zipWith } from "ramda"
import { PhotosService } from "../photos.service"
import uuid from "uuidv4"

const toBase64 = (file: File) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

@Component({
    selector: 'app-upload-photo',
    templateUrl: './upload-photo.component.html',
    styleUrls: ['./upload-photo.component.scss']
})
export class UploadPhotoComponent {
    constructor(
        private photosService: PhotosService,
    ) { }

    filesCollection: File[]

    handleFileInput(files: File[]) {
        const filesCollection = Array.from(files)

        const newFiles$ = forkJoin(
            filesCollection.map(file => toBase64(file))
        )

        const imagesSources$ = newFiles$.pipe(
            map(filesSources => zipWith(
                (source: string, file: File) => ({
                    name: file.name, url: source,
                    id: uuid()
                }),
                filesSources, filesCollection
            )),
        )

        imagesSources$.subscribe(photos =>
            this.photosService.newPhotos$.next(photos))
    }
}
