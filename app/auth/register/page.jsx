"use client";
import { api, alert_msg, set_session, get_session, date, print } from '@/public/script/public';
import Loader from '@/app/component/loader';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function Register () {

    const config = useSelector((state) => state.config);
    const router = useRouter();
    const pathname = usePathname();
    const [data, setData] = useState({});
    const [loader, setLoader] = useState(false);
    const [auth, setAuth] = useState(true);

    const submit = async(e) => {

        e.preventDefault();
        if ( data.password !== data.password1 ) return alert_msg(config.text.not_matched, 'error');

        setLoader(true);
        const response = await api('auth/register', data);

        if ( response.user ) {
            set_session('user', {...response.user, logged: true, update: date()});
            if ( pathname === '/' ) router.replace('/account');
            else router.replace('/');
            alert_msg(config.text.register_successfully);
        }
        else if ( response.status === 'exists' ) {
            setLoader(false);
            alert_msg(config.text.email_exists, 'error');
        }
        else {
            setLoader(false);
            alert_msg(config.text.alert_error, 'error');
        }

    }
    useEffect(() => {

        if ( get_session('user')?.token && get_session('user')?.logged ) return router.replace('/');
        else if ( get_session('user')?.token ) return router.replace('/auth/lock');
        else setAuth(false);
        document.title = config.text.sign_up;

    }, []);

    return (

        <div className="flex items-center justify-center bg-cover bg-center" style={{ height: '40rem' }}>
            {
                !auth &&
                <div className="panel w-full sm:w-[480px] no-select overflow-hidden">

                    <h2 className="mb-2 text-2xl font-bold">{config.text.sign_up}</h2>

                    <p className="mb-7">{config.text.enter_to_register}</p>

                    <form className="space-y-5" onSubmit={submit}>

                        <div className='flex justify-between items-center'>

                            <div className='w-[48%]'>
                                <label htmlFor="name">{config.text.name}</label>
                                <input id="name" type="text" value={data.name || ''} onChange={(e) => setData({...data, name: e.target.value})} required className="form-input" autoComplete='off'/>
                            </div>

                            <div className='w-[48%]'>
                                <label htmlFor="email">{config.text.email}</label>
                                <input id="email" type="email" value={data.email || ''} onChange={(e) => setData({...data, email: e.target.value})} required className="form-input" autoComplete='off'/>
                            </div>
                            
                        </div>

                        <div>
                            <label htmlFor="password">{config.text.password}</label>
                            <input id="password" type="password" value={data.password || ''} onChange={(e) => setData({...data, password: e.target.value})} required className="form-input" autoComplete='off'/>
                        </div>

                        <div>
                            <label htmlFor="password1">{config.text.repeat_password}</label>
                            <input id="password1" type="password" value={data.password1 || ''} onChange={(e) => setData({...data, password1: e.target.value})} required className="form-input" autoComplete='off'/>
                        </div>

                        <div className='py-2'>
                            <label className="cursor-pointer flex">
                                <input type="checkbox" className="form-checkbox" required checked={data.agree || false} onChange={(e) => setData({...data, agree: !data.agree})}/>
                                <span className="text-white-dark px-2 pt-[.5px]">
                                    {config.text.agree_terms}
                                </span>
                            </label>
                        </div>

                        <button type="submit" className="btn btn-primary w-full h-[2.8rem] text-[.95rem]">
                            {config.text.sign_up}
                        </button>

                    </form>

                    <div className="relative my-7 mb-4 h-5 text-center before:absolute before:inset-0 before:m-auto before:h-[1px] before:w-full before:bg-[#ebedf2] dark:before:bg-[#253b5c]">
                        
                        <div className="relative z-[1] inline-block bg-white px-2 font-bold text-white-dark dark:bg-black">
                            <span>{config.text.or}</span>
                        </div>

                    </div>

                    <p className="text-left my-2 rtl:text-right">
                        {config.text.have_account}
                        <Link href="/auth/login" className="text-primary hover:underline ltr:ml-2 rtl:mr-2">{config.text.login}</Link>
                    </p>

                    { loader && <Loader /> }

                </div>
            }
        </div>

    );

};
