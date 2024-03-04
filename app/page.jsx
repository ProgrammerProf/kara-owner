"use client";
import { alert_msg, api, fix_date, fix_number, host, print } from '@/public/script/public';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Dropdown from '@/app/component/menu';
import Chart from '@/app/component/chart';

export default function Home () {

    const router = useRouter();
    const config = useSelector((state) => state.config);
    const [orders, setOrders] = useState([]);
    const [admins, setAdmins] = useState([]);
    const [products, setProducts] = useState([]);
    const [bookings, setBookings] = useState({});
    const [properties, setProperties] = useState({});
    const [users, setUsers] = useState({});
    const [visitors, setVisitors] = useState({});
    const [coupons, setCoupons] = useState({});
    const [confirmed, setConfirmed] = useState({});
    const [cancelled, setCancelled] = useState({});
    const [settings, setSettings] = useState({});
    const [statistics, setStatistics] = useState(null);
    const [frame, setFrame] = useState('daily');

    const get_data = async() => {

        const response = await api('home/statistics', {user: config.user.id});
        
        setProperties(response.properties || {});
        setCoupons(response.coupons || {});
        setBookings(response.bookings || {});
        setConfirmed(response.confirmed || {});
        setCancelled(response.cancelled || {});
        setUsers(response.users || {});
        setVisitors(response.visitors || {});
        setSettings(response.settings || {});
        setOrders(response.recently_bookings || []);
        setAdmins(response.recently_users || []);
        setProducts(response.recently_products || []);

        setStatistics({
            'daily': [
                {name: 'Properties', data: response.properties?.series_daily},
                {name: 'Coupons', data: response.coupons?.series_daily},
                {name: 'Bookings', data: response.bookings?.series_daily},
                {name: 'Visitors', data: response.visitors?.series_daily},
            ],
            'weekly': [
                {name: 'Properties', data: response.properties?.series_weekly},
                {name: 'Coupons', data: response.coupons?.series_weekly},
                {name: 'Bookings', data: response.bookings?.series_weekly},
                {name: 'Visitors', data: response.visitors?.series_weekly},
            ],
            'monthly': [
                {name: 'Properties', data: response.properties?.series_monthly},
                {name: 'Coupons', data: response.coupons?.series_monthly},
                {name: 'Bookings', data: response.bookings?.series_monthly},
                {name: 'Visitors', data: response.visitors?.series_monthly},
            ],
            'yearly': [
                {name: 'Properties', data: response.properties?.series_yearly},
                {name: 'Coupons', data: response.coupons?.series_yearly},
                {name: 'Bookings', data: response.bookings?.series_yearly},
                {name: 'Visitors', data: response.visitors?.series_yearly},
            ],
        });

    }
    const delete_orders = async() => {

        let ids = orders.map(_ => _.id);
        setOrders([]);
        if ( ids.length ) alert_msg('Recently bookings confirmed successfully');

    }
    const delete_users = async() => {

        let ids = admins.map(_ => _.id);
        setAdmins([]);
        if ( ids.length ) alert_msg('Recently users confirmed successfully');

    }
    const delete_products = async() => {

        let ids = products.map(_ => _.id);
        setProducts([]);
        if ( ids.length ) alert_msg('Recently properties confirmed successfully');

    }
    useEffect(() => {

        document.title = 'Dashboard';
        if ( config.user.statistics ) get_data();

    }, []);

    return (

        <div>

            <div className="mb-6 grid gap-6 xl:grid-cols-3">

                <div className='panel h-[493px] xl:col-span-2 pb-3'>

                    { statistics && frame === 'daily' ? <Chart type='chart' label='Balance' statistics={statistics['daily']} onChange={_ => setFrame(_)} frame='daily' title='Statistics' summary={settings}/> : ''}
                    { statistics && frame === 'weekly' ? <Chart type='chart' label='Balance' statistics={statistics['weekly']} onChange={_ => setFrame(_)} frame='weekly' title='Statistics' summary={settings}/> : ''}
                    { statistics && frame === 'monthly' ? <Chart type='chart' label='Balance' statistics={statistics['monthly']} onChange={_ => setFrame(_)} frame='monthly' title='Statistics' summary={settings}/> : ''}
                    { statistics && frame === 'yearly' ? <Chart type='chart' label='Balance' statistics={statistics['yearly']} onChange={_ => setFrame(_)} frame='yearly' title='Statistics' summary={settings}/> : ''}
                    { !statistics && <Chart type='chart' label='Balance' statistics={[]} title='Statistics' summary={settings}/> }
                    
                </div>

                <div className='h-full'>

                    { Object.values(users || {}).length > 0 && <Chart type='category' title='All Users' series={Object.values(users)} label={Object.keys(users)} height={460}/> }
                    { !Object.values(users || {}).length && <Chart type='category' title='All Users' series={[1]} label={['']} height={460}/> }
                    
                </div>

            </div>

            <div className="mb-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">

                { properties.series_daily?.length > 0 && <Chart  type='area' label='Products' title='Products' color='success' light icon='product' total={properties.total} series={properties.series_daily}/> }
                { !properties.series_daily?.length && <Chart  type='area' label='Products' title='Products' color='success' light icon='product' total={properties.total} series={[]}/> }

                { visitors.series_daily?.length > 0 && <Chart  type='area' label='Visitors' title='Visitors' color='warning' icon='user' total={visitors.total} series={visitors.series_daily}/> }
                { !visitors.series_daily?.length && <Chart  type='area' label='Visitors' title='Visitors' color='warning' icon='user' total={visitors.total} series={[]}/> }

                { bookings.series_daily?.length > 0 && <Chart  type='area' label='Bookings' title='Bookings' color='info' icon='order' total={bookings.total} series={bookings.series_daily}/> }
                { !bookings.series_daily?.length && <Chart  type='area' label='Bookings' title='Bookings' color='info' icon='order' total={bookings.total} series={[]}/> }

                { coupons.series_daily?.length > 0 && <Chart  type='area' label='Coupons' title='Coupons' color='secondary' icon='coupon' total={coupons.total} series={coupons.series_daily}/> }
                { !coupons.series_daily?.length && <Chart  type='area' label='Coupons' title='Coupons' color='secondary' icon='coupon' total={coupons.total} series={[]}/> }

            </div>

            <div className="mb-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">

                <Chart type='summary' title='Summary' summary={settings}/>

                { confirmed.series_daily?.length > 0 && <Chart  type='area' label='Confirmed' title='Confirmed' color='success' icon='confirm' total={confirmed.total} series={confirmed.series_daily} height={280}/> }
                { !confirmed.series_daily?.length && <Chart  type='area' label='Confirmed' title='Confirmed' color='success' icon='confirm' total={confirmed.total} series={[]} height={280}/> }

                { cancelled.series_daily?.length > 0 && <Chart  type='area' label='Cancelled' title='Cancelled' color='danger' icon='cancel' total={cancelled.total} series={cancelled.series_daily} height={280}/> }
                { !cancelled.series_daily?.length && <Chart  type='area' label='Cancelled' title='Cancelled' color='danger' icon='cancel' total={cancelled.total} series={[]} height={280}/> }

            </div>

            <div className="grid gap-6 xl:grid-cols-3">

                <div className="panel h-full px-0 pb-2">

                    <div className="mb-5 flex items-center px-4 justify-between dark:text-white-light no-select">

                        <h5 className="text-base tracking-wide font-semibold">Recently Bookings</h5>

                        <div className="dropdown">

                            <Dropdown placement={`${config.dir === 'rtl' ? 'bottom-start' : 'bottom-end'}`}
                                button={
                                    <svg className="h-5 w-5 text-black/70 hover:!text-primary dark:text-white/70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                }>

                                <ul>
                                    <li><button onClick={() => router.push('/bookings')} type="button">All Bookings</button></li>
                                    <li><button onClick={() => router.push('/reports')} type="button">All Reports</button></li>
                                    <li onClick={delete_orders}><button type="button">Mark as Read</button></li>
                                </ul>

                            </Dropdown>

                        </div>

                    </div>
                
                    {
                        orders.length ?
                        <div className="space-y-0 no-select overflow-auto h-[420px]">
                            {
                                orders.map((item, index) =>

                                    <div key={index} onClick={() => router.push(`/bookings/edit/${item.id}`)} className="pointer flex hover:bg-primary/5 py-2 px-4 items-center">

                                        <div className='rounded-full w-9 h-9 min-w-9 layer-div overflow-hidden all-data'>

                                            <img 
                                                src={`${host}/U${item.user?.id}`} 
                                                onError={(e) => e.target.src = "/media/public/user_icon.png"} 
                                                onLoad={(e) => e.target.src.includes('_icon') ? e.target.classList.add('empty') : e.target.classList.remove('empty')}
                                                className='w-full h-full rounded-full'
                                            />

                                        </div>
                                        
                                        <div className="flex-1 px-3">
                                            
                                            <div className='max-w-[9rem] truncate -mt-[2px]'>{item.user?.name}</div>

                                            <div className="text-xs text-white-dark dark:text-gray-500 mt-1">{fix_date(item.create_date)}</div>

                                        </div>

                                        <span className="flex justify-end items-start ltr:ml-auto rtl:mr-auto">

                                            <div className='ltr:pr-10 rtl:pl-10 mt-[.1rem]'>
                                                {
                                                    item.status === 1 ?
                                                    <span className="badge badge-outline-warning bg-warning-light text-[.7rem] group-hover:opacity-100 dark:bg-black">
                                                        Pending
                                                    </span>
                                                    : item.status === 2 ?
                                                    <span className="badge badge-outline-warning bg-warning-light text-[.7rem] group-hover:opacity-100 dark:bg-black">
                                                        Request
                                                    </span>
                                                    : item.status === 3 ?
                                                    <span className="badge badge-outline-danger bg-danger-light text-[.7rem] group-hover:opacity-100 dark:bg-black">
                                                        Cancel
                                                    </span> :
                                                    <span className="badge badge-outline-success bg-success-light text-[.7rem] group-hover:opacity-100 dark:bg-black">
                                                        Confirm
                                                    </span>
                                                }
                                            </div>

                                            <div className='w-[5rem] flex justify-end flex-wrap'>

                                                <span className='text-[.95rem] mb-[1px] px-[1px]'>+{fix_number(item.price)}</span>
                                        
                                                {
                                                    item.paid ?
                                                    <span className="badge badge-outline-success bg-success-light rounded-[2px] scale-[.9] py-[1px] text-[.7rem] group-hover:opacity-100 dark:bg-black">
                                                        Paid
                                                    </span> :
                                                    <span className="badge badge-outline-danger bg-danger-light rounded-[2px] scale-[.9] py-[1px] text-[.7rem] group-hover:opacity-100 dark:bg-black">
                                                        No
                                                    </span>
                                                }

                                            </div>

                                        </span>

                                    </div>

                                )
                            }
                        </div> :
                        <div className='h-[420px] flex flex-col justify-center items-center'>

                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 100 100" opacity='.6'>
                                <path className='fill-success' opacity='.1' d="M87.7,55.7c0.3-0.6,0.6-1.3,0.8-1.9c2.6-7.8-1.3-17.1-9.7-19.3C77.9,23,69.9,15.2,60.8,13.9 
                                    c-10.3-1.5-19.8,5-23,15.5c-3.8-1.3-7.5-1.2-11,0.9c-1.6,0.7-3,1.8-4.3,3.2c-1.9,2.1-3.1,4.7-3.7,7.5c-0.7,0.1-1.5,0.2-2.2,0.5 
                                    c-4,1.4-6.6,4.4-7.3,8.9c-0.4,2.8,0.4,5.6,0.9,6.7c1.9,4.5,6.4,7,11,6.3c0.2,0,0.6,0.1,0.8,0.2c0.2,7.1,3.7,13.4,8.9,17 
                                    c8.3,5.8,19,4,25.8-3.9c2.9,3,6.3,4.4,10.4,3.9c4-0.5,7.1-2.7,9.4-6.3c1.1,0.3,2.1,0.7,3.1,0.8c4,0.4,7.3-1.2,9.7-4.8 
                                    c0.9-1.4,1.8-3.2,1.8-6.4C91.2,60.6,89.9,57.7,87.7,55.7z">
                                </path>
                                <g>
                                    <path fill="#88ae45" stroke="#472b29" strokeMiterlimit="10" strokeWidth="1.4" d="M43,70c0,0-0.1,0-0.1,0c-0.9,0-1.7-0.5-2.2-1.1l-11-14c-1-1.3-0.8-3.2,0.5-4.2c1.3-1,3.2-0.8,4.2,0.5 
                                        l8.8,11.2L69.8,34c1.1-1.2,3-1.3,4.2-0.1c1.2,1.1,1.3,3,0.1,4.2l-29,31C44.6,69.7,43.8,70,43,70z">
                                    </path>
                                    <path fill="#472b29" d="M66.2,42c-0.1,0-0.1,0-0.2-0.1c-0.1-0.1-0.1-0.2,0-0.3l5.1-5.5c0.1-0.1,0.2-0.1,0.3,0c0.1,0.1,0.1,0.2,0,0.3 
                                        L66.4,42C66.4,42,66.3,42,66.2,42z">
                                    </path>
                                    <path fill="#472b29" d="M61.9,46.7c-0.1,0-0.1,0-0.2-0.1c-0.1-0.1-0.1-0.2,0-0.3l2.7-2.9c0.1-0.1,0.2-0.1,0.3,0 
                                        c0.1,0.1,0.1,0.2,0,0.3l-2.7,2.9C62,46.7,62,46.7,61.9,46.7z">
                                    </path>
                                    <path fill="#472b29" d="M43.1,67c-0.1,0-0.1,0-0.2-0.1c-0.1-0.1-0.1-0.2,0-0.3l16.3-17.5c0.1-0.1,0.2-0.1,0.3,0 
                                        c0.1,0.1,0.1,0.2,0,0.3L43.3,66.9C43.2,67,43.1,67,43.1,67z">
                                    </path>
                                </g>
                            </svg>

                            <span className='mt-1 no-select'>No new bookings</span>
                            
                        </div>
                    }
                    
                </div>

                <div className="panel h-full px-0 pb-2">

                    <div className="mb-5 flex items-center px-4 justify-between dark:text-white-light no-select">

                        <h5 className="text-base tracking-wide font-semibold">Recently Users</h5>

                        <div className="dropdown">

                            <Dropdown placement={`${config.dir === 'rtl' ? 'bottom-start' : 'bottom-end'}`}
                                button={
                                    <svg className="h-5 w-5 text-black/70 hover:!text-primary dark:text-white/70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                }>

                                <ul>
                                    <li><button onClick={() => router.push('/guests')} type="button">All Guests</button></li>
                                    <li><button onClick={() => router.push('/owners')} type="button">All Owners</button></li>
                                    <li><button onClick={() => router.push('/admins')} type="button">All Admins</button></li>
                                    <li><button onClick={() => router.push('/reports')} type="button">All Reports</button></li>
                                    <li onClick={delete_users}><button type="button">Mark as Read</button></li>
                                </ul>

                            </Dropdown>

                        </div>

                    </div>
                
                    {
                        admins.length ?
                        <div className="space-y-0 no-select overflow-auto h-[420px]">
                            {
                                admins.map((item, index) =>

                                    <div key={index} onClick={() => router.push(`/${item.role === 1 ? 'admins' : item.role === 2 ? 'owners' : 'guests'}/edit/${item.id}`)} className="pointer flex hover:bg-primary/5 py-3 px-4 items-center">

                                        <div className='rounded-full w-9 h-9 min-w-9 layer-div overflow-hidden all-data'>

                                            <img 
                                                src={`${host}/U${item.id}`} 
                                                onError={(e) => e.target.src = "/media/public/user_icon.png"} 
                                                onLoad={(e) => e.target.src.includes('_icon') ? e.target.classList.add('empty') : e.target.classList.remove('empty')}
                                                className='w-full h-full rounded-full'
                                            />

                                        </div>
                                        
                                        <div className="flex-1 px-3">
                                            
                                            <div className='max-w-[13rem] truncate -mt-[2px]'>{item.name}</div>

                                            {
                                                item.role === 1 ?
                                                <div className="text-xs mt-1 text-danger">Admin</div>
                                                : item.role === 2 ?
                                                <div className="text-xs mt-1 text-primary">Owner</div> :
                                                <div className="text-xs mt-1 text-success">Guest</div>
                                            }

                                        </div>

                                        <span className="flex justify-end items-start ltr:ml-auto rtl:mr-auto">

                                            <span className='text-[.8rem] -mt-[1rem] opacity-[.8]'>{fix_date(item.create_date)}</span>

                                        </span>

                                    </div>

                                )
                            }
                        </div> :
                        <div className='h-[420px] flex flex-col justify-center items-center'>

                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 100 100" opacity='.6'>
                                <path className='fill-success' opacity='.1' d="M87.7,55.7c0.3-0.6,0.6-1.3,0.8-1.9c2.6-7.8-1.3-17.1-9.7-19.3C77.9,23,69.9,15.2,60.8,13.9 
                                    c-10.3-1.5-19.8,5-23,15.5c-3.8-1.3-7.5-1.2-11,0.9c-1.6,0.7-3,1.8-4.3,3.2c-1.9,2.1-3.1,4.7-3.7,7.5c-0.7,0.1-1.5,0.2-2.2,0.5 
                                    c-4,1.4-6.6,4.4-7.3,8.9c-0.4,2.8,0.4,5.6,0.9,6.7c1.9,4.5,6.4,7,11,6.3c0.2,0,0.6,0.1,0.8,0.2c0.2,7.1,3.7,13.4,8.9,17 
                                    c8.3,5.8,19,4,25.8-3.9c2.9,3,6.3,4.4,10.4,3.9c4-0.5,7.1-2.7,9.4-6.3c1.1,0.3,2.1,0.7,3.1,0.8c4,0.4,7.3-1.2,9.7-4.8 
                                    c0.9-1.4,1.8-3.2,1.8-6.4C91.2,60.6,89.9,57.7,87.7,55.7z">
                                </path>
                                <g>
                                    <path fill="#88ae45" stroke="#472b29" strokeMiterlimit="10" strokeWidth="1.4" d="M43,70c0,0-0.1,0-0.1,0c-0.9,0-1.7-0.5-2.2-1.1l-11-14c-1-1.3-0.8-3.2,0.5-4.2c1.3-1,3.2-0.8,4.2,0.5 
                                        l8.8,11.2L69.8,34c1.1-1.2,3-1.3,4.2-0.1c1.2,1.1,1.3,3,0.1,4.2l-29,31C44.6,69.7,43.8,70,43,70z">
                                    </path>
                                    <path fill="#472b29" d="M66.2,42c-0.1,0-0.1,0-0.2-0.1c-0.1-0.1-0.1-0.2,0-0.3l5.1-5.5c0.1-0.1,0.2-0.1,0.3,0c0.1,0.1,0.1,0.2,0,0.3 
                                        L66.4,42C66.4,42,66.3,42,66.2,42z">
                                    </path>
                                    <path fill="#472b29" d="M61.9,46.7c-0.1,0-0.1,0-0.2-0.1c-0.1-0.1-0.1-0.2,0-0.3l2.7-2.9c0.1-0.1,0.2-0.1,0.3,0 
                                        c0.1,0.1,0.1,0.2,0,0.3l-2.7,2.9C62,46.7,62,46.7,61.9,46.7z">
                                    </path>
                                    <path fill="#472b29" d="M43.1,67c-0.1,0-0.1,0-0.2-0.1c-0.1-0.1-0.1-0.2,0-0.3l16.3-17.5c0.1-0.1,0.2-0.1,0.3,0 
                                        c0.1,0.1,0.1,0.2,0,0.3L43.3,66.9C43.2,67,43.1,67,43.1,67z">
                                    </path>
                                </g>
                            </svg>

                            <span className='mt-1 no-select'>No new users</span>
                            
                        </div>
                    }
                    
                </div>

                <div className="panel h-full px-0 pb-2">

                    <div className="mb-5 flex items-center px-4 justify-between dark:text-white-light no-select">

                        <h5 className="text-base tracking-wide font-semibold">Recently Properties</h5>

                        <div className="dropdown">

                            <Dropdown placement={`${config.dir === 'rtl' ? 'bottom-start' : 'bottom-end'}`}
                                button={
                                    <svg className="h-5 w-5 text-black/70 hover:!text-primary dark:text-white/70" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle opacity="0.5" cx="12" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                        <circle cx="19" cy="12" r="2" stroke="currentColor" strokeWidth="1.5" />
                                    </svg>
                                }>

                                <ul>
                                    <li><button onClick={() => router.push('/properties')} type="button">All Properties</button></li>
                                    <li><button onClick={() => router.push('/reports')} type="button">All Reports</button></li>
                                    <li onClick={delete_products}><button type="button">Mark as Read</button></li>
                                </ul>

                            </Dropdown>

                        </div>

                    </div>
                
                    {
                        products.length ?
                        <div className="space-y-0 no-select overflow-auto h-[420px]">
                            {
                                products.map((item, index) =>

                                    <div key={index} onClick={() => router.push(`/properties/edit/${item.id}`)} className="pointer flex hover:bg-primary/5 py-3 px-4 items-center">

                                        <div className='rounded-[.5rem] w-9 h-9 min-w-9 layer-div overflow-hidden all-data'>

                                            <img 
                                                src={`${host}/P${item.id}`} 
                                                onError={(e) => e.target.src = "/media/public/empty_icon.png"} 
                                                onLoad={(e) => e.target.src.includes('_icon') ? e.target.classList.add('empty') : e.target.classList.remove('empty')}
                                                className='w-full h-full rounded-[.5rem]'
                                            />

                                        </div>
                                        
                                        <div className="flex-1 px-3">
                                            
                                            <div className='max-w-[13rem] truncate -mt-[2px]'>{item.name}</div>

                                            <div className="text-xs mt-1 text-base opacity-[.8]">{fix_number(item.new_price)} RAS</div>

                                        </div>

                                        <span className="flex justify-end items-start ltr:ml-auto rtl:mr-auto">

                                            <span className='text-[.8rem] -mt-[1rem] opacity-[.8]'>{fix_date(item.create_date)}</span>

                                        </span>

                                    </div>

                                )
                            }
                        </div> :
                        <div className='h-[420px] flex flex-col justify-center items-center'>

                            <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 100 100" opacity='.6'>
                                <path className='fill-success' opacity='.1' d="M87.7,55.7c0.3-0.6,0.6-1.3,0.8-1.9c2.6-7.8-1.3-17.1-9.7-19.3C77.9,23,69.9,15.2,60.8,13.9 
                                    c-10.3-1.5-19.8,5-23,15.5c-3.8-1.3-7.5-1.2-11,0.9c-1.6,0.7-3,1.8-4.3,3.2c-1.9,2.1-3.1,4.7-3.7,7.5c-0.7,0.1-1.5,0.2-2.2,0.5 
                                    c-4,1.4-6.6,4.4-7.3,8.9c-0.4,2.8,0.4,5.6,0.9,6.7c1.9,4.5,6.4,7,11,6.3c0.2,0,0.6,0.1,0.8,0.2c0.2,7.1,3.7,13.4,8.9,17 
                                    c8.3,5.8,19,4,25.8-3.9c2.9,3,6.3,4.4,10.4,3.9c4-0.5,7.1-2.7,9.4-6.3c1.1,0.3,2.1,0.7,3.1,0.8c4,0.4,7.3-1.2,9.7-4.8 
                                    c0.9-1.4,1.8-3.2,1.8-6.4C91.2,60.6,89.9,57.7,87.7,55.7z">
                                </path>
                                <g>
                                    <path fill="#88ae45" stroke="#472b29" strokeMiterlimit="10" strokeWidth="1.4" d="M43,70c0,0-0.1,0-0.1,0c-0.9,0-1.7-0.5-2.2-1.1l-11-14c-1-1.3-0.8-3.2,0.5-4.2c1.3-1,3.2-0.8,4.2,0.5 
                                        l8.8,11.2L69.8,34c1.1-1.2,3-1.3,4.2-0.1c1.2,1.1,1.3,3,0.1,4.2l-29,31C44.6,69.7,43.8,70,43,70z">
                                    </path>
                                    <path fill="#472b29" d="M66.2,42c-0.1,0-0.1,0-0.2-0.1c-0.1-0.1-0.1-0.2,0-0.3l5.1-5.5c0.1-0.1,0.2-0.1,0.3,0c0.1,0.1,0.1,0.2,0,0.3 
                                        L66.4,42C66.4,42,66.3,42,66.2,42z">
                                    </path>
                                    <path fill="#472b29" d="M61.9,46.7c-0.1,0-0.1,0-0.2-0.1c-0.1-0.1-0.1-0.2,0-0.3l2.7-2.9c0.1-0.1,0.2-0.1,0.3,0 
                                        c0.1,0.1,0.1,0.2,0,0.3l-2.7,2.9C62,46.7,62,46.7,61.9,46.7z">
                                    </path>
                                    <path fill="#472b29" d="M43.1,67c-0.1,0-0.1,0-0.2-0.1c-0.1-0.1-0.1-0.2,0-0.3l16.3-17.5c0.1-0.1,0.2-0.1,0.3,0 
                                        c0.1,0.1,0.1,0.2,0,0.3L43.3,66.9C43.2,67,43.1,67,43.1,67z">
                                    </path>
                                </g>
                            </svg>

                            <span className='mt-1 no-select'>No new properties</span>
                            
                        </div>
                    }
                    
                </div>

            </div>

        </div>

    );

};
