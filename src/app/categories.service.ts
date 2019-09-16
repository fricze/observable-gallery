import { Injectable } from '@angular/core';
import { BehaviorSubject } from "rxjs"

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {
    categories = [
        { name: "Private", id: "priv", },
        { name: "Public", id: "pub", },
    ]

    activeCategory = new BehaviorSubject(this.categories[0].id)

    public getByID(categoryID) {
        return this.categories.find(({ id }) => id === categoryID)
    }

    public getActiveCategory() {
        return this.activeCategory
    }

    public setActiveCategoryByID(categoryID) {
        this.activeCategory.next(categoryID)
    }
}
