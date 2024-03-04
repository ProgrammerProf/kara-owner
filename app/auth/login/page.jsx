"use client";
import { api, alert_msg, set_session, date, get_session, print } from '@/public/script/public';
import Loader from '@/app/component/loader';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Login () {

    const router = useRouter();
    const pathname = usePathname();
    const [data, setData] = useState({});
    const [loader, setLoader] = useState(false);
    const [auth, setAuth] = useState(true);

    const submit = async(e) => {

        e.preventDefault();
        setLoader(true);
        const response = await api('auth/login', data);

        if ( response.user ) {
            set_session('user', {...response.user, active: true, update: date()});
            if ( pathname === '/' ) router.replace('/account');
            else router.replace('/');
            alert_msg('You have been logged in successfully');
        }
        else {
            setLoader(false);
            alert_msg('Error, invalid login information !', 'error');
        }

    }
    useEffect(() => {

        if ( get_session('user')?.id && get_session('user')?.active ) return router.replace('/');
        else if ( get_session('user')?.id ) return router.replace('/auth/lock');
        else setAuth(false);

        document.title = "Log In";

    }, []);

    return (

        <div className="flex items-center justify-center bg-[url('/media/public/map.svg')] bg-cover bg-center dark:bg-[url('/media/public/map-dark.svg')]" style={{ height: '41rem' }}>
            {
                !auth &&
                <div className="panel w-full max-w-[420px] sm:w-[480px] no-select overflow-hidden">

                    <h2 className="mb-2 text-2xl font-bold">Log In</h2>

                    <p className="mb-7">Enter your email and password to login</p>

                    <form className="space-y-6" onSubmit={submit}>

                        <div>
                            <label htmlFor="email" className='mb-3'>E-mail</label>
                            <input id="email" type="email" value={data.email || ''} onChange={(e) => setData({...data, email: e.target.value})} required className="form-input" autoComplete='off'/>
                        </div>
                            
                        <div>
                            <label htmlFor="password" className='mb-3'>Password</label>
                            <input id="password" type="password" value={data.password || ''} onChange={(e) => setData({...data, password: e.target.value})} required className="form-input" autoComplete='off'/>
                        </div>

                        <div className='py-1'>
                            <label className="cursor-pointer flex">
                                <input type="checkbox" className="form-checkbox" required checked={data.agree || false} onChange={(e) => setData({...data, agree: !data.agree})}/>
                                <span className="text-white-dark px-2 pt-[.5px]">
                                    I agree the Terms and Conditions
                                </span>
                            </label>
                        </div>

                        <button type="submit" className="btn btn-primary w-full h-[2.8rem] text-[.95rem]">Login</button>

                    </form>

                    <div className="relative my-7 mb-4 h-5 text-center before:absolute before:inset-0 before:m-auto before:h-[1px] before:w-full before:bg-[#ebedf2] dark:before:bg-[#253b5c]">
                        
                        <div className="relative z-[1] inline-block bg-white px-2 font-bold text-white-dark dark:bg-black">
                            <span>OR</span>
                        </div>

                    </div>

                    <p className="text-left my-2">
                        Fortgot your password ?
                        <Link href="tel:+201099188572" className="text-primary hover:underline ltr:ml-2 rtl:mr-2">Call Us</Link>
                    </p>

                    { loader && <Loader /> }

                </div>
            }
        </div>

    );

};
