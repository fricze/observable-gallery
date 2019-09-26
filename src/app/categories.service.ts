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

const initialCategories = [
    { name: "Private", id: "46004df1-876a-443c-9126-4bee714bed9e", },
    { name: "Public", id: "4cc5e97c-7572-481a-969d-e92b131a2e8d", },
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

    categories$ = combineLatest(
        of(initialCategories), this.newCategories$
    ).pipe(
        map((collection: Array<Array<Category>>) => flatten(collection)),
    )
}
