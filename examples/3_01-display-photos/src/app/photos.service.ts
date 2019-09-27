import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from "rxjs/operators"
import { Photo } from "./photo"
import propEq from 'ramda/es/propEq';

const initialPhotos: Photo[] = [
    {
        url: "https://66.media.tumblr.com/dff05f90167b5e50eab4df4f61a309aa/tumblr_o1ro152Q1m1rbkxlgo1_500.jpg",
        description: "",
        id: "6d3238a0-8e7b-4f58-b799-37ad6072097e",
    },
    {
        url: "https://66.media.tumblr.com/be45669e5825a1db9c22c730c00eb5db/tumblr_o6ckp64vBe1vnm7bio1_500.jpg",
        description: "",
        id: "eec3632f-2364-47d5-8f87-504b98c8fc83",
    },
    {
        url: "https://66.media.tumblr.com/9251ed46399400b08d15993800972c08/tumblr_pw9iqdF4Qr1tfqi0so1_500.jpg",
        description: "",
        id: "02cc506c-a6f4-47f7-856b-cceec9e54190",
    },
    {
        url: "https://66.media.tumblr.com/24afdb14e85f6d48d482ae3a6af83c57/tumblr_pxx0abif9Q1qdsqp6o1_500.jpg",
        description: "",
        id: "279dd724-29c2-4b14-aedd-3c5f3f53ab9e",
    },
    {
        url: "https://66.media.tumblr.com/00cc8515932da313bba8335cc203f8ce/tumblr_pxyqayFKUm1qdsqp6o1_500.jpg",
        description: "",
        id: "d5af369b-7723-4fc9-856c-e3c2b3cfb03b",
    },
    {
        url: "https://66.media.tumblr.com/c9a8653bf0afb576e18e6f4b4c65288b/tumblr_py46p7VQNi1qdqlnso1_500.jpg",
        description: "",
        id: "28daea7d-d615-45a0-ac0b-b0d0bfc9a046",
    },
    {
        url: "https://66.media.tumblr.com/fbf867c85348db723a08e1c29f6449fb/tumblr_pqkkz4dePA1wfvbkto1_500.jpg",
        description: "",
        id: "d7bf8d6c-9358-4a51-b5a8-5decf7ad33cc",
    }
]

@Injectable({
    providedIn: 'root'
})
export class PhotosService {
    constructor(
    ) { }

    photos: Photo[] = initialPhotos

    noPhotoID = ""
    activePhotoID$ = new BehaviorSubject(this.noPhotoID)

    findPhotoByID = (photos: Photo[], photoID: string) =>
        photos.find(propEq("id", photoID))

    activePhoto$: Observable<Photo> = this.activePhotoID$.pipe(
        map((photoID) => this.findPhotoByID(this.photos, photoID)),
    )
}
