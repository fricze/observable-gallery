# Add categories
Wow! That was a nice ride! What now? Is our gallery finished? Of course not. Once you upload more and more photos you'd probably want to create some categories or tags. If we'd mix dogs memes with memories from our last pizzeria visit, the gallery would make no sense. Let's go and some categories.

First? Maybe some `categories` component?

```
<div class="categories">
    <div *ngFor="let category of categoriesList$ | async"
         [ngClass]="{'category': true, 'category-new': category.new}"
         (click)="setActiveCategory(category.id)">
        {{ category.name }}
    </div>

    <input class="new-category" type="text" placeholder="new&thinsp;+"
           [(ngModel)]="newCategoryName"
           (keyup.enter)="addNewCategory($event.target.value)">
</div>
```

So that's how it is. We've already seen some Observables and events handlers so surely you can read this code and get the general idea. Some looping over Observable with categories. CSS class for new categories. Setting active category once user clicks on it. `ngModel` on our input will help us clear it when new category is created. Let's see `addNewCategory` handler.

```
addNewCategory(name: string) {
    this.categoriesService.newCategory$.next(name)
    this.newCategoryName = ""
}
```

Sometimes I wish it'd be harder… Every time user press enter, send new category name to `categoriesService` and empty `newCategoryName`, so we won't create the same category twice and we have nice UX. Shall we see our categories service?

Not to bore you, but it's almost the same stuff we've done in photos service. List of categories. Stream with new categories. Creating a big snowball out of them… Yep, normal Rx.js stuff. Not a lot to meditate on, maybe just elegance and usefullnes of Observables. But fear not! We have to do a bit more. Since we have categories now, we need to categorize our photos and upload new photos to some categories! Also we're gonna have to filter, or mark, photos we show in our gallery, so user knows to what category each photo belongs.

# Filtering photos 
