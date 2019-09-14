import { AfterViewInit, Component, OnInit } from '@angular/core';

import { PhotosService } from "../photos.service"

@Component({
    selector: 'app-gallery',
    templateUrl: './gallery.component.html',
    styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit, AfterViewInit {

    photosList: Array<{}>;

    constructor(photosService: PhotosService) {
        this.photosList = photosService.photos
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
    }
}
