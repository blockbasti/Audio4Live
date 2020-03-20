import { trigger, transition, style, query, animateChild, animate, group } from '@angular/animations';

export const slideInAnimation =
    trigger('routeAnimations', [
        transition((fromState, toState) => {
            const pages = ['LandingPage', 'BuchenPage', 'LeistungenPage', 'ProfilPage', 'ReferenzenPage'];
            return pages.indexOf(fromState) > pages.indexOf(toState);
        }, [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%'
                })
            ]),
            query(':enter', [
                style({ left: '-100%' })
            ]),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':leave', [
                    animate('300ms .15s ease-out', style({ left: '100%' }))
                ], { optional: true }),
                query(':enter', [
                    animate('300ms .15s ease-out', style({ left: '0%' }))
                ])
            ]),
            query(':enter', animateChild()),
        ]),
        transition((fromState, toState) => {
            const pages = ['LandingPage', 'BuchenPage', 'LeistungenPage', 'ProfilPage', 'ReferenzenPage'];
            return pages.indexOf(fromState) < pages.indexOf(toState);
        }, [
            style({ position: 'relative' }),
            query(':enter, :leave', [
                style({
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '100%'
                })
            ]),
            query(':enter', [
                style({ right: '-100%' })
            ]),
            query(':leave', animateChild(), { optional: true }),
            group([
                query(':leave', [
                    animate('300ms .15s ease-out', style({ right: '100%' }))
                ], { optional: true }),
                query(':enter', [
                    animate('300ms .15s ease-out', style({ right: '0%' }))
                ])
            ]),
            query(':enter', animateChild()),
        ])
    ]);
