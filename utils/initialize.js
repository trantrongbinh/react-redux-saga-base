import Router from 'next/router';
import { reRecLoginAuth } from '../modules/auth/actions';
import { getCookie } from './cookie';

export default function(ctx) {

    if (ctx.isServer) {
        if (ctx.req.headers.cookie) {
        const cookie = (ctx.req.headers.cookie.split(';').find(c => c.trim().startsWith('token=')));
        if (cookie) {
            const token = cookie.split('=')[1]
            ctx.store.dispatch(reRecLoginAuth(token));
        }

        return null;
    }
  } else {
    const token = ctx.store.getState().auth.isAuthenticated;

    if (token && (ctx.pathname === '/auth/login' || ctx.pathname === '/auth/register')) {
            setTimeout(function() {
                Router.push('/');
            }, 0);
        }
    }
}
