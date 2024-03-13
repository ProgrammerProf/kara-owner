"use client";
import { toggle_dir, toggle_theme, toggle_lang, toggle_menu, toggle_layout, toggle_animation, toggle_nav, toggle_semidark, toggle_side, toggle_user, toggle_text } from '@/public/script/store';
import { api, date, get_session, print } from '@/public/script/public';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { usePathname, useRouter } from 'next/navigation';
import Header from './header';
import Sidebar from './sidebar';
import Setting from './setting';
import Loader from './loader';
import Login from "@/app/auth/login/page";
import Lockscreen from "@/app/auth/lock/page";
import Error from "@/app/not-found";

export default function DefaultLayout ({ children }) {

    const dispatch = useDispatch();
    const pathname = usePathname();
    const router = useRouter();
    const config = useSelector((state) => state.config);
    const [loader, setLoader] = useState(true);
    const [animation, setAnimation] = useState(config.animation);
    const [started, setStarted] = useState(false);
    const [auth, setAuth] = useState(false);
    const [active, setActive] = useState(false);

    const active_user = async() => {
        
        if ( !get_session('user')?.token ) return;
        const response = await api('auth/user', {token: get_session('user')?.token});
        if ( response.user?.token ) dispatch(toggle_user({...response.user, logged: get_session('user')?.logged || false, update: date()}));
        else dispatch(toggle_user({}));

    }
    const access_url = () => {

        let access = 
        (pathname === '/chat' && !config.user.chat) ||
        (pathname === '/properties/add' && !config.user.add_products) ||
        (pathname === '/bookings/add' && !config.user.add_bookings) ||
        (pathname.includes('/properties') && !config.user.see_products) ||
        (pathname.includes('/bookings') && !config.user.see_bookings) ||
        (pathname.includes('/coupons') && !config.user.see_coupons) ||
        (pathname.includes('/reports') && !config.user.reports) ? false : true;

        return access

    }
    const active_link = () => {

        document.querySelectorAll('.sidebar ul a, ul.horizontal-menu a, ul.horizontal-menu .nav-link').forEach(_ => _.classList.remove('active'));
        document.querySelector(`.sidebar ul a[href='${pathname}']`)?.classList.add('active');
        document.querySelector(`ul.horizontal-menu a[href='${pathname}']`)?.classList.add('active');
        document.querySelector(`ul.horizontal-menu a[href='${pathname}']`)?.closest('li.menu')?.querySelectorAll('.nav-link')[0]?.classList.add('active');
        document.querySelector(`.sidebar ul a[href='${pathname}']`)?.closest('li.menu')?.querySelectorAll('.nav-link')[0]?.classList.add('active');

    }
    useEffect(() => {

        setTimeout(() => { setLoader(false); active_link(); }, 500);
        dispatch(toggle_user(get_session('user')));
        if ( started ) { setAnimation(false); setTimeout(_ => setAnimation(config.animation)); }
        else setStarted(true);

        if (window.innerWidth < 1024 && config.side) dispatch(toggle_side());
        if ( !get_session('user')?.token && !['/auth/login', '/auth/register', '/auth/recovery'].includes(pathname) && !(pathname.includes('/auth/change/') && pathname.split('/').length === 4) ) return router.replace('/auth/login');
        if ( get_session('user')?.token && !get_session('user')?.logged && !['/auth/lock', '/auth/recovery'].includes(pathname) && !(pathname.includes('/auth/change/') && pathname.split('/').length === 4) ) return router.replace('/auth/lock');
        active_user();

    }, [pathname]);
    useEffect(() => {

        setAuth(get_session('user')?.token ? true : false);
        setActive((get_session('user')?.token && get_session('user')?.logged) ? true : false);
        dispatch(toggle_user(get_session('user')));

    }, [config.user.update]);
    useEffect(() => {

        dispatch(toggle_theme(localStorage.getItem('theme') || config.theme));
        dispatch(toggle_menu(localStorage.getItem('menu') || config.menu));
        dispatch(toggle_layout(localStorage.getItem('layout') || config.layout));
        dispatch(toggle_dir(localStorage.getItem('dir') || config.dir));
        dispatch(toggle_animation(localStorage.getItem('animation') || config.animation));
        dispatch(toggle_nav(localStorage.getItem('nav') || config.navbar));
        dispatch(toggle_semidark(localStorage.getItem('semidark') || config.semidark));
        dispatch(toggle_lang(localStorage.getItem('lang') || config.lang));
        setAnimation(config.animation);
        active_link();

    }, [dispatch, config.theme, config.menu, config.layout, config.dir, config.animation, config.nav, config.lang, config.semidark]);

    return (

        <div className={`${(config.side && 'toggle-sidebar') || ''} ${config.menu} ${active ? config.layout : 'full'} ${config.dir} main-section relative font-nunito text-sm font-normal antialiased`}>
            {
                active ?
                <div className="relative">

                    { loader && <Loader fixed bg/> }
                    
                    <Setting />

                    <div className={`${config.nav} main-container min-h-screen text-black dark:text-white-dark`}>

                        <Sidebar />

                        <div className="main-content">

                            <Header auth/>

                            {
                                animation &&
                                <div className={`${animation} animate__animated ${config.menu === 'horizontal' ? config.layout === 'full' ? 'p-6' : 'p-6 lg:px-0' : 'p-6'}`}>
                                    { access_url() ? children : <Error /> }
                                </div>
                            }
                            
                        </div>

                    </div>

                </div> :
                <div className="relative">

                    { loader && <Loader fixed bg/> }

                    <Setting />

                    <div className={`${config.nav} main-container min-h-screen text-black dark:text-white-dark`}>

                        <div className="main-content">

                            <Header />

                            {
                                loader ? '' : auth ?
                                <div className={`${animation} animate__animated px-6`}>

                                    { pathname === '/auth/recovery' || (pathname.includes('/auth/change/') && pathname.split('/').length === 4) ? children : <Lockscreen/> }

                                </div> :
                                <div className={`${animation} animate__animated px-6`}>

                                    { pathname === '/auth/register' || pathname === '/auth/recovery' || (pathname.includes('/auth/change/') && pathname.split('/').length === 4) ? children : <Login/> }

                                </div>
                            }
                            
                        </div>

                    </div>

                </div>
            }
        </div>

    );

};
