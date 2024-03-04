"use client";
import { api, alert_msg, capitalize, print } from '@/public/script/public';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Loader from '@/app/component/loader';

export default function Settings () {

    const config = useSelector((state) => state.config);
    const [tab, setTab] = useState(0);
    const [data, setData] = useState({});
    const [payments, setPayments] = useState([{}, {}]);
    const [loader, setLoader] = useState(false);
    const [loader1, setLoader1] = useState(false);
    const [loader2, setLoader2] = useState(false);
    const [loader3, setLoader3] = useState(false);

    const get_data = async() => {

        const response = await api('setting', {user: config.user.id});

        setData(response.settings || {});
        setPayments(response.payments || [{}, {}]);

    }
    const save_data = async() => {

        setLoader(true);
        const response = await api('setting/save', {...data, user: config.user.id});
        if ( response.status ) alert_msg('System has been modified successfully');
        else alert_msg('Error, something is went wrong !', 'error');
        setLoader(false);

    }
    const save_config = async( _data_ ) => {

        setData(_data_);
        setLoader1(true);
        const response = await api('setting/option', {..._data_, user: config.user.id});
        if ( response.status ) alert_msg('System has been modified successfully');
        else alert_msg('Error, something is went wrong !', 'error');
        setLoader1(false);

    }
    const save_payment = async( index ) => {

        setLoader2(true);
        const response = await api('setting/payment', {...payments[index], user: config.user.id});
        if ( response.status ) alert_msg('Payments has been saved successfully');
        else alert_msg('Error, something is went wrong !', 'error');
        setLoader2(false);

    }
    const delete_item = async( item ) => {

        if ( !confirm(`Are you sure to delete ${capitalize(item)} from system ?`) ) return;
        setLoader3(true);
        const response = await api('setting/delete', {item: item, user: config.user.id});
        if ( response.status ) alert_msg(`${capitalize(item)} has been deleted successfully`);
        else alert_msg('Error, something is went wrong !', 'error');
        setLoader3(false);

    }
    useEffect(() => {
        
        document.title = "Settings";
        get_data();

    }, []);

    return (

        <div className='settings relative h-full mt-[-.5rem]'>

            <ul className="sm:flex font-semibold border-b border-[#ebedf2] dark:border-[#191e3a] mb-5 whitespace-nowrap overflow-y-auto no-select">

                <li className="inline-block">
                    <a onClick={() => setTab(0)} className={`set-text pointer flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tab === 0 && '!border-primary text-primary'}`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                            <path d="M4.97883 9.68508C2.99294 8.89073 2 8.49355 2 8C2 7.50645 2.99294 7.10927 4.97883 6.31492L7.7873 5.19153C9.77318 4.39718 10.7661 4 12 4C13.2339 4 14.2268 4.39718 16.2127 5.19153L19.0212 6.31492C21.0071 7.10927 22 7.50645 22 8C22 8.49355 21.0071 8.89073 19.0212 9.68508L16.2127 10.8085C14.2268 11.6028 13.2339 12 12 12C10.7661 12 9.77318 11.6028 7.7873 10.8085L4.97883 9.68508Z" stroke="currentColor" strokeWidth="1.5"></path>
                            <path d="M22 12C22 12 21.0071 12.8907 19.0212 13.6851L16.2127 14.8085C14.2268 15.6028 13.2339 16 12 16C10.7661 16 9.77318 15.6028 7.7873 14.8085L4.97883 13.6851C2.99294 12.8907 2 12 2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                            <path d="M22 16C22 16 21.0071 16.8907 19.0212 17.6851L16.2127 18.8085C14.2268 19.6028 13.2339 20 12 20C10.7661 20 9.77318 19.6028 7.7873 18.8085L4.97883 17.6851C2.99294 16.8907 2 16 2 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                        </svg>
                        <span>Information</span>
                    </a>
                </li>
                <li className="inline-block">
                    <a onClick={() => setTab(1)} className={`set-text pointer flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tab === 1 && '!border-primary text-primary'}`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mt-[1px]">
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"></circle>
                            <path  d="M13.7654 2.15224C13.3978 2 12.9319 2 12 2C11.0681 2 10.6022 2 10.2346 2.15224C9.74457 2.35523 9.35522 2.74458 9.15223 3.23463C9.05957 3.45834 9.0233 3.7185 9.00911 4.09799C8.98826 4.65568 8.70226 5.17189 8.21894 5.45093C7.73564 5.72996 7.14559 5.71954 6.65219 5.45876C6.31645 5.2813 6.07301 5.18262 5.83294 5.15102C5.30704 5.08178 4.77518 5.22429 4.35436 5.5472C4.03874 5.78938 3.80577 6.1929 3.33983 6.99993C2.87389 7.80697 2.64092 8.21048 2.58899 8.60491C2.51976 9.1308 2.66227 9.66266 2.98518 10.0835C3.13256 10.2756 3.3397 10.437 3.66119 10.639C4.1338 10.936 4.43789 11.4419 4.43786 12C4.43783 12.5581 4.13375 13.0639 3.66118 13.3608C3.33965 13.5629 3.13248 13.7244 2.98508 13.9165C2.66217 14.3373 2.51966 14.8691 2.5889 15.395C2.64082 15.7894 2.87379 16.193 3.33973 17C3.80568 17.807 4.03865 18.2106 4.35426 18.4527C4.77508 18.7756 5.30694 18.9181 5.83284 18.8489C6.07289 18.8173 6.31632 18.7186 6.65204 18.5412C7.14547 18.2804 7.73556 18.27 8.2189 18.549C8.70224 18.8281 8.98826 19.3443 9.00911 19.9021C9.02331 20.2815 9.05957 20.5417 9.15223 20.7654C9.35522 21.2554 9.74457 21.6448 10.2346 21.8478C10.6022 22 11.0681 22 12 22C12.9319 22 13.3978 22 13.7654 21.8478C14.2554 21.6448 14.6448 21.2554 14.8477 20.7654C14.9404 20.5417 14.9767 20.2815 14.9909 19.902C15.0117 19.3443 15.2977 18.8281 15.781 18.549C16.2643 18.2699 16.8544 18.2804 17.3479 18.5412C17.6836 18.7186 17.927 18.8172 18.167 18.8488C18.6929 18.9181 19.2248 18.7756 19.6456 18.4527C19.9612 18.2105 20.1942 17.807 20.6601 16.9999C21.1261 16.1929 21.3591 15.7894 21.411 15.395C21.4802 14.8691 21.3377 14.3372 21.0148 13.9164C20.8674 13.7243 20.6602 13.5628 20.3387 13.3608C19.8662 13.0639 19.5621 12.558 19.5621 11.9999C19.5621 11.4418 19.8662 10.9361 20.3387 10.6392C20.6603 10.4371 20.8675 10.2757 21.0149 10.0835C21.3378 9.66273 21.4803 9.13087 21.4111 8.60497C21.3592 8.21055 21.1262 7.80703 20.6602 7C20.1943 6.19297 19.9613 5.78945 19.6457 5.54727C19.2249 5.22436 18.693 5.08185 18.1671 5.15109C17.9271 5.18269 17.6837 5.28136 17.3479 5.4588C16.8545 5.71959 16.2644 5.73002 15.7811 5.45096C15.2977 5.17191 15.0117 4.65566 14.9909 4.09794C14.9767 3.71848 14.9404 3.45833 14.8477 3.23463C14.6448 2.74458 14.2554 2.35523 13.7654 2.15224Z" stroke="currentColor" strokeWidth="1.5"></path>
                        </svg>
                        <span>Configrations</span>
                    </a>
                </li>
                <li className="inline-block">
                    <a onClick={() => setTab(2)} className={`set-text pointer flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tab === 2 && '!border-primary text-primary'}`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 mt-[.3px]">
                            <circle opacity="0.5" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M12 6V18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M15 9.5C15 8.11929 13.6569 7 12 7C10.3431 7 9 8.11929 9 9.5C9 10.8807 10.3431 12 12 12C13.6569 12 15 13.1193 15 14.5C15 15.8807 13.6569 17 12 17C10.3431 17 9 15.8807 9 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                        <span>Payment Details</span>
                    </a>
                </li>
                <li className="inline-block">
                    <a onClick={() => setTab(3)} className={`set-text pointer flex gap-2 p-4 border-b border-transparent hover:border-primary hover:text-primary ${tab === 3 && '!border-primary text-primary'}`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 mt-[1px]">
                            <path d="M4.00655 7.93309C3.93421 9.84122 4.41713 13.0817 7.6677 16.3323C8.45191 17.1165 9.23553 17.7396 10 18.2327M5.53781 4.93723C6.93076 3.54428 9.15317 3.73144 10.0376 5.31617L10.6866 6.4791C11.2723 7.52858 11.0372 8.90532 10.1147 9.8278C10.1147 9.8278 10.1147 9.8278 10.1147 9.8278C10.1146 9.82792 8.99588 10.9468 11.0245 12.9755C13.0525 15.0035 14.1714 13.8861 14.1722 13.8853C14.1722 13.8853 14.1722 13.8853 14.1722 13.8853C15.0947 12.9628 16.4714 12.7277 17.5209 13.3134L18.6838 13.9624C20.2686 14.8468 20.4557 17.0692 19.0628 18.4622C18.2258 19.2992 17.2004 19.9505 16.0669 19.9934C15.2529 20.0243 14.1963 19.9541 13 19.6111" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                        </svg>
                        <span>Danger Zone</span>
                    </a>
                </li>

            </ul>

            <div className='relative w-full'>
                {
                    tab === 1 ?
                    <div className="relative switch">

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">

                            <div className="panel space-y-4 no-select">

                                <h5 className="font-semibold text-lg">Theme</h5>

                                <div className="flex justify-around">

                                    <label className="inline-flex cursor-pointer">
                                        <input type="radio" checked={data.theme === 'light'} onChange={() => save_config({...data, theme: 'light'})} name="flexRadioDefault" className="form-radio ltr:mr-4 rtl:ml-4 cursor-pointer"/>
                                        <img className="ms-3" width="100" height="68" alt="settings-dark" src="/media/public/settings-light.svg" />
                                    </label>

                                    <label className="inline-flex cursor-pointer">
                                        <input  type="radio" checked={data.theme === 'dark'} onChange={() => save_config({...data, theme: 'dark'})} name="flexRadioDefault" className="form-radio ltr:mr-4 rtl:ml-4 cursor-pointer"/>
                                        <img className="ms-3" width="100" height="68" alt="settings-light" src="/media/public/settings-dark.svg" />
                                    </label>

                                </div>

                            </div>

                            <div className="panel space-y-4 no-select">

                                <h5 className="font-semibold text-lg">Active Data</h5>

                                <p className='pb-1'>
                                    Download all active data from <span className="text-primary">system</span> in files.
                                </p>

                                <button type="button" className="btn btn-primary download-data">Download</button>

                            </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Mail System</h5>

                                <p className='pb-1'>By activating this option you allow admins & owners & guest to use mail system .</p>

                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" checked={data.mails || false} onChange={() => save_config({...data, mails: !data.mails})} className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"/>
                                    <span htmlFor="custom_switch_checkbox1" className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Chat System</h5>

                                <p className='pb-1'>By activating this option you allow admins & owners & guest to use chat system .</p>

                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" checked={data.chats || false} onChange={() => save_config({...data, chats: !data.chats})} className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"/>
                                    <span htmlFor="custom_switch_checkbox1" className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Notification System</h5>

                                <p className='pb-1'>By activating this option you allow admins & owners & guest to receive notifications on system .</p>

                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" checked={data.notifications || false} onChange={() => save_config({...data, notifications: !data.notifications})} className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"/>
                                    <span htmlFor="custom_switch_checkbox1" className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Admin Register</h5>

                                <p className='pb-1'>By activating this option you allow new admins to sign up to the system .</p>

                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" checked={data.admin_register || false} onChange={() => save_config({...data, admin_register: !data.admin_register})} className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"/>
                                    <span htmlFor="custom_switch_checkbox1" className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Admin Login</h5>

                                <p className='pb-1'>By activating this option you allow admins to log in to the system .</p>

                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" checked={data.admin_login || false} onChange={() => save_config({...data, admin_login: !data.admin_login})} className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"/>
                                    <span htmlFor="custom_switch_checkbox1" className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">User Register</h5>

                                <p className='pb-1'>By activating this option you allow new owners & guests to sign up to the system .</p>

                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" checked={data.user_register || false} onChange={() => save_config({...data, user_register: !data.user_register})} className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"/>
                                    <span htmlFor="custom_switch_checkbox1" className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">User Login</h5>

                                <p className='pb-1'>By activating this option you allow owners & guests to log in to the system .</p>

                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" checked={data.user_login || false} onChange={() => save_config({...data, user_login: !data.user_login})} className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"/>
                                    <span htmlFor="custom_switch_checkbox1" className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Add Categories</h5>

                                <p className='pb-1'>By activating this option you allow admin & owners to create new categories on system .</p>

                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" checked={data.add_categories || false} onChange={() => save_config({...data, add_categories: !data.add_categories})} className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"/>
                                    <span htmlFor="custom_switch_checkbox1" className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Add Properties</h5>

                                <p className='pb-1'>By activating this option you allow admin & owners to create new properties on system .</p>

                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" checked={data.add_products || false} onChange={() => save_config({...data, add_products: !data.add_products})} className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"/>
                                    <span htmlFor="custom_switch_checkbox1" className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Add Bookings</h5>

                                <p className='pb-1'>By activating this option you allow admin & owners to create new bookings on system .</p>

                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" checked={data.add_bookings || false} onChange={() => save_config({...data, add_bookings: !data.add_bookings})} className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"/>
                                    <span htmlFor="custom_switch_checkbox1" className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Add Coupons</h5>

                                <p className='pb-1'>By activating this option you allow admin & owners to create new coupons on system .</p>

                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" checked={data.add_coupons || false} onChange={() => save_config({...data, add_coupons: !data.add_coupons})} className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"/>
                                    <span htmlFor="custom_switch_checkbox1" className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Allow Properties</h5>

                                <p className='pb-1'>By activating this option you allow guests to see properties on app or website .</p>

                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" checked={data.allow_products || false} onChange={() => save_config({...data, allow_products: !data.allow_products})} className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"/>
                                    <span htmlFor="custom_switch_checkbox1" className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Allow Bookings</h5>

                                <p className='pb-1'>By activating this option you allow guests to make bookings on app or website .</p>

                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" checked={data.allow_bookings || false} onChange={() => save_config({...data, allow_bookings: !data.allow_bookings})} className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"/>
                                    <span htmlFor="custom_switch_checkbox1" className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Allow Coupons</h5>

                                <p className='pb-1'>By activating this option you allow guests to use coupons on app or website.</p>

                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" checked={data.allow_coupons || false} onChange={() => save_config({...data, allow_coupons: !data.allow_coupons})} className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"/>
                                    <span htmlFor="custom_switch_checkbox1" className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Allow Withdraws</h5>

                                <p className='pb-1'>By activating this option you allow owners & guests to make withdraws on app or website .</p>

                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" checked={data.withdraws || false} onChange={() => save_config({...data, withdraws: !data.withdraws})} className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"/>
                                    <span htmlFor="custom_switch_checkbox1" className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Allow Deposits</h5>

                                <p className='pb-1'>By activating this option you allow owners & guests to make deposits on app or website.</p>

                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" checked={data.deposits || false} onChange={() => save_config({...data, deposits: !data.deposits})} className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"/>
                                    <span htmlFor="custom_switch_checkbox1" className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Close App</h5>

                                <p className='pb-1'>By activating this option you will close system on guests and owners - maintenance page will appeare .</p>

                                <label className="w-12 h-6 relative">
                                    <input type="checkbox" checked={!data.running || false} onChange={() => save_config({...data, running: !data.running})} className="custom_switch absolute w-full h-full opacity-0 z-10 cursor-pointer peer"/>
                                    <span htmlFor="custom_switch_checkbox1" className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary before:transition-all before:duration-300"></span>
                                </label>

                            </div>

                        </div>

                        { loader1 && <Loader bg/> }

                    </div>
                    : tab === 2 ?
                    <div className='relative'>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

                            <div className="panel">

                                <div className="mb-8 no-select">

                                    <h5 className="font-semibold text-lg mb-2 tracking-wide">Stripe</h5>

                                    <p>
                                        Changes to your <span className="text-primary">Stripe</span> information will take
                                        effect starting with payment .
                                    </p>

                                </div>

                                <div className="mb-5">

                                    <div className="grid gap-5 md:grid-cols-2 mb-5">
                                        <div>
                                            <label htmlFor="name" className='mb-3'>Owner name</label>
                                            <input id="name" type="text" value={payments[0].name || ''} onChange={(e) => setPayments([{...payments[0], name: e.target.value}, payments[1]])} className="form-input" autoComplete="off"/>
                                        </div>
                                        <div>
                                            <label htmlFor="email" className='mb-3'>E-mail</label>
                                            <input id="email" type="text" value={payments[0].email || ''} onChange={(e) => setPayments([{...payments[0], email: e.target.value}, payments[1]])} className="form-input" autoComplete="off"/>
                                        </div>
                                    </div>

                                    <div className='mb-5'>
                                        <label htmlFor="secret" className='mb-3'>Secret Key</label>
                                        <input id="secret" type="text" value={payments[0].secret || ''} onChange={(e) => setPayments([{...payments[0], secret: e.target.value}, payments[1]])} className="form-input" autoComplete="off"/>
                                    </div>

                                    <div className="grid gap-5 md:grid-cols-2 mb-5">
                                        <div>
                                            <label htmlFor="date" className='mb-3'>Expire Date</label>
                                            <input id="date" type="date" value={payments[0].date || ''} onChange={(e) => setPayments([{...payments[0], date: e.target.value}, payments[1]])} className="form-input" autoComplete="off"/>
                                        </div>
                                        <div>
                                            <label htmlFor="address" className='mb-3'>Address</label>
                                            <input id="address" type="text" value={payments[0].address || ''} onChange={(e) => setPayments([{...payments[0], address: e.target.value}, payments[1]])} className="form-input" autoComplete="off"/>
                                        </div>
                                    </div>

                                </div>

                                <div className="h-px w-full border-b border-[#e0e6ed] dark:border-[#1b2e4b] mt-11 mb-6"></div>

                                <div className='w-full flex justify-start no-select'>
                                    <button onClick={() => save_payment(0)} className="btn btn-primary w-[8rem] text-[.9rem] tracking-wide py-[.6rem]">Save Pay</button>
                                </div>
                                
                            </div>
                            <div className="panel">

                                <div className="mb-8 no-select">

                                    <h5 className="font-semibold text-lg mb-2 tracking-wide">Kashire</h5>

                                    <p>
                                        Changes to your <span className="text-primary">Kashire</span> information will take
                                        effect starting with payment .
                                    </p>

                                </div>

                                <div className="mb-5">

                                    <div className="grid gap-5 md:grid-cols-2 mb-5">
                                        <div>
                                            <label htmlFor="name1" className='mb-3'>Owner name</label>
                                            <input id="name1" type="text" value={payments[1].name || ''} onChange={(e) => setPayments([payments[0], {...payments[1], name: e.target.value}])} className="form-input" autoComplete="off"/>
                                        </div>
                                        <div>
                                            <label htmlFor="email1" className='mb-3'>E-mail</label>
                                            <input id="email1" type="text" value={payments[1].email || ''} onChange={(e) => setPayments([payments[0], {...payments[1], email: e.target.value}])} className="form-input" autoComplete="off"/>
                                        </div>
                                    </div>

                                    <div className='mb-5'>
                                        <label htmlFor="secret1" className='mb-3'>Secret Key</label>
                                        <input id="secret1" type="text" value={payments[1].secret || ''} onChange={(e) => setPayments([payments[0], {...payments[1], secret: e.target.value}])} className="form-input" autoComplete="off"/>
                                    </div>

                                    <div className="grid gap-5 md:grid-cols-2 mb-5">
                                        <div>
                                            <label htmlFor="date1" className='mb-3'>Expire Date</label>
                                            <input id="date1" type="date" value={payments[1].date || ''} onChange={(e) => setPayments([payments[0], {...payments[1], date: e.target.value}])} className="form-input" autoComplete="off"/>
                                        </div>
                                        <div>
                                            <label htmlFor="address1" className='mb-3'>Address</label>
                                            <input id="address1" type="text" value={payments[1].address || ''} onChange={(e) => setPayments([payments[0], {...payments[1], address: e.target.value}])} className="form-input" autoComplete="off"/>
                                        </div>
                                    </div>

                                </div>

                                <div className="h-px w-full border-b border-[#e0e6ed] dark:border-[#1b2e4b] mt-11 mb-6"></div>

                                <div className='w-full flex justify-start no-select'>
                                    <button onClick={() => save_payment(1)} className="btn btn-primary w-[8rem] text-[.9rem] tracking-wide py-[.6rem]">Save Pay</button>
                                </div>
                                
                            </div>

                        </div>

                        { loader2 && <Loader bg/> }

                    </div>
                    : tab === 3 ?
                    <div className="relative switch">

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Delete Mails</h5>

                                <p className='pb-1'>
                                    <span className="text-danger">Note :</span>
                                    <span className='px-2'>By clicking this button you will delete all data from system forever !</span>
                                </p>

                                <button className="btn btn-danger no-select" onClick={() => delete_item('mails')}>Delete</button>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Delete Chats</h5>

                                <p className='pb-1'>
                                    <span className="text-danger">Note :</span>
                                    <span className='px-2'>By clicking this button you will delete all data from system forever !</span>
                                </p>

                                <button className="btn btn-danger no-select" onClick={() => delete_item('chats')}>Delete</button>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Delete Reports</h5>

                                <p className='pb-1'>
                                    <span className="text-danger">Note :</span>
                                    <span className='px-2'>By clicking this button you will delete all data from system forever !</span>
                                </p>

                                <button className="btn btn-danger no-select" onClick={() => delete_item('reports')}>Delete</button>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Delete Categories</h5>

                                <p className='pb-1'>
                                    <span className="text-danger">Note :</span>
                                    <span className='px-2'>By clicking this button you will delete all data from system forever !</span>
                                </p>

                                <button className="btn btn-danger no-select" onClick={() => delete_item('categories')}>Delete</button>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Delete Properites</h5>

                                <p className='pb-1'>
                                    <span className="text-danger">Note :</span>
                                    <span className='px-2'>By clicking this button you will delete all data from system forever !</span>
                                </p>

                                <button className="btn btn-danger no-select" onClick={() => delete_item('products')}>Delete</button>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Delete Coupons</h5>

                                <p className='pb-1'>
                                    <span className="text-danger">Note :</span>
                                    <span className='px-2'>By clicking this button you will delete all data from system forever !</span>
                                </p>

                                <button className="btn btn-danger no-select" onClick={() => delete_item('coupons')}>Delete</button>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Delete Bookings</h5>

                                <p className='pb-1'>
                                    <span className="text-danger">Note :</span>
                                    <span className='px-2'>By clicking this button you will delete all data from system forever !</span>
                                </p>

                                <button className="btn btn-danger no-select" onClick={() => delete_item('bookings')}>Delete</button>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Delete Payouts</h5>

                                <p className='pb-1'>
                                    <span className="text-danger">Note :</span>
                                    <span className='px-2'>By clicking this button you will delete all data from system forever !</span>
                                </p>

                                <button className="btn btn-danger no-select" onClick={() => delete_item('payouts')}>Delete</button>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Delete Supervisors</h5>

                                <p className='pb-1'>
                                    <span className="text-danger">Note :</span>
                                    <span className='px-2'>By clicking this button you will delete all data from system forever !</span>
                                </p>

                                <button className="btn btn-danger no-select" onClick={() => delete_item('supervisors')}>Delete</button>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Delete Admins</h5>

                                <p className='pb-1'>
                                    <span className="text-danger">Note :</span>
                                    <span className='px-2'>By clicking this button you will delete all data from system forever !</span>
                                </p>

                                <button className="btn btn-danger no-select" onClick={() => delete_item('admins')}>Delete</button>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Delete Owners</h5>

                                <p className='pb-1'>
                                    <span className="text-danger">Note :</span>
                                    <span className='px-2'>By clicking this button you will delete all data from system forever !</span>
                                </p>

                                <button className="btn btn-danger no-select" onClick={() => delete_item('owners')}>Delete</button>

                            </div>
                            <div className="panel space-y-4 default">

                                <h5 className="font-semibold text-lg">Delete Guests</h5>

                                <p className='pb-1'>
                                    <span className="text-danger">Note :</span>
                                    <span className='px-2'>By clicking this button you will delete all data from system forever !</span>
                                </p>

                                <button className="btn btn-danger no-select" onClick={() => delete_item('guests')}>Delete</button>

                            </div>

                        </div>

                        { loader3 && <Loader bg/> }

                    </div> :
                    <div className="relative border border-[#ebedf2] dark:border-[#191e3a] rounded-md p-4 mb-2 bg-white dark:bg-[#0e1726]">

                        <h6 className="text-lg font-bold mb-5 no-select">General Information</h6>

                        <div className="flex flex-col sm:flex-row">

                            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 home-form">

                                <div>
                                    <label htmlFor="name">Name</label>
                                    <input id="name" type="text" value={data.name || ''} onChange={(e) => setData({...data, name: e.target.value})} className="form-input" autoComplete="off"/>
                                </div>
                                <div>
                                    <label htmlFor="phone">Phone</label>
                                    <input id="phone" type="text" value={data.phone || ''} onChange={(e) => setData({...data, phone: e.target.value})} className="form-input" autoComplete="off"/>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="language">Language</label>
                                        <select id="language" value={data.language || ''} onChange={(e) => setData({...data, language: e.target.value})} className="form-select flex-1 pointer">
                                            <option value='' hidden>--</option>
                                            <option value="ar">Arabic</option>
                                            <option value="en">English</option>
                                            <option value="fr">French</option>
                                            <option value="it">Italian</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="location">Location</label>
                                        <input id="location" type="text" value={data.location || ''} onChange={(e) => setData({...data, location: e.target.value})} className="form-input" autoComplete="off"/>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="email">E-mail</label>
                                    <input id="email" type="text" value={data.email || ''} onChange={(e) => setData({...data, email: e.target.value})} className="form-input" autoComplete="off"/>
                                </div>
                                <div>
                                    <label htmlFor="facebook">Facebook</label>
                                    <input id="facebook" type="text" value={data.facebook || ''} onChange={(e) => setData({...data, facebook: e.target.value})} className="form-input" autoComplete="off"/>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="whatsapp">Whatsapp</label>
                                        <input id="whatsapp" type="text" value={data.whatsapp || ''} onChange={(e) => setData({...data, whatsapp: e.target.value})} className="form-input" autoComplete="off"/>
                                    </div>
                                    <div>
                                        <label htmlFor="telegram">Telegram</label>
                                        <input id="telegram" type="text" value={data.telegram || ''} onChange={(e) => setData({...data, telegram: e.target.value})} className="form-input" autoComplete="off"/>
                                    </div>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label htmlFor="youtube">Youtube</label>
                                        <input id="youtube" type="text" value={data.youtube || ''} onChange={(e) => setData({...data, youtube: e.target.value})} className="form-input" autoComplete="off"/>
                                    </div>
                                    <div>
                                        <label htmlFor="twitter">Twitter</label>
                                        <input id="twitter" type="text" value={data.twitter || ''} onChange={(e) => setData({...data, twitter: e.target.value})} className="form-input" autoComplete="off"/>
                                    </div>
                                </div>
                                <div className="sm:col-span-2 mt-0 mb-3 buttons-actions flex justify-end">
                                    <button type="button" onClick={save_data} className="btn btn-primary save-data w-[8rem] tracking-wide text-[.9rem]">Save</button>
                                </div>
                                
                            </div>

                        </div>

                        { loader && <Loader /> }

                    </div>
                }
            </div>

        </div>

    );

};
