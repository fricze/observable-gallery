import { Component, OnInit } from '@angular/core';
import { PhotosService } from "../photos.service"
import { CategoriesService } from "../categories.service"
import { merge } from "ramda"

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent {
    photosList: {}[];
    categories: {}[];

    constructor(private photosService: PhotosService,
        private categoriesService: CategoriesService, ) {

        this.photosList = photosService.photos.map(
            photo => merge(photo, {
                category: this.categoriesService.getByID(photo.categoryID)
            })
        )
    }
}
