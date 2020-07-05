import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';

@Component({
    selector: 'app-tab1',
    templateUrl: 'tab1.page.html',
    styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
    principal: number;
    rate: number;
    due: number;
    due_fixed: boolean = true;
    freq: string = 'y';
    freq_string: string = "Year";
    resultSheet: Array<object> = [];
    repayments: Array<any> = [];

    cText: string = "Compute Repayments";
    dText: string = "Compute Amount Due";
    errText: string = '';
    err: boolean = false;

    constructor(
        private platform: Platform
    ) {
        this.platform.backButton.subscribe(() => {
            navigator['app'].exitApp();
        });
    }

    changeFreq() {
        if (this.freq === 'y') {
            this.freq_string = "Year";
        }
        else {
            this.freq_string = "Month";
        }
    }

    initRepay() {
        this.errText = '';
        this.err = false;
        this.repayments = [];
        if (this.principal && this.rate) {
            let params = this.repayCompute(this.principal, this.rate, 0);
            this.repayments.push({
                p: this.format(params.p.toFixed(2)),
                i: this.format(params.i.toFixed(2)),
                d: 0
            });
        }
        else {
            this.setError("Please first set values for Principal and Rate");
            this.due_fixed = false;
        }

    }

    addRepay() {
        this.errText = '';
        this.err = false;
        if (this.principal && this.rate && !this.due_fixed) {;
            let c_payment = this.repayments[this.repayments.length - 1];
            c_payment.p = this.strip(c_payment.p);
            c_payment.i = this.strip(c_payment.i);
            if (Number(c_payment.p) > 0 && Number(c_payment.d) > 0) {
                let params = this.repayCompute(c_payment.p, this.rate, c_payment.d);
                this.repayments.push({
                    p: this.format(params.p.toFixed(2)),
                    i: this.format(params.i.toFixed(2)),
                    d: 0
                });
            }
            else {
                if (c_payment.p <= 0) {
                    this.setError("Repayment complete");
                }
                else {
                    this.setError("Please set a value for Amount Paid");
                }
            }
            c_payment.p = this.format(c_payment.p);
            c_payment.i = this.format(c_payment.i);
        }
        else {
            this.setError("Please set a principal and rate before adding any more repayments");
        }
    }

    removeLast() {
        if (this.repayments.length > 1) {
            this.repayments.pop();
        }
    }

    repayCompute(principal: number, rate: number, due: number) {//due is amount user paid for spec duration
        rate = rate / 100;
        let c_bill = principal;
        let interest = 0;
        let c_due = due;
        interest = Number((c_bill * rate).toFixed(2));
        c_bill += interest;
        if (c_bill > c_due) {
            c_bill -= c_due;
        }
        else {
            c_due = c_bill;
            c_bill = 0;
        }
        c_bill = Number(c_bill.toFixed(2));
        return ({
            p: c_bill,
            i: interest
        });
    }

    computeDues() {
        this.err = false;
        this.errText = '';
        this.repayments = [];
        let rate = this.rate;
        let principal = this.principal;
        let due = this.due;

        rate = rate / 100;
        let c_bill = principal;
        let interest = 0;
        let c_due = due;
        while (c_bill > 0) {
            interest = Number((c_bill * rate).toFixed(2));
            c_bill += interest;
            if (c_bill > c_due) {
                c_bill -= c_due;
            }
            else {
                c_due = c_bill;
                c_bill = 0;
            }
            c_bill = Number(c_bill.toFixed(2));
            if (this.repayments.length > 19 && interest >= c_due) {
                this.setError("Out of range. Interest exceeds Amount Paid. This results in an infinite payment system.");
                break;
            }
            else if (this.repayments.length > 99) {
                this.setError("Out of range. Please input the last value for Principal and then recompute");
            }
            else {
                this.repayments.push({
                    p: this.format(c_bill.toFixed(2)),
                    i: this.format(interest.toFixed(2)),
                    d: this.format(c_due.toFixed(2))
                });
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

    strip(num_str: string){
        return (Number(num_str.replace(/,/g, '')));
    }

    setError(txt: string) {
        this.errText = txt;
        this.err = true;
    }

}
