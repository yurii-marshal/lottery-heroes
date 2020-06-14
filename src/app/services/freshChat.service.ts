import {Injectable} from '@angular/core';
import {WindowService} from './device/window.service';

@Injectable()
export class FreshChatService {
  constructor(private windowService: WindowService) {
  }

  initFreshChat() {
    this.windowService.nativeWindow.fcWidget.init(
      {
        token: 'efc38d9b-768c-4a55-9afe-43bd94611ff1', // C. Velcheva
        // token: '004b5c58-0765-4d12-9bb8-3fe9b9109b4e', // Y. Marshall
        // token: 'lOqewOvFuo19BesPq0UD', // Niv
        host: 'https://wchat.freshchat.com'
      }
    );
  }

  createFreshChatUser(data) {
    this.windowService.nativeWindow.fcWidget.user.create({
      firstName: data['first_name'],
      lastName: data['last_name'],
      email: data['email'],
      'plan': 'Estate',
      'status': 'Active'
    })
      .then(function () {
      console.log('User Created');
    }, function () {
      console.log('User Not Created');
    });
  }

  updateFreshChatUser() {
    this.windowService.nativeWindow.fcWidget.user.update({
      firstName: 'John',
      lastName: 'Doe',
      email: 'name@company.com',
      meta: {
        userproperty1: 'value',
        userproperty2: 'value',
        userproperty3: 'value'
      }
    }).then(function (response) {
      console.log(response);
    });
  }

  restoreFreshChatUser() {
    const restoreId = 'id'; // Which need to be fetched from your DB
    this.windowService.nativeWindow.fcWidget.init({
      token: '8d3a4a04-5562-4f59-8f66-f84a269897a1',
      host: 'https://wchat.freshchat.com',
      externalId: '1234567',
      restoreId: restoreId ? restoreId : null
    });
    this.windowService.nativeWindow.fcWidget.user.get((resp) => {
      const status = resp && resp.status,
        data = resp && resp.data;
      if (status !== 200) {
        this.windowService.nativeWindow.fcWidget.user.setProperties({
          firstName: 'John',              // user's first name
          lastName: 'Doe',                // user's last name
          email: 'john.doe@gmail.com',    // user's email address
          phone: '8668323090',            // phone number without country code
          phoneCountryCode: '+1',         // phone's country code
          plan: 'Estate',                 // user's meta property 1
          status: 'Active',               // user's meta property 2
          'Last Payment': '12th August'   // user's meta property 3
        });
        this.windowService.nativeWindow.fcWidget.on('user:created', (resp1) => {
          const status1 = resp1 && resp1.status,
            data1 = resp1 && resp1.data;
          if (status1 === 200) {
            if (data1.restoreId) {
              // Update restoreId in your database
            }
          }
        });
      }
    });
  }

  loginFreshChatUser() {

  }

  setFreshChatCredentials(data, options?) {
    // this.winRef.nativeWindow.fcWidget.user.setProperties({
    //     first_name: data ? data['first_name'] : null,
    //     last_name: data ? data['last_name'] : null,
    //     email: data ? data['email'] : null
    // });
    // console.log(data);
    this.windowService.nativeWindow.fcWidget.setExternalId(data['cid']);
    this.windowService.nativeWindow.fcWidget.user.setProperties({
      firstName: data['first_name'],
      lastName: data['last_name'],
      email: data['email'],
      'plan': 'Estate',
      'status': 'Active'
    }).then((res) => {
      // console.log(res);
      // this.windowService.nativeWindow.fcWidget.user.get().then((resp) => {
      //   console.log(resp);
      // }, (err) => {
      //   console.log(err['status']);
      //   if (err.status === 401) {
      //     this.createFreshChatUser(data);
      //   }
      // });
    }, (err) => {
      console.log(err);
    });
    // this.winRef.nativeWindow.fcWidget.user.setFirstName(data['first_name']);

    // To set user email
    // this.winRef.nativeWindow.fcWidget.user.setEmail(data['email']);

    // To set user properties
    // this.winRef.nativeWindow.fcWidget.user.setProperties({
    //   plan: 'Estate',                 // meta property 1
    //   status: 'Active'                // meta property 2
    // });
    // this.windowService.nativeWindow.fcWidget.user.create({
    //   firstName: data['first_name'],
    //   lastName: data['last_name'],
    //   email: data['email']
    // }).then((response) => {
    //   console.log('FreshChat user logged in');
    //   this.windowService.nativeWindow.fcWidget.user.get().then(function (result) {
    //     console.log('Get freshchat user: ', result);
    //   });
    // }, (error) => {
    //   console.log(error);
    //   if (error['status'] === 403) {
    //     this.logoutFreshChatUser(() => {
    //       this.setFreshChatCredentials(data);
    //     });
    //   }
    // });
  }

  logoutFreshChatUser(callback?) {
    this.windowService.nativeWindow.fcWidget.user.clear().then(() => {
      console.log('FreshChat user logout');
      if (callback) {
        callback();
      }
    }, () => {
      console.log('Error: FreshChat user not cleared');
    });
  }

}
