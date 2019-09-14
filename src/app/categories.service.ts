import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {
    categories = [
        { name: "Private", id: "priv", },
        { name: "Public", id: "pub", },
    ]

    public getByID(categoryID) {
        return this.categories.find(({ id }) => id === categoryID)
    }
}
