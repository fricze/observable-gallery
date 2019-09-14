import { Input, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { merge, of, BehaviorSubject, fromEvent } from 'rxjs';
import { debounceTime, delay, switchMap } from 'rxjs/operators';

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
        const source = fromEvent(this.photoDescription.nativeElement, 'input')
            .pipe(
                debounceTime(1400),
                switchMap(() =>
                    merge(
                        of({ text: "", saving: true }),
                        of({ text: "", saving: false }).pipe(
                            delay(600),
                        )
                    )
                ),
            );

        source.subscribe(this.savingDescription);
    }

    constructor() { }

    ngOnInit() { }
}
