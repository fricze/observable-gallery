Hi there! If you’re reading this I know you’ve already built some web applications and it went pretty well! You know how to store and display data. You know how to react to user events and communicate with servers. Event styling your applications gets easier every time you do it!

That’s great! Today we’ll dig deeper into managing user and server interaction. With Rx.js you’ll take control of time in your application. You’ll create Observables to easily merge, filter and synchronize events happening in your application. Let’s go!


# Photo gallery
We’re starting with simple photo gallery. To create it we need one service and two components. [WIP]

# First Observable!
Our photo gallery looks great, but all photos are so small. Users would, probably, like to see them closer. Let’s help them! When users click on photo we’ll create nice overlay over our gallery and show whole photo.

To do it we have to track which photo is currently active. How to do it? Of course, with help of Rx.js! It provides us with BehaviorSubject – object that holds value changing over time. Once we’ve had created BehaviorSubject that stores ID of active photo, we can display it easily.

```
		noPhotoID = ""
    activePhotoID$ = new BehaviorSubject(this.noPhotoID)
```

As you see, BehaviorSubject constructor takes one argument – initial value. When we start to subscribe to activePhoto$ it will give us this value and, later, every next that comes to it. Our first value is empty string, since there’s no active photo when application starts.

Let’s now go to our gallery and change value of activePhotoID$ every time user clicks on photo.

```
	<img (click)="onPhotoClick(photo.id)" [src]="photo.url">
```

We already know what’s going on here. Once user clicks on photo, we’re gonna call method onPhotoClick, with one argument: photo.id. How to implement onPhotoClick to make sure it sends value to activePhotoID$. Easy:

```
    onPhotoClick(photoID: string) {
        this.photosService.activePhotoID$.next(photoID)
    }
```

Just refer activePhotoID$ and call `next` on it! Great! You’ve just connected user event with Observable. Now you can subscribe to it and display active photo.

# Creating new value from Observable
To display active photo let’s create new component called (you guessed it) `active-photo`. It will access photo that is currently active and display it.

But, you probably thinking now, in our photos service, we store only ID of the photo. Our component needs whole Photo object! Okay then, I hear you. Let’s take our `activePhotoID$` and create new Observable out of it.

```
    activePhoto$: Observable<Photo> = this.activePhotoID$.pipe(
        map(photoID => this.photos.find(({ id }) => id === photoID))
    )
```

Only three lines of code and we’re done! Let’s break down what happens in activePhoto$.

First: we’re accessing current active photo ID. Second: we’re using `pipe` method to transform it into something new. That’s what `pipe` does. Takes value from Observable and pipes it through Rx.js operators that create new Observables. Our first `pipe` takes photo ID and maps it to Photo object.

Let’s break this process down even further! Let’s extract a method that takes photo ID and returns Photo. It looks like this:

```
    findPhotoByID = (photoID: string) => this.photos.find(({ id }) => id === photoID)
```

So simple! We’re just finding one photo in array. Now, move it back to our `activePhoto$` Observable.

```
    activePhoto$: Observable<Photo> = this.activePhotoID$.pipe(
        map(this.findPhotoByID)
    )
```

See how elegant? Take active photo ID, pipe it through `map` operator and return new Observable that finds photo based on ID.

Go on and use `activePhoto$` Observable to display photo that user wanted to see!

# Display active photo!
Huh! It gets more and more interesting! You created `BehaviorSubject` that keeps value changing over time. You’ve used it to create new Observable! Now you get to display data from it. It surely requires a lot of work, or does it…? Let’s look at the code.

```
    activePhoto$: Observable<Photo> = this.photosService.activePhoto$;
```

```
    <img [src]="(activePhoto$ | async)?.url">
```

And we have it! First line is dead simple. You assign `activePhoto$` from Photos service to Component field, so we can access `activePhoto$` value in HTML. Because we access asynchronous value that changes over time we use `async` pipe. Now Angular knows it should subscribe to asynchronous value and use new value every time it changes. Last part `?.url` means exactly: check if `activePhoto$` holds a value, if it does access `url` field from it and display in HTML. Whew! Sometimes life is easy, innit?

