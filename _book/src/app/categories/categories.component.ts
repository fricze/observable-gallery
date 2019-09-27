import { Component } from '@angular/core';
import { CategoriesService } from "../categories.service"
import { Observable } from 'rxjs';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent {
    newCategoryName = ""

    categoriesList$: Observable<{ name: string; }[]> =
        this.categoriesService.categories$

    constructor(private categoriesService: CategoriesService) {}

    addNewCategory(name: string) {
        this.categoriesService.newCategory$.next(name)
        this.newCategoryName = ""
    }

    setActiveCategory(categoryID: string) {
        this.categoriesService.activeCategory$.next(categoryID)
    }
}
