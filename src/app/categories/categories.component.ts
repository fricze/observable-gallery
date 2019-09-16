import { Component, OnInit } from '@angular/core';
import { CategoriesService } from "../categories.service"
import { Observable } from 'rxjs';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
    categoriesList$: Observable<{ name: string; }[]>;

    newCategoryName = ""

    constructor(private categoriesService: CategoriesService) {}

    addNewCategory(name: string) {
        this.categoriesService.newCategory$.next(name)
        this.newCategoryName = ""
    }

    ngOnInit() {
        this.categoriesList$ = this.categoriesService.getCategories$()

        this.categoriesService.categories$.subscribe(a => console.log(a))
        this.categoriesService.newCategory$.subscribe(a => console.log(a))
        this.categoriesList$.subscribe(a => console.log(a))
    }

    setActiveCategory(categoryID: string) {
        this.categoriesService.setActiveCategoryByID(categoryID)
    }
}
