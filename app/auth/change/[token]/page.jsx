"use client";
import { api, alert_msg, get_session, print } from '@/public/script/public';
import Loader from '@/app/component/loader';
import { useSelector } from 'react-redux';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Change ({ params }) {

    const config = useSelector((state) => state.config);
    const router = useRouter();
    const input = useRef();
    const [data, setData] = useState({recovery_token: params.token});
    const [loader, setLoader] = useState(true);
    const [auth, setAuth] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);

    const submit = async(e) => {

        e.preventDefault();
        if ( data.password !== data.password1 ) return alert_msg(config.text.not_matched, 'error');
        setLoader(true);
        const response = await api('auth/change', data);

        if ( response.status === true ) {
            setSuccess(true);
            setLoader(false);
            alert_msg(config.text.password_successfully);
        }
        else {
            setLoader(false);
            setData({...data, password: '', password1: ''});
            alert_msg(config.text.alert_error, 'error');
        }

    }
    const check_token = async() => {

        const response = await api('auth/token', data);
        if ( response.status === true ) setLoader(false);
        else { setLoader(false); setError(true); }

    }
    useEffect(() => {

        if ( get_session('user')?.token && get_session('user')?.logged ) return router.replace('/');
        else setAuth(false);

        document.title = config.text.change_password;
        setTimeout(_ => input.current?.focus(), 100);
        check_token();

    }, []);

    return (

        <div className="flex items-center justify-center bg-cover bg-center" style={{ height: '40rem' }}>
            {
                !auth &&
                <div className="panel w-full max-w-[420px] sm:w-[480px] no-select overflow-hidden">
                    {
                        success ?
                        <div className='w-full'>

                            <h2 className="mb-2 text-xl font-bold">{config.text.successfully}</h2>

                            <p className="mb-7">{config.text.password_successfully}</p>

                            <form className="space-y-7 mb-3" onSubmit={submit}>

                                <div className='flex py-4 text-center'>
                                    <div className="w-full">
                                        <span className='material-symbols-outlined icon text-success flex' style={{ fontSize: '6rem' }}>check_circle</span>
                                    </div>
                                </div>

                                <Link href="/auth/login" className="btn btn-primary w-full h-[2.8rem]">{config.text.back_login}</Link>

                            </form>

                        </div> : error ?
                        <div className='w-full'>

                            <h2 className="mb-2 text-xl font-bold">{config.text.error}</h2>

                            <p className="mb-7">{config.text.invalid_token}</p>

                            <form className="space-y-7 mb-3" onSubmit={submit}>

                                <div className='flex py-4 text-center'>
                                    <div className="w-full">
                                        <span className='material-symbols-outlined icon text-danger flex' style={{ fontSize: '6rem' }}>error</span>
                                    </div>
                                </div>

                                <Link href="/auth/login" className="btn btn-primary w-full h-[2.8rem]">{config.text.back_login}</Link>

                            </form>

                        </div> :
                        <div className='w-full'>

                            <h2 className="mb-2 text-xl font-bold">{config.text.change_password}</h2>

                            <p className="mb-7">{config.text.enter_to_change}</p>

                            <form className="space-y-5 mb-3" onSubmit={submit}>

                                <div>
                                    <label htmlFor="password" className='mb-3'>{config.text.password}</label>
                                    <input id="password" type="password" ref={input} value={data.password || ''} onChange={(e) => setData({...data, password: e.target.value})} required className="form-input" autoComplete='off'/>
                                </div>

                                <div className='pb-3'>
                                    <label htmlFor="password1" className='mb-3'>{config.text.repeat_password}</label>
                                    <input id="password1" type="password" value={data.password1 || ''} onChange={(e) => setData({...data, password1: e.target.value})} required className="form-input" autoComplete='off'/>
                                </div>

                                <button type="submit" className="btn btn-primary w-full h-[2.8rem] text-[.95rem]">{config.text.submit}</button>

                            </form>

                        </div>
                    }
                    { loader && <Loader /> }
                </div>
            }
        </div>

    );

};
