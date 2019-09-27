import { Component } from '@angular/core';
import { CategoriesService } from "../categories.service"
import { Observable } from 'rxjs';

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent {
    constructor(private categoriesService: CategoriesService) {}

    newCategoryName = ""

    categoriesList$ = this.categoriesService.categories$

    onAddNewCategory(name: string) {
        this.categoriesService.newCategory$.next(name)
        this.newCategoryName = ""
    }

    onCategoryClick(categoryID: string) {
        this.categoriesService.activeCategory$.next(categoryID)
    }
}
