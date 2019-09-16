import { Component, OnInit } from '@angular/core';
import { CategoriesService } from "../categories.service"

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
    categoriesList: { name: string; }[];

    constructor(private categoriesService: CategoriesService) {
        this.categoriesList = this.categoriesService.categories
    }

    ngOnInit() {
    }

    setActiveCategory(categoryID) {
        this.categoriesService.setActiveCategoryByID(categoryID)
    }
}
