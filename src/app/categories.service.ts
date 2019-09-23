import { Injectable } from '@angular/core';
import { of, combineLatest, Subject, BehaviorSubject } from "rxjs"
import { scan, map, startWith } from "rxjs/operators"
import { flatten } from "ramda"

type Category = {
    name: string;
    id: string;
    new?: boolean;
}

const newCategoryFromName = (name: string) => ({ name, id: name, new: true })

@Injectable({
    providedIn: 'root'
})
export class CategoriesService {
    private initialCategories = [
        { name: "Private", id: "priv", },
        { name: "Public", id: "pub", },
    ]

    newCategory$: Subject<string> = new Subject()
    activeCategory$ = new BehaviorSubject(this.initialCategories[0].id)

    private newCategories$ = this.newCategory$.pipe(
        scan((categories, name: string) =>
            categories.concat([newCategoryFromName(name)]), []),
        startWith([]),
    )

    categories$ = combineLatest(of(this.initialCategories), this.newCategories$).pipe(
        map((collection: Array<Array<Category>>) => flatten(collection)),
    )
}
