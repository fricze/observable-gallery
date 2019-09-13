import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PhotosService {

  constructor() { }

    photos = [
        {url: "https://66.media.tumblr.com/dff05f90167b5e50eab4df4f61a309aa/tumblr_o1ro152Q1m1rbkxlgo1_500.jpg", description: ""},
        {url: "https://66.media.tumblr.com/a5e1d06881c4f39dccd1ead2487a284c/tumblr_pp0la8dLxE1w4tdtqo1_500.jpg", description: ""},
        {url: "https://66.media.tumblr.com/9251ed46399400b08d15993800972c08/tumblr_pw9iqdF4Qr1tfqi0so1_500.jpg", description: ""}
    ]
}
