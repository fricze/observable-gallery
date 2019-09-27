# Merging Observables
Wow, how far we came! We can use Observables to handle user events, but also to synchronize data processing events. Isn’t it beautiful? You have API that’s concise but powerful enough to be useful in many situations? You may have started discovering that Rx.js is powerful not only because it provides us with Observables and many operators but, also, because it give us very nice language to speak about asynchronous events. It has answers for most of your asynchronous problems.

So what do we do now? Let’s think what we have in Photos service? List of photos and Observable with new photos, uploaded by user. That’d be great if we could just merge them. Take one list, take second list, put them together and update every time there are new photos coming. Sound reasonable? I think it does, so I’ll do it. You can follow me and we’ll do it together!

First, let’s create new Observable. It’ll be the one that merges existing photos with new ones. We’ll use `combineLatest` function. It does what it says – takes latest value from each Observable it’s given and combine them together. `combineLatest` produces new value everytime once of it’s arguments produces a value. Then all values are combined into array and passed to next Observable. 

```typescript
photos$ = combineLatest(
    of(this.photos),
    this.allNewPhotos$,
)
```

Function `of` takes one argument and returns Observable that will produce this argument as its value. It makes it easier for us to combine existing photos wih new ones. If we deal with Observables everywhere we can combine them really straightforward.

Because `newPhotos$` changes everytime user uploads some photo, we have to accumulate all uploads into one array. We’ll do it in `allNewPhotos$` Observable, with operator `scan`.

```typescript
allNewPhotos$ = this.newPhotos$.pipe(
     scan((allPhotos, newPhotos) => allPhotos.concat(newPhotos), []),
     startWith([]),
)
```

`scan` tells us: I’m gonna take every value you give me and accumulate into one, aggregate value. Meaning… what, when, why? Ok. You see `scan` think: huge, huge snowball. Everytime you add little snowball to it, it gets bigger, but it’s the same, huge snowball. So `scan` takes many little snowballs as inputs and produces huge one as output. Our particular `scan`, instead of snow, takes lots of photos uploaded over time, and concatenates them into one, huge list of uploaded photos. There’s also `startWith` to make sure that our `allNewPhotos$` Observable has starting value before `scan` produces anything.

Last one thing! We’ve already combined existing photos with new photos. Then we’ve accumulated photos uploaded over time into one, huge list of all uploaded photos. But we have to tell our new `photos$` Observable how to exactly combine those two. It goes like this:

```typescript
photos$ = combineLatest(
     of(this.photos),
     this.allNewPhotos$,
).pipe(
     map(([photos, uploadedPhotos]) => flatten([photos, uploadedPhotos])),
)
```

After `combineLatest` produces new array with existing and uploaded photos, let’s take these two arrays, put them into one and flatten. That way we’re getting one array with all photos. If you’d like to make this code a bit shorter, you could do something like:

```typescript
photos$ = combineLatest(
     of(this.photos),
     this.allNewPhotos$,
).pipe(
     map((collection: Array<Array<Photo>>) => flatten(collection)),
)
```

or even, a one liner:


```typescript
photos$ = combineLatest(of(this.photos), this.allNewPhotos$).pipe(map(flatten))
```

Take all arrays that are sent from two Observables and flatten them all into one. I have to say, it's quite elegant!

And what do we have to do, to display these new photos on our photos list? Just two little changes in our Gallery component.

First we change photosList to `photosList$`:

```typescript
photosList$: Observable<Photo[]> = this.photosService.photos$;
```

and we make sure that HTML knows our list is now Observable

```html
<div *ngFor="let photo of photosList$ | async" class="photo">…
```

Great! We’re uploading photos to gallery, displaying all of them and opening active photo still works, like it did. Altough, if you’ve tried to click on newly uploaded photos, you’ve probably noticed, they do not zoom properly.

## Control your subscriptions

Why does it happen? Let's have a look at `active-photo.component.html`. 

```html
<div
    *ngIf="(activePhoto$ | async)"
    class="active-photo"
    (click)="hidePhoto()"
>
    <img [src]="(activePhoto$ | async)?.url">
</div>

```

We're using `async` pipe twice in our template. What `async` pipe does is: it creates Subscription and displays data in HTML. Subscription is an object that listens to Observable changes. So in the template we have one data source `activePhoto$`, but two listeners: `… | async`. It's a mess. We want to have one Subscription for one data source. Otherwise data in our Component is desynchronized.

Ok then. How can we minimze amount of Subscriptions? We'll go into `ActivePhotoComponent` and create one Subscription there. This Subscription will feed data to our template, so template will always get proper data.

```typescript
photo: Photo
photoSubscription = this.photosService.activePhoto$.subscribe(photo => {
    this.photo = photo
})
```

Not a lot of code, reads quite straightforward. Subscribe to Observable and each time it produces a value, assign this value to private Component property `photo`. Now, we can forget about `async` in our template, since from template point of view, `photo` property is now static.

```html
<div
    *ngIf="photo"
    class="active-photo"
    (click)="hidePhoto()"
>
    <img [src]="photo.url">
</div>
```

## Cleaning after yourself
Everything should work nicely by now. But beacause we've started to create our own Subscriptions we have to remember to clean them, when Component is destroyed. Otherwise Subscription will go on forever and bloat application memory. Let's use `ngOnDestroy` for that. Access `photoSubscription` and tell it, that it should stop listening for any changes. Your work here is done `photoSubscription`, you may now rest peacefully.

```
ngOnDestroy() {
    this.photoSubscription.unsubscribe()
}
```

<!-- It’s so nice, it’d be a crime not to add some more features! -->


