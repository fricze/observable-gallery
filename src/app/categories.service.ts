import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from "rxjs"
// import { map } from "rxjs/operators"

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {
    categories$ = new BehaviorSubject([
        { name: "Private", id: "priv", },
        { name: "Public", id: "pub", },
    ])

    newCategory$ = new Subject()

    activeCategory = new BehaviorSubject("priv")

    // public getByID(categoryID) {
    //     return this.categories$.pipe(
    //         map(categories => categories.find(({ id }) => id === categoryID))
    //     )
    // }

    public getActiveCategory() {
        return this.activeCategory
    }

    public setActiveCategoryByID(categoryID) {
        this.activeCategory.next(categoryID)
    }
}
