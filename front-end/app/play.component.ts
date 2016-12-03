/**
 * Created by mp_ng on 12/3/2016.
 */
import { Component } from '@angular/core';

declare let $: any;

@Component({
    moduleId: module.id,
    selector: 'play',
    styleUrls: ['./play.component.css'],
    templateUrl: './play.component.html'
})
export class PlayComponent {
    ngAfterViewInit() {
        let deadline = new Date(Date.now());
        deadline.setSeconds(deadline.getSeconds() + 10);

        $('#clock').countdown(deadline.toLocaleString())
            .on('update.countdown', function(event:any) {
                var format = '%S';
                // if(event.offset.totalDays > 0) {
                //     format = '%-d day%!d ' + format;
                // }
                // if(event.offset.weeks > 0) {
                //     format = '%-w week%!w ' + format;
                // }
                $(this).html(event.strftime(format));
            })
            .on('finish.countdown', function(event: any) {
                $(this).html('Time up')
                    .parent().addClass('disabled');

            });
    }
}