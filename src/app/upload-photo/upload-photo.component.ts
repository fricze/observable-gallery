import { Component } from '@angular/core';
import { combineLatest } from "rxjs"
import { map } from "rxjs/operators"
import { zipWith } from "ramda"
import { PhotosService } from "../photos.service"

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

    constructor(private photosService: PhotosService) { }

    handleFileInput(files: Array<File>) {
        const filesCollection = Array.from(files)

        const imagesSources$ = combineLatest(
            filesCollection.map(file => toBase64(file))
        ).pipe(
            map(filesSources => zipWith(
                (source, file) => ({ name: file.name, url: source, description: "" }),
                filesSources, filesCollection
            ))
        )

        imagesSources$.subscribe(photos => this.photosService.addPhotos(photos))
    }
}
