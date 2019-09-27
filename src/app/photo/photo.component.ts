import {
    Input, AfterViewInit, Component,
    ElementRef, ViewChild
} from '@angular/core';
import { merge, of, fromEvent, Observable } from 'rxjs';
import {
    withLatestFrom, distinctUntilChanged, map, mapTo, debounceTime,
    delay, switchMap, switchAll,
} from 'rxjs/operators';
import { PhotosService } from "../photos.service"

const descriptionState = {
    saving: { saving: true },
    still: { saving: false },
}

@Component({
    selector: 'app-photo',
    templateUrl: './photo.component.html',
    styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements AfterViewInit {
    constructor(private photosService: PhotosService, ) { }

    @Input() photo: { description: string; };
    @ViewChild("photoDescription", { static: false })
    photoDescription: ElementRef;
    savingDescription$: Observable<any>;

    onPhotoClick(photoID: string) {
        this.photosService.activePhotoID$.next(photoID)
    }

    ngAfterViewInit() {
        const descriptionElement = this.photoDescription.nativeElement
        const input$ = fromEvent(descriptionElement, 'input')

        const inputSampled$ = input$.pipe(debounceTime(1400))

        const photoDescription$ = fromEvent(descriptionElement, 'input')
            .pipe(
                map((event: Event) => (<HTMLInputElement>event.target).value)
            )

        const enter$ = fromEvent(descriptionElement, 'focus')
        const leave$ = fromEvent(descriptionElement, 'blur').pipe(
            withLatestFrom(photoDescription$),
            map(([, description]) => description),
            distinctUntilChanged(),
        )

        const getSavingState$ = () => merge(
            of(descriptionState.saving),
            of(descriptionState.still).pipe(
                delay(600),
            )
        )

        this.savingDescription$ = merge(
            enter$.pipe(
                mapTo(inputSampled$),
            ),
            leave$.pipe(
                mapTo(of(true))
            )
        ).pipe(
            switchAll(),
            switchMap(getSavingState$),
        );
    }
}
