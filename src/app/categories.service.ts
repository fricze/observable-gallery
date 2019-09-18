import { Injectable } from '@angular/core';
import { combineLatest, Subject, BehaviorSubject } from "rxjs"
import { scan, map, startWith } from "rxjs/operators"
import { flatten } from "ramda"

type Category = {
    name: string;
    id: string;
}

const newCategoryFromName = (name: string) => ({ name, id: name, local: true })

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {
    private initialCategories = [
        { name: "Private", id: "priv", },
        { name: "Public", id: "pub", },
    ]

    categories$ = new BehaviorSubject(this.initialCategories)

    newCategory$: Subject<string> = new Subject()

    activeCategory = new BehaviorSubject(this.initialCategories[0].id)

    private newCategories$ = this.newCategory$.pipe(
        scan((categories, name: string) =>
            categories.concat([newCategoryFromName(name)]), []),
        startWith([]),
    )

    public getCategories$() {
        return combineLatest(this.categories$, this.newCategories$).pipe(
            map((collection: Array<{}>) => flatten(collection)),
        )
    }

    public getActiveCategory() {
        return this.activeCategory
    }

    public setActiveCategoryByID(categoryID: string) {
        this.activeCategory.next(categoryID)
    }
}
