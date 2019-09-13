import { Component, OnInit } from '@angular/core';
import { PhotosService } from "../photos.service"

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
    photosList: Array<{}>;

    constructor(photosService: PhotosService) {
        this.photosList = photosService.photos
    }

    ngOnInit() {
    }

    log() {
        console.log(this.photosList)
    }
}
