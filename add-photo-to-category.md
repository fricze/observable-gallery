# Add uploaded photos to active category

Hi! Great to see you in last chapter of our tutorial! If you have kept up with me you now have photos gallery with bunch of photos and categories and you can upload your own photos to it! Sweet.

Altough… in last chapter we created categories, we filtered our photos by categories they belong but we didn’t say anyone to which categories newly uploaded photos should go! Let’s fix it quickly before someone notices!

Let’s say we want every new photo to go to currently active category. To do it we will tweak Photos Service just a little bit, using operator we have seen before: `withLatestFrom`. Currently Observable with uploaded photos looks like this:

```typescript
private allNewPhotos$ = this.newPhotos$.pipe(
    scan((allNewPhotos, newPhotos) => allNewPhotos.concat(newPhotos), []),
    startWith([]),
)
```

We want to combine it with `activeCategory$` from Categories Service and make sure each, new uploaded, photo gets property `categoryID` with ID of currently active category. First, let’s see how `allNewPhotos$` should look.

```typescript
private allNewPhotos$ = this.newPhotos$.pipe(
    withLatestFrom(this.categoriesService.activeCategory$),
    map(this.setCategoryID),
    scan((allNewPhotos, newPhotos) => allNewPhotos.concat(newPhotos), []),
    startWith([]),
)
```

We’re adding two things here. Using `withLatestFrom` we’re accessing value of `activeCategory$`. Later we’re using ID from, aformentioned, Observable to associate it with newly uploaded photos. Implementation of `setCategoryID` looks like this:

```typescript
setCategoryID = ([newPhotos, categoryID]): Photo[] =>
    newPhotos.map(photo => assoc("categoryID", categoryID, photo))
```

This method takes uploaded photos and categoryID and writes `categoryID` to every photo that is currently being uploaded. Have a go! Try to upload photos, change categories and make sure everything works like we want it.

{% hint style="success" %}
[See the results on StackBlitz](https://stackblitz.com/github/jonki/observable-gallery/tree/master/examples/3_05-add-photo-to-category/)
{% endhint %}
