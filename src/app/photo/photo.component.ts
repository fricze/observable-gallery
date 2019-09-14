import { Input, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { merge, of, BehaviorSubject, fromEvent } from 'rxjs';
import { mapTo, debounceTime, delay, switchMap } from 'rxjs/operators';

@Component({
    selector: 'app-photo',
    templateUrl: './photo.component.html',
    styleUrls: ['./photo.component.scss']
})
export class PhotoComponent implements OnInit, AfterViewInit {
    @ViewChild("photoDescription", { static: false })
    photoDescription: ElementRef;

    @Input() photo: {};

    savingDescription = new BehaviorSubject({ text: "" });

    ngAfterViewInit() {
        const input$ = fromEvent(this.photoDescription.nativeElement, 'input')
            .pipe(
                debounceTime(1400),
            )

        const enter$ = fromEvent(this.photoDescription.nativeElement, 'focus')
        const leave$ = fromEvent(this.photoDescription.nativeElement, 'blur')

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
                of({ text: "", saving: true }),
                of({ text: "", saving: false }).pipe(
                    delay(600),
                )
            )),
        );

        source.subscribe(this.savingDescription);
    }

    constructor() { }

    ngOnInit() { }
}
