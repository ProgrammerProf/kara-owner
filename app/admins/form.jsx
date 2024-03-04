"use client";
import { alert_msg, api, date, fix_date } from '@/public/script/public';
import Files from "@/app/component/files";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Loader from '@/app/component/loader';

export default function Form_Admin ({ id }) {
   
    const router = useRouter();
    const config = useSelector((state) => state.config);
    const [menu, setMenu] = useState('');
    const [data, setData] = useState({});
    const [loader, setLoader] = useState(true);

    const default_item = async() => {

        setData({
            id: 0,
            name: '',
            phone: '',
            email: '',
            password: '',
            country: '', 
            age: 0,
            notes: '',
            salary: 0,
            show_password: true,
            create_date: date('date'),
            update_date: date('date'),
            chat: true,
            mail: true,
            notifications: true,
            statistics: true,
            active: true,
            supervisor: false,
            see_categories: true,
            add_categories: true,
            delete_categories: true,
            see_products: true,
            add_products: true,
            delete_products: true,
            see_bookings: true,
            add_bookings: true,
            delete_bookings: true,
            see_coupons: true,
            add_coupons: true,
            delete_coupons: true,
            see_owners: true,
            add_owners: true,
            delete_owners: true,
            see_guests: true,
            add_guests: true,
            delete_guests: true,
            control_owners_balance: false,
            control_guests_balance: false,
        });

        setLoader(false);

    }
    const get_item = async() => {

        const response = await api('user', {id: id, role: 1, user: config.user.id});
        if ( !response.data?.id ) return router.replace('/admins');
        setData(response.data);
        setLoader(false);
        document.title = `Edit Admin | ${response.data.name || ''}`;

    }
    const save_item = async() => {
        
        if ( !data.name ) return alert_msg('Error, admin name required !', 'error');
        if ( !data.email ) return alert_msg('Error, admin e-mail required !', 'error');
        if ( !data.password ) return alert_msg('Error, admin password required !', 'error');

        setLoader(true);
        const response = await api(`user/${id ? 'edit' : 'add'}`, {...data, role: 1, user: config.user.id});

        if ( response.status === true ) {
            if ( id ) alert_msg(`Admin ( ${id} ) updated successfully`);
            else alert_msg(`New admin added successfully`);
            return router.replace('/admins')
        }
        else if ( response.status === 'exists' ) alert_msg('This admin e-mail is already exists !', 'error');
        else alert_msg('Error, something is went wrong !', 'error');

        setLoader(false);

    }
    const delete_item = async() => {

        if ( !confirm('Are you sure to delete this admin ?') ) return;

        setLoader(true);
        const response = await api('user/delete', {ids: JSON.stringify([id]), role: 1, user: config.user.id});

        if ( response.status ) {
            alert_msg(`Admin ( ${id} ) has been deleted successfully`);
            return router.replace('/admins');
        }
        else {
            alert_msg('Error, something is went wrong !', 'error');
            setLoader(false);
        }

    }
    const close_item = async() => {
        
        return router.replace('/admins');

    }
    useEffect(() => {

        document.title = id ? 'Edit Admin' : 'Add Admin';
        setMenu(localStorage.getItem('menu'));
        id ? get_item() : default_item();

    }, []);

    return (

        <div className='edit-item-info relative'>
            {
                loader ? <Loader bg/> :
                <div className="flex xl:flex-row flex-col gap-2.5">

                    <div className="flex flex-col flex-1 xl:w-[70%]">

                        <div className="panel px-0 flex-1 py-6 ltr:xl:mr-6 rtl:xl:ml-6 no-select">

                            <div className="px-4">

                                <div className="flex justify-between lg:flex-row flex-col">

                                    <div className="lg:w-1/2 w-full ltr:lg:mr-6 rtl:lg:ml-6 mb-4 div-2">

                                        <Files data={data} setData={setData} user/>

                                    </div>

                                    <div className="lg:w-1/2 w-full div-3">

                                        <div className="flex items-center">
                                            <label htmlFor="name" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0 ltr:pl-8 rtl:pr-8">Name</label>
                                            <input id="name" type="text" value={data.name || ''} onChange={(e) => setData({...data, name: e.target.value})} className="form-input flex-1" autoComplete="off"/>
                                        </div>

                                        <div className="flex items-center mt-4">
                                            <label htmlFor="phone" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0 ltr:pl-8 rtl:pr-8">Phone</label>
                                            <input id="phone" type="text" value={data.phone || ''} onChange={(e) => setData({...data, phone: e.target.value})} className="form-input flex-1" autoComplete="off"/>
                                        </div>

                                        <div className="flex items-center mt-4 mb-4">
                                            <label htmlFor="email" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0 ltr:pl-8 rtl:pr-8">E-mail</label>
                                            <input id="email" type="text" value={data.email || ''} onChange={(e) => setData({...data, email: e.target.value})} className="form-input flex-1" autoComplete="off"/>
                                        </div>

                                        <div className="flex items-center mt-4 mb-4 relative">
                                            {
                                                data.show_password ?
                                                <div className="toggle-password flex pointer" onClick={() => setData({...data, show_password: false})}>
                                                    <span className="material-symbols-outlined icon">visibility</span>
                                                </div> :
                                                <div className="toggle-password flex pointer" onClick={() => setData({...data, show_password: true})}>
                                                    <span className="material-symbols-outlined icon">visibility_off</span>
                                                </div>
                                            }
                                            <label htmlFor="password" className="ltr:mr-2 rtl:ml-2 w-1/3 mb-0 ltr:pl-8 rtl:pr-8">Password</label>
                                            <input id="password" type={data.show_password ? 'text' : 'password'} value={data.password || ''} onChange={(e) => setData({...data, password: e.target.value})} className="form-input flex-1" autoComplete="off"/>
                                        </div>

                                    </div>

                                </div>

                            </div>

                            <hr className="border-[#e0e6ed] dark:border-[#1b2e4b] mt-4 mb-6"/>

                            <div className="pt-[.8rem] px-4">
                                
                                <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">

                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, chat: !data.chat})} checked={data.chat || false} id="chat" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="chat" className="ltr:pl-3 rtl:pr-3 pointer">Chat</label>

                                    </div>
                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, mail: !data.mail})} checked={data.mail || false} id="mail" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="mail" className="ltr:pl-3 rtl:pr-3 pointer">Mailbox</label>

                                    </div>
                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, notifications: !data.notifications})} checked={data.notifications || false} id="notifications" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="notifications" className="ltr:pl-3 rtl:pr-3 pointer">Notifications</label>

                                    </div>
                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, statistics: !data.statistics})} checked={data.statistics || false} id="statistics" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="statistics" className="ltr:pl-3 rtl:pr-3 pointer">Statistics</label>

                                    </div>
                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, see_categories: !data.see_categories})} checked={data.see_categories || false} id="see_categories" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="see_categories" className="ltr:pl-3 rtl:pr-3 pointer">See Categories</label>

                                    </div>
                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, add_categories: !data.add_categories})} checked={data.add_categories || false} id="add_categories" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="add_categories" className="ltr:pl-3 rtl:pr-3 pointer">Add Categories</label>

                                    </div>
                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, delete_categories: !data.delete_categories})} checked={data.delete_categories || false} id="delete_categories" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="delete_categories" className="ltr:pl-3 rtl:pr-3 pointer">Delete Categories</label>

                                    </div>
                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, see_products: !data.see_products})} checked={data.see_products || false} id="see_products" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="see_products" className="ltr:pl-3 rtl:pr-3 pointer">See Properties</label>

                                    </div>
                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, add_products: !data.add_products})} checked={data.add_products || false} id="add_products" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="add_products" className="ltr:pl-3 rtl:pr-3 pointer">Add Properties</label>

                                    </div>
                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, delete_products: !data.delete_products})} checked={data.delete_products || false} id="delete_products" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="delete_products" className="ltr:pl-3 rtl:pr-3 pointer">Delete Properties</label>

                                    </div>
                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, see_bookings: !data.see_bookings})} checked={data.see_bookings || false} id="see_bookings" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="see_bookings" className="ltr:pl-3 rtl:pr-3 pointer">See Bookings</label>

                                    </div>
                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, add_bookings: !data.add_bookings})} checked={data.add_bookings || false} id="add_bookings" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="add_bookings" className="ltr:pl-3 rtl:pr-3 pointer">Add Bookings</label>

                                    </div>
                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, delete_bookings: !data.delete_bookings})} checked={data.delete_bookings || false} id="delete_bookings" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="delete_bookings" className="ltr:pl-3 rtl:pr-3 pointer">Delete Bookings</label>

                                    </div>
                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, see_coupons: !data.see_coupons})} checked={data.see_coupons || false} id="see_coupons" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="see_coupons" className="ltr:pl-3 rtl:pr-3 pointer">See Coupons</label>

                                    </div>
                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, add_coupons: !data.add_coupons})} checked={data.add_coupons || false} id="add_coupons" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="add_coupons" className="ltr:pl-3 rtl:pr-3 pointer">Add Coupons</label>

                                    </div>
                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, delete_coupons: !data.delete_coupons})} checked={data.delete_coupons || false} id="delete_coupons" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="delete_coupons" className="ltr:pl-3 rtl:pr-3 pointer">Delete Coupons</label>

                                    </div>
                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, see_owners: !data.see_owners})} checked={data.see_owners || false} id="see_owners" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="see_owners" className="ltr:pl-3 rtl:pr-3 pointer">See Owners</label>

                                    </div>
                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, add_owners: !data.add_owners})} checked={data.add_owners || false} id="add_owners" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="add_owners" className="ltr:pl-3 rtl:pr-3 pointer">Add Owners</label>

                                    </div>
                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, delete_owners: !data.delete_owners})} checked={data.delete_owners || false} id="delete_owners" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="delete_owners" className="ltr:pl-3 rtl:pr-3 pointer">Delete Owners</label>

                                    </div>
                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, see_guests: !data.see_guests})} checked={data.see_guests || false} id="see_guests" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="see_guests" className="ltr:pl-3 rtl:pr-3 pointer">See Guests</label>

                                    </div>
                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, add_guests: !data.add_guests})} checked={data.add_guests || false} id="add_guests" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="add_guests" className="ltr:pl-3 rtl:pr-3 pointer">Add Guests</label>

                                    </div>
                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, delete_guests: !data.delete_guests})} checked={data.delete_guests || false} id="delete_guests" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="delete_guests" className="ltr:pl-3 rtl:pr-3 pointer">Delete Guests</label>

                                    </div>
                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, control_guests_balance: !data.control_guests_balance})} checked={data.control_guests_balance || false} id="control_guests_balance" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="control_guests_balance" className="ltr:pl-3 rtl:pr-3 pointer">Control Guests Balance</label>

                                    </div>
                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, control_owners_balance: !data.control_owners_balance})} checked={data.control_owners_balance || false} id="control_owners_balance" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="control_owners_balance" className="ltr:pl-3 rtl:pr-3 pointer">Control Owners Balance</label>

                                    </div>

                                </div>
                                
                            </div>

                            <hr className="border-[#e0e6ed] dark:border-[#1b2e4b] mt-6 mb-6"/>

                            <div className="mt-4 px-4">
                                
                                <label htmlFor='notes' className="mb-4">Notes</label>
                                
                                <textarea id="notes" value={data.notes || ''} onChange={(e) => setData({...data, notes: e.target.value})} className="form-textarea min-h-[80px] no-resize" rows="5"></textarea>

                            </div>

                        </div>

                    </div>

                    <div className={`xl:w-[30%] w-full xl:mt-0 mt-6 left-tab no-select ${menu === 'vertical' ? '' : 'space'}`}>

                        <div>

                            <div className="panel mb-5 pb-2 pt-6">

                                <div className="grid sm:grid-cols-2 grid-cols-1 gap-6 mb-5">

                                    <div>
                                        <label htmlFor="create_date" className="ltr:mr-2 rtl:ml-2 w-1/4 mb-3">Date</label>
                                        <input id="create_date" type="text" value={fix_date(data.create_date)} readOnly className="form-input flex-1 default" autoComplete="off"/>
                                    </div>
                                    <div>
                                        <label htmlFor="salary" className="ltr:mr-2 rtl:ml-2 w-1/4 mb-3">Salary</label>
                                        <input id="salary" type="number" min='0' value={data.salary || 0} onChange={(e) => setData({...data, salary: e.target.value})}  className="form-input flex-1" autoComplete="off"/>
                                    </div>

                                </div>

                                <div className="grid sm:grid-cols-2 grid-cols-1 gap-6 mb-6">

                                    <div>
                                        <label htmlFor="age" className="ltr:mr-2 rtl:ml-2 w-1/4 mb-3">Age</label>
                                        <input id="age" type="number" min='0' value={data.age || 0} onChange={(e) => setData({...data, age: e.target.value})}  className="form-input flex-1" autoComplete="off"/>
                                    </div>

                                    <div>
                                        <label htmlFor="country" className="ltr:mr-2 rtl:ml-2 w-1/4 mb-3">Country</label>
                                        <input id="country" type="text" value={data.country} onChange={(e) => setData({...data, country: e.target.value})}  className="form-input flex-1" autoComplete="off"/>
                                    </div>

                                </div>

                                <hr className="border-[#e0e6ed] dark:border-[#1b2e4b] mb-6"/>
                                
                                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 mb-2">

                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, supervisor: !data.supervisor})} checked={data.supervisor || false} id="supervisor" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="supervisor" className="ltr:pl-3 rtl:pr-3 pointer">Supervisor</label>

                                    </div>

                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, active: !data.active})} checked={data.active || false} id="active" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="active" className="ltr:pl-3 rtl:pr-3 pointer">Active</label>

                                    </div>

                                </div>

                            </div>

                            <div className="panel">

                                <div className="grid xl:grid-cols-1 lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">

                                    <button type="button" className="pointer btn btn-success w-full gap-2" onClick={save_item}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ltr:mr-2 rtl:ml-2">
                                            <path d="M3.46447 20.5355C4.92893 22 7.28595 22 12 22C16.714 22 19.0711 22 20.5355 20.5355C22 19.0711 22 16.714 22 12C22 11.6585 22 11.4878 21.9848 11.3142C21.9142 10.5049 21.586 9.71257 21.0637 9.09034C20.9516 8.95687 20.828 8.83317 20.5806 8.58578L15.4142 3.41944C15.1668 3.17206 15.0431 3.04835 14.9097 2.93631C14.2874 2.414 13.4951 2.08581 12.6858 2.01515C12.5122 2 12.3415 2 12 2C7.28595 2 4.92893 2 3.46447 3.46447C2 4.92893 2 7.28595 2 12C2 16.714 2 19.0711 3.46447 20.5355Z" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M17 22V21C17 19.1144 17 18.1716 16.4142 17.5858C15.8284 17 14.8856 17 13 17H11C9.11438 17 8.17157 17 7.58579 17.5858C7 18.1716 7 19.1144 7 21V22" stroke="currentColor" strokeWidth="1.5" />
                                            <path opacity="0.5" d="M7 8H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                        <span>Save</span>
                                    </button>
                                    <button type="button" className="pointer btn btn-warning w-full gap-2" onClick={close_item}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ltr:mr-2 rtl:ml-2">
                                            <path d="M12 7V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <circle cx="12" cy="16" r="1" fill="currentColor"></circle>
                                            <path opacity="0.5" d="M7.84308 3.80211C9.8718 2.6007 10.8862 2 12 2C13.1138 2 14.1282 2.6007 16.1569 3.80211L16.8431 4.20846C18.8718 5.40987 19.8862 6.01057 20.4431 7C21 7.98943 21 9.19084 21 11.5937V12.4063C21 14.8092 21 16.0106 20.4431 17C19.8862 17.9894 18.8718 18.5901 16.8431 19.7915L16.1569 20.1979C14.1282 21.3993 13.1138 22 12 22C10.8862 22 9.8718 21.3993 7.84308 20.1979L7.15692 19.7915C5.1282 18.5901 4.11384 17.9894 3.55692 17C3 16.0106 3 14.8092 3 12.4063V11.5937C3 9.19084 3 7.98943 3.55692 7C4.11384 6.01057 5.1282 5.40987 7.15692 4.20846L7.84308 3.80211Z" stroke="currentColor" strokeWidth="1.5"></path>
                                        </svg>
                                        <span>Cancel</span>
                                    </button>
                                    {
                                        id && config.user.supervisor ?
                                        <button type="button" className="pointer btn btn-danger w-full gap-2" onClick={delete_item}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ltr:mr-2 rtl:ml-2">
                                                <path opacity="0.5" d="M9.17065 4C9.58249 2.83481 10.6937 2 11.9999 2C13.3062 2 14.4174 2.83481 14.8292 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                <path d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            </svg>
                                            <span>Delete</span>
                                        </button> : ''

                                    }

                                </div>

                            </div>

                        </div>

                    </div>

                </div>
            }
        </div>

    );

};
