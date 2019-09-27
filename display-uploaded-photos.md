# Merging Observables
Wow, how far we've come! We can use Observables to handle user events, but also to synchronize data processing events. Isn’t it beautiful? You have API that's concise but powerful enough to be useful in many situations? You may have started discovering that Rx.js is powerful not only because it provides us with Observables and many operators but, also, because it give us very nice language to speak about asynchronous events. It has answers for most of your asynchronous problems.

So what do we do now? Let’s think what we have in Photos service? List of photos and Observable with new photos, uploaded by user. That’d be great if we could just merge them. Take one list, take second list, put them together and update every time there are new photos coming. Sound reasonable? I think it does, so I’ll do it. You can follow me and we'll do it together!

First, let's create a new Observable. It'll be the one that merges existing photos with new ones. We'll use `combineLatest` function. It does what it says – takes latest value from each Observable it's given and combine them together. `combineLatest` produces new value every time once of its arguments produces a value. Then all values combine into an array and passed to next Observable. 

```typescript
photos$ = combineLatest(
    of(this.photos),
    this.allNewPhotos$,
)
```

Function `of` takes one argument and return Observable that will produce this argument as its value. It makes it easier for us to combine existing photos wih new ones. If we deal with Observables everywhere it's simple to combine them, without much thinking.

Because `newPhotos$` changes every time user uploads some photo, we have to accumulate all uploads into one array. We'll do it in `allNewPhotos$` Observable, with operator `scan`.

```typescript
allNewPhotos$ = this.newPhotos$.pipe(
     scan((allPhotos, newPhotos) => allPhotos.concat(newPhotos), []),
     startWith([]),
)
```

`scan` takes every value you give it and accumulates them into one aggregate value. 

Meaning… what, when, why? Ok. You see `scan` think: huge, huge snowball. Everytime you add little snowball to it, it gets bigger, but it's the same, huge snowball. So `scan` takes many little snowballs as inputs and produces huge one as output. Our particular `scan`, instead of snow, takes lots of photos uploaded over time, and concatenates them into one, huge list of uploaded photos. There's also `startWith` to make sure that our `allNewPhotos$` Observable has starting value before `scan` produces anything.

One last thing! We've combined existing photos with new photos. We've accumulated photos uploaded over time into one, huge list of all uploaded photos. But we have to tell our new `photos$` Observable how to exactly combine those two. It goes like this:

```typescript
photos$ = combineLatest(
     of(this.photos),
     this.allNewPhotos$,
).pipe(
     map(([photos, uploadedPhotos]) => flatten([photos, uploadedPhotos])),
)
```

After `combineLatest` produces new array with existing and uploaded photos, let's take these two arrays, put them into one and flatten. That way we're getting one array with all photos. If you'd like to make this code a bit shorter, you could do something like:

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

Take all arrays that are sent here and flatten them all into one. So elegant!

And what do we have to do, to display these new photos on our photos list? Just one real change in our Gallery component.

First we change photosList to `photosList$`:

```typescript
photosList$: Observable<Photo[]> = this.photosService.photos$;
```

and we make sure that HTML knows our list is now Observable

```html
<div *ngFor="let photo of photosList$ | async" class="photo">…
```

Great! We're uploading photos to gallery, displaying all of them and opening active photo still works, like it did. Although, if you've tried to click on newly uploaded photos, you've probably noticed, they don't zoom properly.

## Control your subscriptions

<!-- It's so nice, it'd be a crime not to add some more features! -->


