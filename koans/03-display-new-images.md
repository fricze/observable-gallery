# Merging Observables
*Merge new images with existing images*
Wow, how far we came! We can use Observables to handle user events, but also to synchronize data processing events. Isn’t it beautiful, when you have API that's simple but powerful enough to be useful in many situations? You may have started to discover that Rx.js is powerful not only because it provides us with Observables and operators but, also, because it give us very nice language to speak about asynchronous events. It has answers for most of your asynchronous problems.

So what do we do now? Let’s think what we have in Photos service? List of photos and Observable with new photos, uploaded by user. That’d be great if we could just merge them. Take one list, take second list, put them together and update every time there are some new photos coming. Sound reasonable? I think it does, so I’ll do it. Follow me, let’s do it together!



… Important: write a bit about how subscribe re-create producers, and why we can, sometimes, want to remove | async pipe in favor of one subscription
