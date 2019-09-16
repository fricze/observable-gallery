import { Component } from '@angular/core';
import { combineLatest, Observable } from "rxjs"
import { withLatestFrom, map } from "rxjs/operators"
import { zipWith } from "ramda"
import { PhotosService } from "../photos.service"
import { CategoriesService } from "../categories.service"

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
    constructor(private photosService: PhotosService,
        private categoriesService: CategoriesService) { }

    handleFileInput(files: Array<File>) {
        const filesCollection = Array.from(files)

        const newFiles$ = combineLatest(
            filesCollection.map(file => toBase64(file))
        )

        const activeCategory$: Observable<string> = this.categoriesService.activeCategory

        const imagesSources$ = newFiles$.pipe(
            withLatestFrom(activeCategory$),
            map(([filesSources, activeCategory]) => zipWith(
                (source: string, file: File) => ({
                    name: file.name, url: source, description: "", categoryID: activeCategory,
                }),
                filesSources, filesCollection
            ))
        )

        imagesSources$.subscribe(photos => this.photosService.addPhotos(photos))
    }
}
