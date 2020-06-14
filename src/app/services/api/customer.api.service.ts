import {Injectable} from '@angular/core';
import {ConfigService} from '../../modules/ex-core/services/config.service';
import {CustomerInterface} from '../auth/entities/interfaces/customer.interface';
import {BaseSecureApiService} from './base-secure.api.service';
import {BrandParamsService} from '../../modules/brand/services/brand-params.service';
import {CurrencyService} from '../auth/currency.service';
import {BaseApiService} from '../../modules/api/base.api.service';
import {ErrorObservable} from 'rxjs/observable/ErrorObservable';

@Injectable()
export class CustomerApiService {
    // config variables
    login_type_id: string;
    system_id: string;
    brand_id: string;
    currency_id: string;
    lang_id: string;

    constructor(private baseSecureApiService: BaseSecureApiService,
                private baseApiService: BaseApiService,
                private configService: ConfigService,
                private brandParamsService: BrandParamsService,
                private currencyService: CurrencyService) {
        this.login_type_id = this.configService.getConfig('customer', 'login_type_id');
        this.system_id = this.configService.getConfig('customer', 'system_id');
        this.brand_id = this.brandParamsService.getBrandId();

        this.currencyService.getCurrencyId().subscribe(currency_id => this.currency_id = currency_id);
        this.brandParamsService.getLangId().subscribe(lang_id => this.lang_id = lang_id);
    }

    // Auth
    signup(customer: CustomerInterface) {
        const body = Object.assign(customer, {
            brand_id: this.brand_id,
            system_id: this.system_id,
            login_type_id: this.login_type_id,
            currency_id: this.currency_id,
            lang_id: this.lang_id,
        });

        return this.baseApiService.post('/customers/', body);
    }

    signin(user: CustomerInterface) {
        const body = Object.assign(user, {
            brand_id: this.brand_id,
            system_id: this.system_id,
            login_type_id: this.login_type_id
        });

        return this.baseApiService.post('/auth/login', body);
    }

    logout() {
        return this.baseSecureApiService.post('/auth/logout', JSON.stringify({}));
    }

    passwordResetInit(email: string) {
        const body = Object.assign(email, {brand_id: this.brand_id});

        return this.baseApiService.post('/customers/password-reset-init/', body);
    }

    changeSystemLanguage(langId: string) {
        return this.baseApiService.put('/customers', JSON.stringify({lang_id_current: langId}))
            .catch(error => ErrorObservable.create(error.json()));
    }

    // User
    selfExclusion(endDatetime: string) {
        const body = {end_datetime: endDatetime};
        return this.baseSecureApiService.post('/customers/self-exclusion/', JSON.stringify(body))
            .catch(error => ErrorObservable.create(error.json()));
    }

    getCurrentSession() {
        return this.baseSecureApiService.get('/auth/session')
            .map(customer => customer.user);
    }

    getCurrentCustomer() {
        return this.baseSecureApiService.get('/customers/me')
            .map(customer => customer.user);
    }

    updateCustomer(customer: CustomerInterface) {
        return this.baseSecureApiService.put('/customers', JSON.stringify(customer))
            .map(res => res.user)
            .catch(error => ErrorObservable.create(error.json()));
    }

    passwordUpdate(passwords: any) {
        return this.baseSecureApiService.put('/customers/password-update', JSON.stringify(passwords))
            .catch(error => ErrorObservable.create(error.json()));
    }

    passwordReset(passwords: { 'password_reset_code': string, 'new_password': string }) {
        return this.baseApiService.post('/customers/password-reset', passwords);
    }

    findAddressByPostcode(postcode) {
        return this.baseApiService.get('/customers/address-lookup/' + postcode)
            .map(res => res.addresses);
    }

    getCustomerStats() {
        return this.baseSecureApiService.get('/customers/stats/')
            .map(res => res.stats);
    }

    checkAccountVerification(obj) {
        return this.baseApiService.post('/customers/verify-email/', obj);
    }

    resendAccountVerification() {
        return this.baseApiService.post('/customers/resend-verification-email/', '');
    }
}
