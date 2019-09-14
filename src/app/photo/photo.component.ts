import { Input, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { merge, of, BehaviorSubject, fromEvent } from 'rxjs';
import {
    skip, distinctUntilChanged, map, mapTo, debounceTime,
    delay, switchMap, startWith
} from 'rxjs/operators';

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
    @ViewChild("photoDescription", { static: false })
    photoDescription: ElementRef;

    @Input() photo: { description: string; };

    savingDescription = new BehaviorSubject(descriptionState.still);

    ngAfterViewInit() {
        const descriptionElement = this.photoDescription.nativeElement
        const input$ = fromEvent(descriptionElement, 'input')
            .pipe(debounceTime(1400))

        const enter$ = fromEvent(descriptionElement, 'focus')
        const leave$ = fromEvent(descriptionElement, 'blur').pipe(
            startWith(this.photo.description),
            map(() => this.photo.description),
            distinctUntilChanged(),
            skip(1),
        )

        const source = merge(
            enter$.pipe(
                mapTo(input$),
            ),
            leave$.pipe(
                mapTo(of(true))
            )
        ).pipe(
            switchMap(obs => obs),
            switchMap(() => merge(
                of(descriptionState.saving),
                of(descriptionState.still).pipe(
                    delay(600),
                )
            )),
        );

        source.subscribe(this.savingDescription);
    }
}
