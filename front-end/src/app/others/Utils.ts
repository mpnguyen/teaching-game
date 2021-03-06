/**
 * Created by mpnguyen on 05/01/2017.
 */
declare let $: any;
export class Utils {
    public static ShowSuccess(msg: string = ''): void {
        var snackbar = $('#snackbar-success');
        if (snackbar.hasClass('show')) {
            return;
        }
        snackbar.addClass('show');
        snackbar.text(msg);
        setTimeout(() => snackbar.removeClass('show'), 2800);
    }

    public static ShowError(msg: string): void {
        var snackbar = $('#snackbar-error');
        if (snackbar.hasClass('show')) {
            return;
        }
        snackbar.addClass('show');
        snackbar.text(msg);
        setTimeout(() => snackbar.removeClass('show'), 2800);
    }

    public static ShowInfo(msg: string = ''): void {
        var snackbar = $('#snackbar-info');
        if (snackbar.hasClass('show')) {
            return;
        }
        snackbar.addClass('show');
        snackbar.text(msg);
        setTimeout(() => snackbar.removeClass('show'), 2800);
    }
}
