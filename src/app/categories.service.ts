import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {
    categories = [
        { name: "Private" },
        { name: "Public" },
    ]
}
