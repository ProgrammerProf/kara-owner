"use client";
import { api, date, alert_msg, fix_date, copy } from '@/public/script/public';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Select from '@/app/component/select';
import Loader from '@/app/component/loader';

export default function Form_Booking ({ id }) {
   
    const router = useRouter();
    const config = useSelector((state) => state.config);
    const [menu, setMenu] = useState('');
    const [userMenu, setUserMenu] = useState(false);
    const [propertyMenu, setPropertyMenu] = useState(false);
    const [resetUser, setResetUser] = useState(false);
    const [resetProperty, setResetProperty] = useState(false);
    const [data, setData] = useState({});
    const [loader, setLoader] = useState(true);

    const default_item = async() => {

        const response = await api('booking/default', {token: config.user.token});

        setData({
            id: 0,
            name: '',
            phone: '',
            email: '',
            address: '',
            notes: '', 
            create_date: date('date'),
            update__date: date('date'),
            booking_date: '',
            status: 1,
            active: true,
            paid: true,
            user_id: 0,
            user_name: '',
            product_id: 0,
            product_name: '',
            price: 0,
            coupon_id: 0,
            coupon_code: '',
            coupons: response.coupons || [],
            users: response.users || [],
            products: response.products || [],
        });

        setLoader(false);

    }
    const get_item = async() => {

        const response = await api('booking', {id: id, token: config.user.token});
        if ( !response.data?.id ) return router.replace('/bookings');
        setData(response.data);
        setLoader(false);
        document.title = `${config.text.edit_booking} | ${response.data.user_name || ''}`;

    }
    const save_item = async() => {
        
        if ( !data.user_id ) return alert_msg(config.text.user_required, 'error');
        if ( !data.product_id ) return alert_msg(config.text.product_required, 'error');
        
        setLoader(true);
        const response = await api(`booking/${id ? 'edit' : 'add'}`, {...data, token: config.user.token});

        if ( response.status === true ) {
            if ( id ) alert_msg(`${config.text.item} ( ${id} ) - ${config.text.updated_successfully}`);
            else alert_msg(config.text.new_item_added);
            return router.replace('/bookings')
        }
        else alert_msg(config.text.alert_error, 'error');

        setLoader(false);

    }
    const delete_item = async() => {

        if ( !confirm(config.text.ask_delete_item) ) return;

        setLoader(true);
        const response = await api('booking/delete', {ids: JSON.stringify([id]), token: config.user.token});

        if ( response.status ) {
            alert_msg(`${config.text.item} ( ${id} ) ${config.text.deleted_successfully}`);
            return router.replace('/bookings');
        }
        else {
            alert_msg(config.text.alert_error, 'error');
            setLoader(false);
        }

    }
    const close_item = async() => {
        
        return router.replace('/bookings');

    }
    useEffect(() => {

        data.user_id ? setResetUser(true) : setResetUser(false);
        data.product_id ? setResetProperty(true) : setResetProperty(false);

    }, [data]);
    useEffect(() => {

        if (id) return;
        let price = data.products?.find(_ => _.id === parseInt(data.product_id))?.new_price || 0;
        let discount = data.coupons?.find(_ => _.id === parseInt(data.coupon_id))?.discount || 0;
        price = price - price * discount / 100;
        setData({...data, price: parseFloat(price).toFixed(2)})

    }, [data.product_id, data.coupon_id]);
    useEffect(() => {

        document.title = id ? config.text.edit_booking : config.text.add_booking;
        setMenu(localStorage.getItem('menu'));
        id ? get_item() : default_item();

    }, []);

    return (

        <div className='edit-item-info relative'>
            {
                loader ? <Loader bg/>:
                <div className="flex xl:flex-row flex-col gap-2.5">

                    <div className="flex flex-col flex-1 xl:w-[70%]">

                        <div className="panel px-0 flex-1 py-6 ltr:xl:mr-6 rtl:xl:ml-6 no-select">

                            <div className="px-4">

                                <div className="flex justify-between lg:flex-row flex-col">

                                    <div className="lg:w-1/2 w-full ltr:lg:mr-8 rtl:lg:ml-8 mb-4 div-2">

                                        <div className="flex items-center relative mb-5">
                                            {
                                                (resetUser && !id) &&
                                                <div className="reset-icon flex ltr:right-[.5rem] rtl:left-[.5rem]" onClick={() => setData({...data, user_id: 0, user_name: ''})}>
                                                    <span className="material-symbols-outlined icon">close</span>
                                                </div>
                                            }
                                            <label htmlFor="user" className="ltr:mr-2 rtl:ml-2 w-1/4 mb-0">{config.text.user}</label>
                                            <input id="user" type="text" value={data.user_name || '-'} onClick={() => setUserMenu(true)} className={`form-input flex-1 ${id ? 'default' : 'pointer'}`} readOnly/>
                                        </div>

                                        <div className="flex items-center relative">
                                            <label htmlFor="coupon" className="ltr:mr-2 rtl:ml-2 w-1/4 mb-0">{config.text.coupon}</label>
                                            {
                                                id ?
                                                <input id="coupon" type="text" value={data.coupon_code || '-'}  className='form-input flex-1 default' readOnly/>
                                                :
                                                <select id="coupon" value={data.coupon_id || 0} onChange={(e) => setData({...data, coupon_id: e.target.value})} className='form-input flex-1 pointer'>
                                                    <option value="0">-</option>
                                                    { data.coupons && data.coupons.map((item, index) => <option key={index} value={item.id}>{item.code}</option>) }
                                                </select>
                                            }
                                        </div>

                                    </div>

                                    <div className="lg:w-1/2 w-full div-3">

                                        <div className="flex items-center relative mb-5">
                                            {
                                                (resetProperty && !id) &&
                                                <div className="reset-icon flex ltr:right-[.5rem] rtl:left-[.5rem]" onClick={() => setData({...data, product_id: 0, product_name: ''})}>
                                                    <span className="material-symbols-outlined icon">close</span>
                                                </div>
                                            }
                                            <label htmlFor="property" className="w-1/4 mb-0 ltr:pl-3 rtl:pr-3">{config.text.product}</label>
                                            <input id="property" type="text" value={data.product_name || '-'} onClick={() => setPropertyMenu(true)} className={`form-input flex-1 ${id ? 'default' : 'pointer'}`} readOnly/>
                                        </div>
                                        
                                        <div className="flex items-center relative">
                                            <label htmlFor="price" className="w-1/4 mb-0 ltr:pl-3 rtl:pr-3">{config.text.price}</label>
                                            <input id="price" type="number" value={data.price || 0} className="form-input flex-1 default" readOnly/>
                                        </div>

                                    </div>

                                </div>

                            </div>

                            <hr className="border-[#e0e6ed] dark:border-[#1b2e4b] mt-4"/>

                            <div className="px-4 mt-8">

                                <div className="flex justify-between lg:flex-row flex-col">

                                    <div className="lg:w-1/2 w-full ltr:lg:mr-6 rtl:lg:ml-6 mb-4 div-2">

                                        <div className="flex items-center">
                                            <label htmlFor="name" className="ltr:mr-2 rtl:ml-2 w-1/4 mb-0">{config.text.name}</label>
                                            <input id="name" type="text" value={data.name || ''} onChange={(e) => setData({...data, name: e.target.value})} className="form-input flex-1"/>
                                        </div>

                                        <div className="flex items-center mt-5">
                                            <label htmlFor="email" className="ltr:mr-2 rtl:ml-2 w-1/4 mb-0">{config.text.email}</label>
                                            <input id="email" type="text" value={data.email || ''} onChange={(e) => setData({...data, email: e.target.value})} className="form-input flex-1"/>
                                        </div>

                                    </div>

                                    <div className="lg:w-1/2 w-full div-3">
                                        
                                        <div className="flex items-center">
                                            <label htmlFor="phone" className="w-1/4 mb-0 ltr:pl-3 rtl:pr-3">{config.text.phone}</label>
                                            <input id="phone" type="text" value={data.phone || ''} onChange={(e) => setData({...data, phone: e.target.value})} className="form-input flex-1"/>
                                        </div>

                                        <div className="flex items-center mt-5">
                                            <label htmlFor="booking-date" className="w-1/4 mb-0 ltr:pl-3 rtl:pr-3">{config.text.date}</label>
                                            <input id="booking-date" type="date" value={data.booking_date || ''} onChange={(e) => setData({...data, booking_date: e.target.value})} className="form-input flex-1 default"/>
                                        </div>

                                    </div>

                                </div>

                            </div>

                            <div className="mt-2 px-4">

                                <label htmlFor="address" className="mb-4">{config.text.address}</label>
                                
                                <textarea id="address" value={data.address || ''} onChange={(e) => setData({...data, address: e.target.value})} className="form-textarea min-h-[100px] no-resize"></textarea>
                            
                            </div>

                            <div className="mt-4 px-4">

                                <label htmlFor="notes" className="mb-4">{config.text.notes}</label>
                                
                                <textarea id="notes" value={data.notes || ''} onChange={(e) => setData({...data, notes: e.target.value})} className="form-textarea min-h-[80px] no-resize" rows="3"></textarea>
                            
                            </div>
                            
                            {
                                !id &&
                                <div>
                                    <Select 
                                        model={userMenu} setModel={setUserMenu} data={data.users} 
                                        onChange={(id) => setData({...data, user_id: id, user_name: data.users.find(_ => _.id === id).name})}
                                    />
                                    <Select 
                                        model={propertyMenu} setModel={setPropertyMenu} data={data.products} product 
                                        onChange={(id) => setData({...data, product_id: id, product_name: data.products.find(_ => _.id === id).name})}
                                    />
                                </div>
                            }

                        </div>

                    </div>

                    <div className={`xl:w-[30%] w-full xl:mt-0 mt-6 left-tab no-select ${menu === 'vertical' ? '' : 'space'}`}>

                        <div>

                            <div className="panel mb-5 pb-2">

                                <div className="grid sm:grid-cols-2 grid-cols-1 gap-4 mt-1">

                                    <div>

                                        <label htmlFor="create_date" className="mb-3">{config.text.date}</label>

                                        <input id="create_date" type="text" value={fix_date(data.create_date)} className="form-input default" readOnly/>

                                    </div>
                                
                                    <div>

                                        <label htmlFor="status" className="mb-3">{config.text.status}</label>

                                        <select id="status" value={data.status || '1'} onChange={(e) => setData({...data, status: e.target.value})} className="form-select flex-1 pointer">
                                            <option value="1">Pending</option>
                                            <option value="2">Stopped</option>
                                            <option value="3">Cancelled</option>
                                            <option value="4">Confirmed</option>
                                        </select>
                                    
                                    </div>

                                </div>

                                <div className='mt-5'>

                                    <label htmlFor="secret" className="mb-3">{config.text.booking_key}</label>

                                    <input id="secret" type="text" value={data.secret || '--'} onClick={(e) => { e.target.select(); copy(data.secret || '') }} className="form-input default" readOnly/>

                                </div>

                                <hr className="border-[#e0e6ed] dark:border-[#1b2e4b] mt-6 mb-5"/>

                                <div className="flex justify-between items-center w-full py-1">

                                    <div className="check-input">

                                        <label className="w-12 h-6 relative">
                                            
                                            <input onChange={() => setData({...data, paid: !data.paid})} checked={data.paid || false} id="paid" type="checkbox" className="absolute w-full h-full opacity-0 z-10 pointer peer"/>

                                            <span className="bg-[#ebedf2] dark:bg-dark block h-full rounded-full before:absolute before:left-1 
                                                before:bg-white dark:before:bg-white-dark dark:peer-checked:before:bg-white before:bottom-1 
                                                before:w-4 before:h-4 before:rounded-full peer-checked:before:left-7 peer-checked:bg-primary 
                                                before:transition-all before:duration-300">
                                            </span>

                                        </label>

                                        <label htmlFor="paid" className="ltr:pl-3 rtl:pr-3 pointer">{config.text.paid}</label>

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

                                        <label htmlFor="active" className="ltr:pl-3 rtl:pr-3 pointer">{config.text.active}</label>

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
                                        <span>{config.text.save}</span>
                                    </button>
                                    <button type="button" className="pointer btn btn-warning w-full gap-2" onClick={close_item}>
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ltr:mr-2 rtl:ml-2">
                                            <path d="M12 7V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <circle cx="12" cy="16" r="1" fill="currentColor"></circle>
                                            <path opacity="0.5" d="M7.84308 3.80211C9.8718 2.6007 10.8862 2 12 2C13.1138 2 14.1282 2.6007 16.1569 3.80211L16.8431 4.20846C18.8718 5.40987 19.8862 6.01057 20.4431 7C21 7.98943 21 9.19084 21 11.5937V12.4063C21 14.8092 21 16.0106 20.4431 17C19.8862 17.9894 18.8718 18.5901 16.8431 19.7915L16.1569 20.1979C14.1282 21.3993 13.1138 22 12 22C10.8862 22 9.8718 21.3993 7.84308 20.1979L7.15692 19.7915C5.1282 18.5901 4.11384 17.9894 3.55692 17C3 16.0106 3 14.8092 3 12.4063V11.5937C3 9.19084 3 7.98943 3.55692 7C4.11384 6.01057 5.1282 5.40987 7.15692 4.20846L7.84308 3.80211Z" stroke="currentColor" strokeWidth="1.5"></path>
                                        </svg>
                                        <span>{config.text.cancel}</span>
                                    </button>
                                    {
                                        id && config.user.delete_bookings?
                                        <button type="button" className="pointer btn btn-danger w-full gap-2" onClick={delete_item}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ltr:mr-2 rtl:ml-2">
                                                <path opacity="0.5" d="M9.17065 4C9.58249 2.83481 10.6937 2 11.9999 2C13.3062 2 14.4174 2.83481 14.8292 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                <path d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            </svg>
                                            <span>{config.text.delete}</span>
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
