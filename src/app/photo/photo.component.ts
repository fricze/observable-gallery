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
                debounceTime(1000),
                switchMap(() =>
                    merge(
                        of({ text: "autosave…", saving: true }),
                        of({ text: "", saving: false }).pipe(
                            delay(400),
                        )
                    )
                ),
            );

        source.subscribe(this.savingDescription);
    }

    constructor() { }

    ngOnInit() { }
}
