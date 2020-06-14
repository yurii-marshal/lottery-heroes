import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { Actions } from '@ngrx/effects';
import { Observable } from 'rxjs/Observable';
import { empty } from 'rxjs/observable/empty';
import { hot } from 'jasmine-marbles';

import { RouterEffects } from './router.effects';
import { RouterBackAction, RouterForwardAction, RouterGoAction } from '../actions/router.actions';

export class TestActions extends Actions {
  constructor() {
    super(empty());
  }

  set stream(source: Observable<any>) {
    this.source = source;
  }
}

export function getActions() {
  return new TestActions();
}

describe('RouterEffects', () => {
  let actions: TestActions;
  let router: jasmine.SpyObj<Router>;
  let location: jasmine.SpyObj<Location>;
  let effects: RouterEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: Actions,
          useFactory: getActions
        },
        {
          provide: Router,
          useValue: jasmine.createSpyObj<Router>('Router', ['navigate']),
        },
        {
          provide: Location,
          useValue: jasmine.createSpyObj<Location>('Location', ['back', 'forward']),
        },
        RouterEffects,
      ],
    });

    actions = TestBed.get(Actions);
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    effects = TestBed.get(RouterEffects);
  });

  describe('navigate$', () => {
    it('should navigate to url', () => {
      const payload = {
        path: ['/heroes', {id: 1, foo: 'foo'}],
        queryParams: {'session_id': 'something'}
      };
      const action = new RouterGoAction(payload);

      actions.stream = hot('-a', {a: action});

      effects.navigate$.subscribe(() => {
        expect(router.navigate).toHaveBeenCalledWith(
          ['/heroes', {id: 1, foo: 'foo'}],
          {queryParams: {session_id: 'something'}}
        );
      });
    });
  });

  describe('navigateBack$', () => {
    it('should navigate back', () => {
      const action = new RouterBackAction();

      actions.stream = hot('-a', {a: action});

      effects.navigateBack$.subscribe(() => {
        expect(location.back).toHaveBeenCalled();
      });
    });
  });

  describe('navigateForward$', () => {
    it('should navigate forward', () => {
      const action = new RouterForwardAction();

      actions.stream = hot('-a', {a: action});

      effects.navigateForward$.subscribe(() => {
        expect(location.forward).toHaveBeenCalled();
      });
    });
  });
});
