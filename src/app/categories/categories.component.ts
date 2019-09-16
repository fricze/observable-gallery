import { Component, OnInit } from '@angular/core';
import { CategoriesService } from "../categories.service"
import { Subject } from "rxjs"

@Component({
    selector: 'app-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
    categoriesList: { name: string; }[];

    newCategory = new Subject()

    constructor(private categoriesService: CategoriesService) {
        this.newCategory.subscribe(a => console.log(a))
    }

    ngOnInit() {
        this.categoriesList = this.categoriesService.categories
    }

    setActiveCategory(categoryID) {
        this.categoriesService.setActiveCategoryByID(categoryID)
    }
}
