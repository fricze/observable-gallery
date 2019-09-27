Hi there! If you’re reading this I know you’ve already built some web applications and it went pretty well! You know how to store and display data. You know how to react to user events and communicate with servers. Even styling your applications gets easier every time you do it!

Today we’ll dig deeper into managing user and server interaction. With Rx.js you’ll take control of time in your application. You’ll create `Observables` to easily merge, filter, and synchronize events happening in your application. Let’s go!


# Photo gallery
We’re starting with simple photo gallery. To create it we need one service and two components. [WIP]

# First Observable!
Our photo gallery looks great, but all photos are so small. Users will want to see bigger pictures. Let’s help them do so! When users click on photo we’ll create a nice overlay over our gallery and show the whole photo.

To do it we have to track which photo is currently active. How do we do it? Of course, with help of Rx.js! It provides us with `BehaviorSubject` – object that holds value changing over time. Once we’ve had created BehaviorSubject that stores ID of active photo, we can display it easily.

```
noPhotoID = ""
activePhotoID$ = new BehaviorSubject(this.noPhotoID)
```

As you see, BehaviorSubject constructor takes one argument – initial value. When we start to subscribe to activePhoto$ it will give us this value and, later, every next that comes to it. Our first value is empty string, since there’s no active photo when application starts.

Let’s now go to our gallery and change value of activePhotoID$ every time user clicks on photo.

```
<img (click)="onPhotoClick(photo.id)" [src]="photo.url">
```

We already know what’s going on here. Once user clicks on photo, we’re going to call the `onPhotoClick` method with one argument: photo.id. How do we implement `onPhotoClick` to make sure it sends value to activePhotoID$? We can do so like this:

```
onPhotoClick(photoID: string) {
    this.photosService.activePhotoID$.next(photoID)
}
```

Just refer the `activePhotoID$` and call `next` on it! Great! You’ve just connected user event with `Observable`. Now you can subscribe to it and display active photo.

# Creating new value from Observable
To display active photo let’s create a new component called (you guessed it) `active-photo`. It will access a photo that is currently active and display it.

But, you probably thinking now, in our photos service, we only store the ID of the photo. Our component needs entire Photo object! Let’s take our `activePhotoID$` and create new Observable out of it.

```
activePhoto$: Observable<Photo> = this.activePhotoID$.pipe(
    map(photoID => this.photos.find(({ id }) => id === photoID))
)
```

Only three lines of code and we’re done! Let’s break down what happens in activePhoto$.

First: we’re accessing current active photo ID. Second: we’re using `pipe` method to transform it into something new. That’s what `pipe` does. It takes value from Observable and pipes it through Rx.js operators that create new Observables. Our first `pipe` takes photo ID and maps it to Photo object.

Let’s break this process down even further. Let’s extract a method that takes photo ID and returns Photo. It looks like this:

```
findPhotoByID = (photoID: string) =>
this.photos.find(({ id }) => id === photoID)
```

We’re just finding one photo in array. Now, move it back to our `activePhoto$` Observable.

```
activePhoto$: Observable<Photo> = this.activePhotoID$.pipe(
    map(this.findPhotoByID)
)
```

Take active photo ID, pipe it through `map` operator and return new Observable that finds photo based on ID.

Go on and use `activePhoto$` Observable to display photo that user wanted to see!

# Display active photo!
It gets more and more interesting! You created `BehaviorSubject` that keeps value changing over time. You’ve used it to create new Observable! Now you get to display data from it. It surely requires a lot of work, or does it…? Let’s look at the code.

```
activePhoto$: Observable<Photo> = this.photosService.activePhoto$;
```

```
<img [src]="(activePhoto$ | async)?.url">
```

And we have it with a couple lines of code! You assign `activePhoto$` from Photos service to Component field, so we can access `activePhoto$` value in HTML. Because we access asynchronous value that changes over time we use `async` pipe. Now Angular knows it should subscribe to asynchronous value and use new value every time it changes. Last part `?.url` means: check if `activePhoto$` holds a value, if it does access `url` field from it and display in HTML. Whew! We did it!

## Hide active photo
Last thing to do is hiding photo… [WIP]

