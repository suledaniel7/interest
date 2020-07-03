import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
    selector: 'app-tab2',
    templateUrl: 'tab2.page.html',
    styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
    principal: number;
    rate: number;
    duration: number;
    freq: string = 'y';
    freq_string: string = "Year";
    resultSheet: Array<object> = [];

    final_interest: string = "0.00";
    final_total: string = "0.00";

    cText: string = "Compute Interest";
    errText: string = '';
    err: boolean = false;

    constructor(
        private platform: Platform
    ) {
        this.platform.backButton.subscribe(() => {
            navigator['app'].exitApp();
        });
    }

    compute() {
        this.err = false;
        this.errText = '';
        this.resultSheet = [];
        this.freq_string = this.freq === 'y' ? "Year" : "Month";

        if (this.principal && this.rate && this.duration) {
            if (isNaN(this.principal)) {
                this.setError("Value provided for Principal is not a valid number");
            }
            else if (isNaN(this.rate)) {
                this.setError("Value provided for Rate is not a valid number");
            }
            else if (isNaN(this.duration)) {
                this.setError("Value provided for Duration is not a valid number");
            }
            else if (this.principal !== Math.abs(this.principal) || this.rate !== Math.abs(this.rate) || this.duration !== Math.abs(this.duration)) {
                this.setError("Negative values are not valid");
            }
            else {
                this.cText = "Computing Interest...";
                let rate = this.rate / 100;
                let final_val = this.principal;
                let interest = this.principal * rate * this.duration;
                final_val += interest;

                this.final_interest = this.format(interest.toFixed(2));
                this.final_total = this.format(final_val.toFixed(2));
                this.cText = "Compute Interest";
            }
        }
    }

    format(number_str: string) {
        number_str = String(number_str);
        let trailing_index = number_str.indexOf('.');
        let trailing = '.00';
        if (trailing_index > -1) {
            trailing = number_str.slice(trailing_index);
            number_str = number_str.slice(0, trailing_index);
        }

        let indices = [];
        let lt = number_str.length;
        let fin_str = '';
        if (lt > 3) {
            let end = false;
            let e_index = lt;
            while (!end) {
                let tmp_str = number_str.slice(0, e_index);
                let tmp_index = this.mini_format(tmp_str);
                indices.push(tmp_index);
                let fin_str = tmp_str.slice(0, tmp_index);
                if (fin_str.length > 3) {
                    e_index = tmp_index;
                }
                else {
                    end = true;
                }
            }
        }

        indices.reverse();
        let start_index = 0;
        for (let i = 0; i <= indices.length; i++) {
            fin_str += number_str.slice(start_index, indices[i]);
            start_index = indices[i];
            if (i !== indices.length) {
                fin_str += ',';
            }
        }

        return fin_str += trailing;
    }

    mini_format(num_str: string) {
        let m_lt = num_str.length;
        return m_lt - 3;
    }

    setError(txt: string) {
        this.errText = txt;
        this.err = true;
    }
}
