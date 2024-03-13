"use client";
import { api, alert_msg, get_session, print } from '@/public/script/public';
import Loader from '@/app/component/loader';
import { useSelector } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Recovery () {

    const config = useSelector((state) => state.config);
    const router = useRouter();
    const input = useRef();
    const [data, setData] = useState({});
    const [loader, setLoader] = useState(false);
    const [auth, setAuth] = useState(true);
    const [success, setSuccess] = useState(false);

    const submit = async(e) => {

        e.preventDefault();
        setLoader(true);
        const response = await api('auth/recovery', data);
        setLoader(false);

        if ( response.status === true ) {
            setSuccess(true);
            alert_msg(config.text.recovery_done);
        }
        else if ( response.status === 'exists' ) {
            alert_msg(config.text.error_email, 'error');
        }
        else {
            alert_msg(config.text.alert_error, 'error');
        }

    }
    useEffect(() => {

        if ( get_session('user')?.token && get_session('user')?.logged ) return router.replace('/');
        else setAuth(false);

        document.title = config.text.recovery_account;
        setTimeout(_ => input.current?.focus(), 100);

    }, []);

    return (

        <div className="flex items-center justify-center bg-cover bg-center" style={{ height: '40rem' }}>
            {
                !auth &&
                <div className="panel w-full max-w-[420px] sm:w-[480px] no-select overflow-hidden">
                    {
                        success ?
                        <div className='w-full'>

                            <h2 className="mb-2 text-xl font-bold">{config.text.recovery_account}</h2>

                            <p className="mb-8">
                                {config.text.message_sent}
                                <Link className='underline hover:text-primary px-1' href="https://mail.google.com/mail/u/0/#inbox" target='_blank'>{config.text.mail}</Link>
                            </p>

                            <form className="space-y-9 mb-3" onSubmit={submit}>

                                <div className='flex flex-column py-5 px-2 bg-[rgba(0,0,0,.2)]'>
                                    <label htmlFor="email" className='mb-3 text-center'>{config.text.not_received}</label>
                                    <button type="submit" className="text-[.95rem] text-primary hover:underline">{config.text.resend}</button>
                                </div>

                                <Link href="/auth/login" className="btn btn-primary w-full h-[2.8rem]">{config.text.back_login}</Link>

                            </form>

                        </div> :
                        <div className='w-full'>

                            <h2 className="mb-2 text-xl font-bold">{config.text.recovery_account}</h2>

                            <p className="mb-7">
                                {config.text.enter_to_recovery}
                            </p>

                            <form className="space-y-6" onSubmit={submit}>

                                <div>
                                    <label htmlFor="email" className='mb-3'>{config.text.email}</label>
                                    <input id="email" type="email" ref={input} value={data.email || ''} onChange={(e) => setData({...data, email: e.target.value})} required className="form-input" autoComplete='off'/>
                                </div>

                                <button type="submit" className="btn btn-primary w-full h-[2.8rem] text-[.95rem]">{config.text.submit}</button>

                            </form>

                            <div className="relative my-6 mb-4 h-5 text-center before:absolute before:inset-0 before:m-auto before:h-[1px] before:w-full before:bg-[#ebedf2] dark:before:bg-[#253b5c]">
                                
                                <div className="relative z-[1] inline-block bg-white px-2 font-bold text-white-dark dark:bg-black">
                                    <span>{config.text.or}</span>
                                </div>

                            </div>

                            <p className="text-left my-2 rtl:text-right">
                                {config.text.back_to}
                                <Link href="/auth/login" className="text-primary hover:underline ltr:ml-2 rtl:mr-2">{config.text.login}</Link>
                            </p>

                            <p className="text-left my-2 rtl:text-right">
                                {config.text.no_account}
                                <Link href="/auth/register" className="text-primary hover:underline ltr:ml-2 rtl:mr-2">{config.text.sign_up}</Link>
                            </p>

                        </div>
                    }
                    { loader && <Loader /> }
                </div>
            }
        </div>

    );

};
