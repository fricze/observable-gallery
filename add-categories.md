# Add categories
Wow! That was a nice ride! What now? Is our gallery finished? Of course not. Once you upload more and more photos you’d probably want to create some categories or tags. If we’d mix dogs memes with memories from our last pizzeria visit, the gallery would make no sense. Let’s go and some categories.

First? Maybe some `categories` component?

```html
<div class="categories">
    <div *ngFor="let category of categoriesList$ | async"
         class="category"
         (click)="setActiveCategory(category.id)">
        {{ category.name }}
    </div>

    <input class="new-category" type="text" placeholder="new&thinsp;+"
           [(ngModel)]="newCategoryName"
           (keyup.enter)="addNewCategory($event.target.value)">
</div>
```

So that’s how it is. We’ve already seen some Observables and events handlers so you probably can read this code and get the general idea what’s happening. Some looping over Observable with categories. CSS class for new categories. Setting active category once user clicks on it. `ngModel` on our input will help us clear it when new category is created. Let’s see `addNewCategory` handler.

```typescript
addNewCategory(name: string) {
    this.categoriesService.newCategory$.next(name)
    this.newCategoryName = ""
}
```

Sometimes I wish it’d be harder… Every time user press enter, send new category name to `categoriesService` and empty `newCategoryName`, so we won’t create the same category twice and we have nice UX. Shall we see our Categories service?

Not to bore you, but it’s almost the same stuff we’ve done in photos service. List of categories. Stream with new categories. Creating a big snowball out of them… Yep, normal Rx.js stuff. Not a lot to meditate on, maybe just elegance and usefullnes of Observables. But fear not! We have to do a bit more. Since we have categories now, we need to categorize our photos and upload new photos to some categories! Also we’re gonna have to filter, or mark, photos we show in our gallery, so user knows to what category each photo belongs. You may check out Categories Service and Categories Component on Stackblitz. Now let’s do something new and filter photos in our Gallery!

# Filtering photos 

In Categories Service, we’ll have some initial categories with names and unique IDs for our photos (you may create your own!)

```
const initialCategories = [
    { name: "Landscapes", id: "46004df1-876a-443c-9126-4bee714bed9e", },
    { name: "Wishlist", id: "4cc5e97c-7572-481a-969d-e92b131a2e8d", },
    { name: "Others", id: "b22a7c97-d7da-4fa7-af75-170055a9f825", },
]
```

In Photos Service, we have to add `categoryID` field to our photos and put there proper IDs. This way we can easily group photos by category.
