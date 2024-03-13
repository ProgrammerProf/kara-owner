"use client";
import { fix_date, host, matching } from '@/public/script/public';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function Select ({ model, setModel, data, onChange, product, category }) {

    const config = useSelector((state) => state.config);
    const [search, setSearch] = useState('');
    const [items, setItems] = useState([]);

    useEffect(() => {

        let result = data?.filter((item) => 
            matching(`--${item.id}`, search) ||
            matching(item.name, search) ||
            matching(item.email, search) ||
            matching(item.create_date, search) ||
            matching(fix_date(item.create_date), search) ||
            matching(item.price, search) ||
            matching(
                item.role === 1 && item.super ? config.text.super_admin : 
                item.role === 1 && item.supervisor ? config.text.supervisor : 
                item.role === 1 ? config.text.admin : 
                item.role === 2 ? config.text.owner : 
                item.role === 3 ? config.text.guest : '', search
            ) ||
            matching(item.online ? 'online' : 'offline', search)
        );

        setItems(result || []);

    }, [search]);
    useEffect(() => {

        setItems(data || []);

    }, [data]);
    useEffect(() => {

        if ( !model ) setSearch('');

    }, [model]);

    return (

        <Transition appear show={model} as={Fragment}>

            <Dialog as="div" open={model} onClose={() => setModel(false)} className="relative z-50">

                <div className="fixed inset-0 overflow-y-auto bg-[black]/60">

                    <div className="flex min-h-full items-center justify-center px-4 edit-item-info">

                        <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                        
                            <Dialog.Panel className="panel w-full max-w-[27rem] overflow-hidden rounded-lg border-0 p-0 text-black dark:text-white-dark">
                                
                                <button type="button" onClick={() => setModel(false)} className="absolute top-[.85rem] text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>

                                <div className="bg-[#fbfbfb] py-[.85rem] text-[1.05rem] no-select font-medium ltr:pl-5 ltr:pr-[50px] rtl:pr-5 rtl:pl-[50px] dark:bg-[#121c2c]">
                                    { product ? config.text.select_product : category ? config.text.select_category : config.text.select_user }
                                </div>

                                <div className="p-5 min-h-[20rem]">

                                    <div className="relative mb-5 no-select">

                                        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder={config.text.search} className="form-input peer"/>

                                    </div>

                                    <div className="all-data max-h-[30rem] pb-10 overflow-auto no-select">
                                        {
                                            items.length ? items.map((item, index) => 

                                                <div key={index} onClick={() => { setModel(false); onChange(item.id); }} className="flex border-t items-start border-[#e0e6ed] dark:border-[#1b2e4b] hover:bg-[#eee] dark:hover:bg-[#eee]/10 pointer contact-item" style={{ padding: '.6rem .5rem' }}>
                                                    
                                                    <div className="ltr:mr-3 rtl:ml-3 mt-1 layer-div">

                                                        <img 
                                                            src={product ? `${host}/P${item.image}` : category ? `${host}/C${item.id}` : `${host}/U${item.id}`} 
                                                            onError={(e) => product || category ? e.target.src = "/media/public/error_icon.png" : e.target.src = "/media/public/user_icon.png"} 
                                                            onLoad={(e) => e.target.src.includes('_icon') ? e.target.classList.add('empty') : e.target.classList.remove('empty')}
                                                            className={`w-10 h-10 object-cover ${(product || category) ? 'rounded-[.5rem]' : 'rounded-full'} bg-black bg-opacity-25`}
                                                        />

                                                    </div>

                                                    <div className="flex-1 font-semibold max-w[80%]">
                                                        
                                                        <h6 className="text-base name text-[.9rem]">
                                                            
                                                            <p className='line-clamp-2 text-ellipsis'>
                                                                {item.name}
                                                            </p>
                                                            
                                                        </h6>
                                                        
                                                        <div className="flex text-xs tell text-[.7rem] mt-[3px] opacity-[.8]">
                                                            
                                                            {
                                                                ( !product && !category ) &&
                                                                <p className='ltr:mr-2 rtl:ml-2'>
                                                                    {
                                                                        item.role === 1 && item.super ?
                                                                        <span className='text-[.7rem] text-danger'>{config.text.super_admin}</span>
                                                                        : item.role === 1 && item.supervisor ?
                                                                        <span className='text-[.7rem] text-danger'>{config.text.supervisor}</span>
                                                                        : item.role === 1 ?
                                                                        <span className='text-[.7rem] text-danger'>{config.text.admin}</span>
                                                                        : item.role === 2 ?
                                                                        <span className='text-[.7rem] text-primary'>{config.text.owner}</span> :
                                                                        <span className='text-[.7rem] text-success'>{config.text.guest}</span>
                                                                    }
                                                                </p>
                                                            }
                                                            { product ? `${item.new_price || 0.0} ${config.text.currency} ~ ${fix_date(item.create_date)}` : fix_date(item.create_date) }
                                                        
                                                        </div>

                                                    </div>

                                                </div>

                                            ) :
                                            <div className="w-full">

                                                <div className="h-px w-full border-b border-[#e0e6ed] dark:border-[#1b2e4b]"></div>
                                                
                                                <div className="w-full flex justify-center items-center py-10 no-select">

                                                    <p className='text-[.8rem]'>{config.text.no_data}</p>

                                                </div>

                                            </div>
                                        }
                                    </div>

                                </div>

                            </Dialog.Panel>

                        </Transition.Child>

                    </div>

                </div>

            </Dialog>

        </Transition>

    );

};
