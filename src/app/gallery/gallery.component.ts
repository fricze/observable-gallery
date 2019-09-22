import { Component, OnInit } from '@angular/core';
import { PhotosService } from "../photos.service"
import { CategoriesService } from "../categories.service"
import { of, merge, Observable } from 'rxjs';
import { map, switchMapTo } from "rxjs/operators"
import { Photo } from "../photo"

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
    photosList$: Observable<Photo[]>;
    categories: {}[];

    constructor(
        private photosService: PhotosService,
        private categoriesService: CategoriesService,
    ) { }

    ngOnInit() {
        // const activeCategory$ = this.categoriesService.getActiveCategory()
        // const newPhotosSaved$ = this.photosService.newPhotos$.pipe(
        //     switchMapTo(activeCategory$)
        // )

        // this.photosList$ = merge(activeCategory$, newPhotosSaved$).pipe(
        //     map(activeCategoryID => this.photosService.getPhotosList().filter(
        //         photo => photo.categoryID === activeCategoryID
        //     ))
        // )

        this.photosList$ = of(this.photosService.getPhotosList())
    }
}
