import { Injectable } from '@angular/core';
import { combineLatest, Subject, BehaviorSubject } from "rxjs"
import { scan, map, startWith } from "rxjs/operators"

type Category = {
    name: string;
    id: string;
}

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

    activeCategory = new BehaviorSubject("priv")

    private newCategories$ = this.newCategory$.pipe(
        scan((a, c: Category) => a.concat([{ name: c, id: c }]), []),
    )

    public getCategories$() {
        return combineLatest(this.categories$, this.newCategories$).pipe(
            map(([categories, newCategories]) => categories.concat(newCategories)),
            startWith(this.initialCategories),
        )
    }

    public getActiveCategory() {
        return this.activeCategory
    }

    public setActiveCategoryByID(categoryID: string) {
        this.activeCategory.next(categoryID)
    }
}
