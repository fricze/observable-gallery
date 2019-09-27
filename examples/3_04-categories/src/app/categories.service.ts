import { Injectable } from '@angular/core';
import { of, combineLatest, Subject, BehaviorSubject } from "rxjs"
import { scan, map, startWith } from "rxjs/operators"
import flatten from "ramda/es/flatten"
import merge from 'ramda/es/merge';
import uuid from "uuidv4"

const newCategoryFromName = (name: string) => ({ name, id: uuid(), })

const initialCategories = [
    { name: "Landscapes", id: "46004df1-876a-443c-9126-4bee714bed9e", },
    { name: "Wishlist", id: "4cc5e97c-7572-481a-969d-e92b131a2e8d", },
    { name: "Others", id: "b22a7c97-d7da-4fa7-af75-170055a9f825", },
]

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {
    newCategory$: Subject<string> = new Subject()
    activeCategory$ = new BehaviorSubject(initialCategories[0].id)

    private newCategories$ = this.newCategory$.pipe(
        scan((categories, name: string) =>
            categories.concat([newCategoryFromName(name)]), []),
        startWith([]),
    )

    mergeCategories = map(([categories, newCategories, activeCategoryID]) =>
        flatten([categories, newCategories]).map(
            category => merge(category, {
                active: category.id === activeCategoryID
            })
        ))

    categories$ = combineLatest(
        of(initialCategories), this.newCategories$, this.activeCategory$
    ).pipe(this.mergeCategories)
}
