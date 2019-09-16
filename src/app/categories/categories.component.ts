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

    addNewCategory(name) {
        this.categoriesService.newCategory$.next(name)
        this.newCategoryName = ""
    }

    ngOnInit() {
        this.categoriesList$ = this.categoriesService.categories$
    }

    setActiveCategory(categoryID) {
        this.categoriesService.setActiveCategoryByID(categoryID)
    }
}