## Hide active photo
Last thing to do is hiding photo… [WIP]

# Observables and Promises. Upload some photos
That’s nice to see some interaction in your application. You display a bunch a thumbnails, you can click on them to see whole photo, and click again to hide photo. And we’ve only created one BehaviorSubject and, basing on it, one Observable. Did you notice how easy it is to keep track of active photo? No need to remove old value, nor clean data. You just put next value on Subject and it becomes the current value. Data flows one way. Send some event to Subject – react to it, send next event – react to it. That’s Rx.js bread and butter.

Next thing that’d be nice to have in photo gallery is photo upload. First thing: we create a new component. Let your imagination run wild! If it uploads photos, let’s call it: photo-upload! This one is gonna be fun! Here we’ll use Rx.js to process stream of incoming photos, pass it to photos service and display in our gallery.

## Photo upload
We want to take some data from user. So… we should use HTML input! You probably used it for text input before, but it also has file version. How does it look? Roughly, like this:

```
<input type="file"
       multiple="multiple"
       id="file"
       [(ngModel)]="filesCollection"
       accept="image/png, image/jpg, image/jpeg"
       (change)="handleFileInput($event.target.files)">
```

Type `file` indicates that our element will gather files. `multiple="multiple"` means it accepts many files at once. `[(ngModel)]="filesCollection”` allows us to control value of input from Angular. `accept="image/png, image/jpg, image/jpeg"` limits types of files we accept. `(change)="handleFileInput($event.target.files)"` means, as you’ve already deduced, that every time new files come to your input, you’ll handle them using `handleFileInput` method. HTML is ready, let’s proceed to our Component logic.

## Handle new files
Do you think you’re ready to add new photos to your gallery? Because I think you are. Let’s see how to implement `handleFileInput` and break it down, piece by piece:

```
		handleFileInput(images: File[]) {
        const imagesCollection = Array.from(images)
        const imagesContent: <Promise<FileContent>> =
            imagesCollection.map(file => readFileContent(file))

        const uploadedImages$ = forkJoin(imagesContent).pipe(
            map(imagesSources => {
                const imagesWithSource = imagesCollection.map(
                    (image, idx) => ({
                        name: image.name,
                        id: uuid(),
                        url: imagesSources[idx]
                    })
                )

                return imagesWithSource
            }),
        )

        uploadedImages$.subscribe(
            photos => this.photosService.newPhotos$.next(photos)
        )
    }
```

For starters we create constant `imagesCollection`. File input returns value of type `FileList`. `FileList` doesn’t have familiar methods like `map` or `forEach` so it has to be transformed into Array. From now on we can use all familiar methods on it.

First thing we’re gonna do with our images is taking their contents out and saving in browser-friendly format. That’s what happens when we create constant `imagesContent`. We take array of images and map it to array of images content. Because reading file content may take long it is asynchronous. Therefore function `readFileContent` returns Promise. It opens file, reads it into format browser understadns and resolves Promise once it ready.

Oh my gosh! What now! We’ve been dealing with Observables so far and now we have Array of Promises! What do we do?!

Now… I’m gonna tell you a little secret. Rx.js already got your back. It is smart enough to recognize that in some situations there’s no big difference between Observable and Promise. Both are objects that hold reference to value that will come… sometime. While Promise resolves only once, Observable can resolve many times. But, as I said, sometimes it’s not that much of a difference.

So, we’re gonna use Rx.js function `forkJoin` to create `uploadedImages$`. It’ll take our Array of Promises, wait till all of them resolve, then put all resolved values into one Array and pass it down to Observable. It’s really smart! Let’s recap, once again, what it does for us. 1. We feed it with Array of Promises (objects that will have some value in future). 2. It waits for all Promises to resolve. 3. It collects data from all Promises, puts data in Array and returns Observable that holds this Array. Quite similar to JavaScript native `Promise.all`, but returns Observable, so we can use all Rx.js operators and functions on it!

And what should happen when we read all images? Easy! Take list of sources and merge it with list of images. When

# Merging Observables
Merge new images with existing images

# Add categories
Wow! That was a nice ride! 