import {
    Input, AfterViewInit, Component,
    ElementRef, ViewChild
} from '@angular/core';
import { merge, of, fromEvent, Observable } from 'rxjs';
import {
    withLatestFrom, distinctUntilChanged, map, mapTo, debounceTime,
    delay, switchMap, switchAll,
} from 'rxjs/operators';

type DescriptionState = { saving: boolean; }

const descriptionState: { [k: string]: DescriptionState; } = {
    saving: { saving: true },
    still: { saving: false },
}

const getSavingState$ = () => merge(
    of(descriptionState.saving),
    of(descriptionState.still).pipe(
        delay(600),
    )
)

@Component({
    selector: 'app-photo',
    templateUrl: './photo.component.html',
    styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements AfterViewInit {
    @ViewChild("photoDescription", { static: false })
    photoDescription: ElementRef;

    @Input() photo: { description: string; };

    savingDescription$: Observable<DescriptionState>;

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
