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

First thing we’re gonna do with our images is taking their contents out and saving in browser-friendly format. That’s what happens when we create constant `imagesContent`. We take array of images and map it to array of images content. Because reading file content may take long it is asynchronous. Therefore function `readFileContent` returns Promise. It opens file, reads it into format browser understands and resolves Promise once file is read.

Oh my gosh! What now! So far, we’ve been dealing with Observables and now we have Array of Promises! What do we do?!

Stay calm and come closer… I’m gonna tell you a little secret. Rx.js already got your back. It is smart enough to recognize that in some situations there’s no visible difference between Observable and Promise. Both are objects that hold reference to value that will come sometime in future. Promise resolves only once, Observable can resolve many times, but, as I said, sometimes it’s not that much of a difference.

Now, we’re gonna use Rx.js function `forkJoin` to create `uploadedImages$`. It’ll take our Array of Promises, wait till all of them resolve, then put all resolved values into one Array and pass it down to Observable. It really is smart! Let’s recap, once again, what it does for us. 1. We feed it with Array of Promises (objects that will have some value in future). 2. It waits for all Promises to resolve. 3. It collects data from all Promises, puts data in Array and returns Observable that holds this Array. Quite similar to JavaScript native `Promise.all`, but returns Observable, so we can use all Rx.js operators and functions on it!

And what should happen when we read all images? Easy! Take list of sources and merge it with list of images. When data is ready, send it to Photos service via newPhotos$ Subject.
