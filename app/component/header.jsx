"use client";
import { toggle_lang, toggle_theme, toggle_side, toggle_setting, toggle_user } from '@/public/script/store';
import { date, host } from '@/public/script/public';
import Dropdown from '@/app/component/menu';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Header ({ auth }) {

    const router = useRouter();
    const dispatch = useDispatch();
    const config = useSelector((state) => state.config);
    const isRtl = config.dir === 'rtl' ? true : false;
    const [lang, setLang] = useState(config.lang);
    const [notifications, setNotifications] = useState([]);

    const removeNotification = (value) => {
        
        setNotifications(notifications.filter((user) => user.id !== value));
    
    };
    return (

        <header className={config.semidark && config.menu === 'horizontal' ? 'dark' : ''}>
            {
                auth ?
                <div className="shadow-sm no-select">

                    <div className="relative flex w-full items-center bg-white px-5 py-2.5 dark:bg-black">

                        <div className="horizontal-logo flex items-center justify-between ltr:mr-2 rtl:ml-2 lg:hidden">

                            <button type="button" onClick={() => dispatch(toggle_side())} className="collapse-icon flex flex-none rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary ltr:mr-2 rtl:ml-2 dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary lg:hidden">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 7L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path opacity="0.5" d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    <path d="M20 17L4 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                            </button>

                            <Link href="/" className="main-logo flex items-center shrink-0 px-2 hidden lg:flex">

                                {/* <img className="w-5 rtl:ml-3 ltr:mr-3 flex-none" src="/media/public/logo.svg"/> */}

                                <span className="text-2xl font-semibold align-middle lg:inline dark:text-white-dark" style={{fontSize: "1.2rem", marginTop: "0"}}>
                                    <span className='text-primary'>{config.text.logo1}</span> <span className='text-danger'>{config.text.logo2}</span>
                                </span>

                            </Link>

                        </div>

                        <div className="flex items-center space-x-1.5 ltr:ml-auto rtl:mr-auto rtl:space-x-reverse dark:text-[#d0d2d6] sm:flex-1 ltr:sm:ml-0 sm:rtl:mr-0 lg:space-x-2">
                            
                            <div className="sm:ltr:mr-auto sm:rtl:ml-auto"></div>
                            <div className="flex items-center space-x-2 rtl:space-x-reverse px-2">
                                <div>

                                    <button className='flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                                        onClick={() => dispatch(toggle_setting())}>
                                        <svg className="animate-[spin_3s_linear_infinite]" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"></circle>
                                            <path opacity="0.5" d="M13.7654 2.15224C13.3978 2 12.9319 2 12 2C11.0681 2 10.6022 2 10.2346 2.15224C9.74457 2.35523 9.35522 2.74458 9.15223 3.23463C9.05957 3.45834 9.0233 3.7185 9.00911 4.09799C8.98826 4.65568 8.70226 5.17189 8.21894 5.45093C7.73564 5.72996 7.14559 5.71954 6.65219 5.45876C6.31645 5.2813 6.07301 5.18262 5.83294 5.15102C5.30704 5.08178 4.77518 5.22429 4.35436 5.5472C4.03874 5.78938 3.80577 6.1929 3.33983 6.99993C2.87389 7.80697 2.64092 8.21048 2.58899 8.60491C2.51976 9.1308 2.66227 9.66266 2.98518 10.0835C3.13256 10.2756 3.3397 10.437 3.66119 10.639C4.1338 10.936 4.43789 11.4419 4.43786 12C4.43783 12.5581 4.13375 13.0639 3.66118 13.3608C3.33965 13.5629 3.13248 13.7244 2.98508 13.9165C2.66217 14.3373 2.51966 14.8691 2.5889 15.395C2.64082 15.7894 2.87379 16.193 3.33973 17C3.80568 17.807 4.03865 18.2106 4.35426 18.4527C4.77508 18.7756 5.30694 18.9181 5.83284 18.8489C6.07289 18.8173 6.31632 18.7186 6.65204 18.5412C7.14547 18.2804 7.73556 18.27 8.2189 18.549C8.70224 18.8281 8.98826 19.3443 9.00911 19.9021C9.02331 20.2815 9.05957 20.5417 9.15223 20.7654C9.35522 21.2554 9.74457 21.6448 10.2346 21.8478C10.6022 22 11.0681 22 12 22C12.9319 22 13.3978 22 13.7654 21.8478C14.2554 21.6448 14.6448 21.2554 14.8477 20.7654C14.9404 20.5417 14.9767 20.2815 14.9909 19.902C15.0117 19.3443 15.2977 18.8281 15.781 18.549C16.2643 18.2699 16.8544 18.2804 17.3479 18.5412C17.6836 18.7186 17.927 18.8172 18.167 18.8488C18.6929 18.9181 19.2248 18.7756 19.6456 18.4527C19.9612 18.2105 20.1942 17.807 20.6601 16.9999C21.1261 16.1929 21.3591 15.7894 21.411 15.395C21.4802 14.8691 21.3377 14.3372 21.0148 13.9164C20.8674 13.7243 20.6602 13.5628 20.3387 13.3608C19.8662 13.0639 19.5621 12.558 19.5621 11.9999C19.5621 11.4418 19.8662 10.9361 20.3387 10.6392C20.6603 10.4371 20.8675 10.2757 21.0149 10.0835C21.3378 9.66273 21.4803 9.13087 21.4111 8.60497C21.3592 8.21055 21.1262 7.80703 20.6602 7C20.1943 6.19297 19.9613 5.78945 19.6457 5.54727C19.2249 5.22436 18.693 5.08185 18.1671 5.15109C17.9271 5.18269 17.6837 5.28136 17.3479 5.4588C16.8545 5.71959 16.2644 5.73002 15.7811 5.45096C15.2977 5.17191 15.0117 4.65566 14.9909 4.09794C14.9767 3.71848 14.9404 3.45833 14.8477 3.23463C14.6448 2.74458 14.2554 2.35523 13.7654 2.15224Z" stroke="currentColor" strokeWidth="1.5"></path>
                                        </svg>
                                    </button>

                                </div>
                                <div className="dropdown shrink-0">

                                    <Dropdown offset={[0, 8]} placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                        btnClassName="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                                        button={lang && <img className="h-5 w-5 rounded-full object-cover" src={`/media/public/flags/${lang.toUpperCase()}.svg`} alt="flag" />}>
                                        
                                        <ul className="langs-list grid w-[280px] grid-cols-2 gap-2 !px-2 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                                            {
                                                config.langs_list.map((item) =>

                                                    <li key={item.code}>

                                                        <button type="button" className={`flex w-full hover:text-primary ${lang === item.code ? 'bg-primary/10 text-primary' : ''}`}
                                                            onClick={() => { dispatch(toggle_lang(item.code)); setLang(item.code); }}>
                                                            <img src={`/media/public/flags/${item.code.toUpperCase()}.svg`} alt="flag" className="h-5 w-5 rounded-full object-cover" />
                                                            <span className="ltr:ml-3 rtl:mr-3">{config.text[item.code]}</span>
                                                        </button>

                                                    </li>

                                                )
                                            }
                                        </ul>

                                    </Dropdown>

                                </div>
                                <div className="dropdown shrink-0">

                                    <Dropdown offset={[0, 8]} placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`} btnClassName="relative block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                                        button={
                                            <span>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path stroke="currentColor" strokeWidth="1.5" d="M19.0001 9.7041V9C19.0001 5.13401 15.8661 2 12.0001 2C8.13407 2 5.00006 5.13401 5.00006 9V9.7041C5.00006 10.5491 4.74995 11.3752 4.28123 12.0783L3.13263 13.8012C2.08349 15.3749 2.88442 17.5139 4.70913 18.0116C9.48258 19.3134 14.5175 19.3134 19.291 18.0116C21.1157 17.5139 21.9166 15.3749 20.8675 13.8012L19.7189 12.0783C19.2502 11.3752 19.0001 10.5491 19.0001 9.7041Z"/>
                                                    <path d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    <path d="M12 6V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                                <span className="absolute top-0 flex h-3 w-3 ltr:right-0 rtl:left-0">
                                                    <span className="absolute -top-[3px] inline-flex h-full w-full animate-ping rounded-full bg-success/50 opacity-75 ltr:-left-[3px] rtl:-right-[3px]"></span>
                                                    <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-success"></span>
                                                </span>
                                            </span>
                                        }>
                                        
                                        <ul className="w-[300px] !py-0 text-xs text-dark dark:text-white-dark sm:w-[320px]">

                                            <li className="" onClick={(e) => e.stopPropagation()}>

                                                <div className="relative !h-[55px] w-full overflow-hidden rounded-t-md p-5 text-white hover:!bg-transparent">
                                                    
                                                    <div className="bg- absolute inset-0 h-full w-full bg-[url(/media/public/menu-heade.jpg)] bg-cover bg-center bg-no-repeat"></div>
                                                    
                                                    <h4 className="relative z-10 text-[.95rem] font-semibold">{config.text.notifications}</h4>

                                                </div>

                                            </li>

                                            {
                                                notifications.length > 0 ? 
                                                <li>
                                                    <li onClick={(e) => e.stopPropagation()}>
                                                        {
                                                            notifications.map((item) =>

                                                                <div key={item.id} className="flex items-center py-3 px-5 pointer hover:bg-primary/10">

                                                                    <div dangerouslySetInnerHTML={{__html: item.image}}></div>
                                                                    <span className="px-3 dark:text-gray-500">
                                                                        <div className="text-sm font-semibold dark:text-white-light/90">{item.title}</div>
                                                                        <div>{item.message}</div>
                                                                    </span>
                                                                    <span className="whitespace-pre rounded bg-white-dark/20 px-1 font-semibold text-dark/60 ltr:ml-auto ltr:mr-2 rtl:mr-auto rtl:ml-2 dark:text-white-dark">
                                                                        {item.time}
                                                                    </span>
                                                                    <button type="button" className="text-neutral-300 hover:text-danger" onClick={() => removeNotification(item.id)}>
                                                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                                            <circle opacity="0.7" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                                                                            <path d="M14.5 9.50002L9.5 14.5M9.49998 9.5L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                                        </svg>
                                                                    </button>

                                                                </div>

                                                            )
                                                        }
                                                    </li>
                                                    <li className="mt-5 border-t border-white-light text-center dark:border-white/10">

                                                        <button type="button" className="group !h-[48px] justify-center !py-4 font-semibold text-primary dark:text-gray-400">
                                                            
                                                            <span className="ltr:mr-1 rtl:ml-1 text-[.85rem]">{config.text.view_all_activities}</span>
                                                            
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" className="h-4 w-4 transition duration-300 group-hover:translate-x-2 rtl:rotate-[180deg] rtl:group-hover:translate-x-[-10px] ltr:ml-1 rtl:mr-1">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                                                            </svg>

                                                        </button>

                                                    </li>
                                                </li> : 
                                                <li className="mb-10" onClick={(e) => e.stopPropagation()}>
                                                                                            
                                                    <div className="default !grid min-h-[200px] place-content-center text-[.9rem] hover:!bg-transparent">
                                                        
                                                        <div className="mx-auto mb-4 rounded-full text-white ring-4 ring-primary/30">
                                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="#a9abb6" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" className="feather feather-info rounded-full bg-primary">
                                                                <line x1="12" y1="16" x2="12" y2="12"></line>
                                                                <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                                            </svg>
                                                        </div>
    
                                                        {config.text.no_data}
    
                                                    </div>
    
                                                </li>
                                            }

                                        </ul>
                                        
                                    </Dropdown>

                                </div>
                                <div>
                                    {
                                        config.theme === 'light' ?
                                        <button className='flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                                            onClick={() => dispatch(toggle_theme('dark'))}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
                                                <path d="M12 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                <path d="M12 20V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                <path d="M4 12L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                <path d="M22 12L20 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                <path opacity="0.5" d="M19.7778 4.22266L17.5558 6.25424" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                <path opacity="0.5" d="M4.22217 4.22266L6.44418 6.25424" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                <path opacity="0.5" d="M6.44434 17.5557L4.22211 19.7779" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                <path opacity="0.5" d="M19.7778 19.7773L17.5558 17.5551" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                        </button> :
                                        <button className='flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                                            onClick={() => dispatch(toggle_theme('light'))}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill="currentColor" d="M21.0672 11.8568L20.4253 11.469L21.0672 11.8568ZM12.1432 2.93276L11.7553 2.29085V2.29085L12.1432 2.93276ZM21.25 12C21.25 17.1086 17.1086 21.25 12 21.25V22.75C17.9371 22.75 22.75 17.9371 22.75 12H21.25ZM12 21.25C6.89137 21.25 2.75 17.1086 2.75 12H1.25C1.25 17.9371 6.06294 22.75 12 22.75V21.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75V1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75ZM15.5 14.25C12.3244 14.25 9.75 11.6756 9.75 8.5H8.25C8.25 12.5041 11.4959 15.75 15.5 15.75V14.25ZM20.4253 11.469C19.4172 13.1373 17.5882 14.25 15.5 14.25V15.75C18.1349 15.75 20.4407 14.3439 21.7092 12.2447L20.4253 11.469ZM9.75 8.5C9.75 6.41182 10.8627 4.5828 12.531 3.57467L11.7553 2.29085C9.65609 3.5593 8.25 5.86509 8.25 8.5H9.75ZM12 2.75C11.9115 2.75 11.8077 2.71008 11.7324 2.63168C11.6686 2.56527 11.6538 2.50244 11.6503 2.47703C11.6461 2.44587 11.6482 2.35557 11.7553 2.29085L12.531 3.57467C13.0342 3.27065 13.196 2.71398 13.1368 2.27627C13.0754 1.82126 12.7166 1.25 12 1.25V2.75ZM21.7092 12.2447C21.6444 12.3518 21.5541 12.3539 21.523 12.3497C21.4976 12.3462 21.4347 12.3314 21.3683 12.2676C21.2899 12.1923 21.25 12.0885 21.25 12H22.75C22.75 11.2834 22.1787 10.9246 21.7237 10.8632C21.286 10.804 20.7293 10.9658 20.4253 11.469L21.7092 12.2447Z"/>
                                            </svg>
                                        </button>
                                    }
                                </div>
                            </div>
                            <div className="dropdown flex shrink-0 all-data">

                                <Dropdown offset={[0, 8]} placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`} btnClassName="relative group block"
                                    button={
                                        <img 
                                            src={`${host}/U${config.user.id}?${config.user.update}`} 
                                            onError={(e) => e.target.src = "/media/public/user_icon.png"} 
                                            onLoad={(e) => e.target.src.includes('_icon') ? e.target.classList.add('empty') : e.target.classList.remove('empty')}
                                            className="h-[2.25rem] w-[2.25rem] rounded-full saturate-50 group-hover:saturate-100"
                                        />
                                    }>
                                    
                                    <ul className="w-[230px] !py-0 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                                        
                                        <li>

                                            <div className="flex items-center mb-2 px-4 py-3 border-b border-white-light dark:border-white-light/10">
                                                
                                                <img 
                                                    src={`${host}/U${config.user.id}?${config.user.update}`} 
                                                    onError={(e) => e.target.src = "/media/public/user_icon.png"} 
                                                    onLoad={(e) => e.target.src.includes('_icon') ? e.target.classList.add('empty') : e.target.classList.remove('empty')}
                                                    className="h-[1.5rem] w-[1.5rem] rounded-full object-cover"
                                                />
                                                
                                                <div className="ltr:pl-3 rtl:pr-3 w-[10rem]">

                                                    <h4 className="text-base truncate w-full -mt-[1px]">
                                                        {config.user.name}
                                                    </h4>

                                                </div>

                                            </div>

                                        </li>
                                        <li>

                                            <button onClick={() => router.push('/account')} type='button' className="dark:hover:text-white">

                                                <svg className="ltr:mr-2 rtl:ml-2" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                                                    <path opacity="0.5" stroke="currentColor" strokeWidth="1.5" d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 12 13C16.4183 13 20 15.0147 20 17.5Z"/>
                                                </svg>

                                                {config.text.account}

                                            </button>

                                        </li>
                                        {
                                            config.user.chat &&
                                            <li>

                                                <button onClick={() => router.push('/chat')} type='button' className="dark:hover:text-white">

                                                    <svg className="ltr:mr-2 rtl:ml-2" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.4036 22.4797L10.6787 22.015C11.1195 21.2703 11.3399 20.8979 11.691 20.6902C12.0422 20.4825 12.5001 20.4678 13.4161 20.4385C14.275 20.4111 14.8523 20.3361 15.3458 20.1317C16.385 19.7012 17.2106 18.8756 17.641 17.8365C17.9639 17.0571 17.9639 16.0691 17.9639 14.093V13.2448C17.9639 10.4683 17.9639 9.08006 17.3389 8.06023C16.9892 7.48958 16.5094 7.0098 15.9388 6.66011C14.919 6.03516 13.5307 6.03516 10.7542 6.03516H8.20964C5.43314 6.03516 4.04489 6.03516 3.02507 6.66011C2.45442 7.0098 1.97464 7.48958 1.62495 8.06023C1 9.08006 1 10.4683 1 13.2448V14.093C1 16.0691 1 17.0571 1.32282 17.8365C1.75326 18.8756 2.57886 19.7012 3.61802 20.1317C4.11158 20.3361 4.68882 20.4111 5.5477 20.4385C6.46368 20.4678 6.92167 20.4825 7.27278 20.6902C7.6239 20.8979 7.84431 21.2703 8.28514 22.015L8.5602 22.4797C8.97002 23.1721 9.9938 23.1721 10.4036 22.4797ZM13.1928 14.5171C13.7783 14.5171 14.253 14.0424 14.253 13.4568C14.253 12.8713 13.7783 12.3966 13.1928 12.3966C12.6072 12.3966 12.1325 12.8713 12.1325 13.4568C12.1325 14.0424 12.6072 14.5171 13.1928 14.5171ZM10.5422 13.4568C10.5422 14.0424 10.0675 14.5171 9.48193 14.5171C8.89637 14.5171 8.42169 14.0424 8.42169 13.4568C8.42169 12.8713 8.89637 12.3966 9.48193 12.3966C10.0675 12.3966 10.5422 12.8713 10.5422 13.4568ZM5.77108 14.5171C6.35664 14.5171 6.83133 14.0424 6.83133 13.4568C6.83133 12.8713 6.35664 12.3966 5.77108 12.3966C5.18553 12.3966 4.71084 12.8713 4.71084 13.4568C4.71084 14.0424 5.18553 14.5171 5.77108 14.5171Z" fill="currentColor"></path>
                                                        <path opacity="0.5" d="M15.486 1C16.7529 0.999992 17.7603 0.999986 18.5683 1.07681C19.3967 1.15558 20.0972 1.32069 20.7212 1.70307C21.3632 2.09648 21.9029 2.63623 22.2963 3.27821C22.6787 3.90219 22.8438 4.60265 22.9226 5.43112C22.9994 6.23907 22.9994 7.24658 22.9994 8.51343V9.37869C22.9994 10.2803 22.9994 10.9975 22.9597 11.579C22.9191 12.174 22.8344 12.6848 22.6362 13.1632C22.152 14.3323 21.2232 15.2611 20.0541 15.7453C20.0249 15.7574 19.9955 15.7691 19.966 15.7804C19.8249 15.8343 19.7039 15.8806 19.5978 15.915H17.9477C17.9639 15.416 17.9639 14.8217 17.9639 14.093V13.2448C17.9639 10.4683 17.9639 9.08006 17.3389 8.06023C16.9892 7.48958 16.5094 7.0098 15.9388 6.66011C14.919 6.03516 13.5307 6.03516 10.7542 6.03516H8.20964C7.22423 6.03516 6.41369 6.03516 5.73242 6.06309V4.4127C5.76513 4.29934 5.80995 4.16941 5.86255 4.0169C5.95202 3.75751 6.06509 3.51219 6.20848 3.27821C6.60188 2.63623 7.14163 2.09648 7.78361 1.70307C8.40759 1.32069 9.10805 1.15558 9.93651 1.07681C10.7445 0.999986 11.7519 0.999992 13.0188 1H15.486Z" fill="currentColor"></path>
                                                    </svg>

                                                    {config.text.chat_box}

                                                </button>

                                            </li>
                                        }
                                        <li>

                                            <button onClick={() => dispatch(toggle_user({...config.user, logged: false, update: date()}))} type='button' className="dark:hover:text-white">
                                                
                                                <svg className="ltr:mr-2 rtl:ml-2 -mt-[1px]" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path stroke="currentColor" strokeWidth="1.5" d="M2 16C2 13.1716 2 11.7574 2.87868 10.8787C3.75736 10 5.17157 10 8 10H16C18.8284 10 20.2426 10 21.1213 10.8787C22 11.7574 22 13.1716 22 16C22 18.8284 22 20.2426 21.1213 21.1213C20.2426 22 18.8284 22 16 22H8C5.17157 22 3.75736 22 2.87868 21.1213C2 20.2426 2 18.8284 2 16Z"/>
                                                    <path opacity="0.5" d="M6 10V8C6 4.68629 8.68629 2 12 2C15.3137 2 18 4.68629 18 8V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    <g opacity="0.5">
                                                        <path d="M9 16C9 16.5523 8.55228 17 8 17C7.44772 17 7 16.5523 7 16C7 15.4477 7.44772 15 8 15C8.55228 15 9 15.4477 9 16Z" fill="currentColor" />
                                                        <path fill="currentColor" d="M13 16C13 16.5523 12.5523 17 12 17C11.4477 17 11 16.5523 11 16C11 15.4477 11.4477 15 12 15C12.5523 15 13 15.4477 13 16Z"/>
                                                        <path fill="currentColor" d="M17 16C17 16.5523 16.5523 17 16 17C15.4477 17 15 16.5523 15 16C15 15.4477 15.4477 15 16 15C16.5523 15 17 15.4477 17 16Z"/>
                                                    </g>
                                                </svg>

                                                {config.text.lockscreen}

                                            </button>

                                        </li>
                                        <li className="mt-2 border-t border-white-light dark:border-white-light/10">

                                            <button onClick={() => dispatch(toggle_user({}))} type='button' className="!py-3 text-danger">

                                                <svg className="rotate-90 ltr:mr-2 rtl:ml-2" width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path opacity="0.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" d="M17 9.00195C19.175 9.01406 20.3529 9.11051 21.1213 9.8789C22 10.7576 22 12.1718 22 15.0002V16.0002C22 18.8286 22 20.2429 21.1213 21.1215C20.2426 22.0002 18.8284 22.0002 16 22.0002H8C5.17157 22.0002 3.75736 22.0002 2.87868 21.1215C2 20.2429 2 18.8286 2 16.0002L2 15.0002C2 12.1718 2 10.7576 2.87868 9.87889C3.64706 9.11051 4.82497 9.01406 7 9.00195"/>
                                                    <path d="M12 15L12 2M12 2L15 5.5M12 2L9 5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>

                                                {config.text.logout}

                                            </button>

                                        </li>

                                    </ul>

                                </Dropdown>

                            </div>

                        </div>

                    </div>

                    <ul className="horizontal-menu hidden border-t border-[#ebedf2] bg-white py-1.5 px-6 font-semibold text-black rtl:space-x-reverse dark:border-[#191e3a] dark:bg-black dark:text-white-dark lg:space-x-2 ">

                        {
                            config.user.id &&
                            <li className="nav-item relative">

                                <Link href="/" className="nav-link">

                                    <div className="flex items-center">

                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path opacity="0.5" d="M6.22209 4.60105C6.66665 4.304 7.13344 4.04636 7.6171 3.82976C8.98898 3.21539 9.67491 2.9082 10.5875 3.4994C11.5 4.09061 11.5 5.06041 11.5 7.00001V8.50001C11.5 10.3856 11.5 11.3284 12.0858 11.9142C12.6716 12.5 13.6144 12.5 15.5 12.5H17C18.9396 12.5 19.9094 12.5 20.5006 13.4125C21.0918 14.3251 20.7846 15.011 20.1702 16.3829C19.9536 16.8666 19.696 17.3334 19.399 17.7779C18.3551 19.3402 16.8714 20.5578 15.1355 21.2769C13.3996 21.9959 11.4895 22.184 9.64665 21.8175C7.80383 21.4509 6.11109 20.5461 4.78249 19.2175C3.45389 17.8889 2.5491 16.1962 2.18254 14.3534C1.81598 12.5105 2.00412 10.6004 2.72315 8.86451C3.44218 7.12861 4.65982 5.64492 6.22209 4.60105Z" fill="currentColor"></path>
                                            <path d="M21.446 7.06901C20.6342 5.00831 18.9917 3.36579 16.931 2.55398C15.3895 1.94669 14 3.34316 14 5.00002V9.00002C14 9.5523 14.4477 10 15 10H19C20.6569 10 22.0533 8.61055 21.446 7.06901Z" fill="currentColor"></path>
                                        </svg>

                                        <span className="px-2">{config.text.dashboard}</span>

                                    </div>

                                </Link>

                            </li>
                        }
                        {
                            config.user.chat &&
                            <li className="nav-item relative">

                                <Link href="/chat" className="nav-link">

                                    <div className="flex items-center">

                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M10.4036 22.4797L10.6787 22.015C11.1195 21.2703 11.3399 20.8979 11.691 20.6902C12.0422 20.4825 12.5001 20.4678 13.4161 20.4385C14.275 20.4111 14.8523 20.3361 15.3458 20.1317C16.385 19.7012 17.2106 18.8756 17.641 17.8365C17.9639 17.0571 17.9639 16.0691 17.9639 14.093V13.2448C17.9639 10.4683 17.9639 9.08006 17.3389 8.06023C16.9892 7.48958 16.5094 7.0098 15.9388 6.66011C14.919 6.03516 13.5307 6.03516 10.7542 6.03516H8.20964C5.43314 6.03516 4.04489 6.03516 3.02507 6.66011C2.45442 7.0098 1.97464 7.48958 1.62495 8.06023C1 9.08006 1 10.4683 1 13.2448V14.093C1 16.0691 1 17.0571 1.32282 17.8365C1.75326 18.8756 2.57886 19.7012 3.61802 20.1317C4.11158 20.3361 4.68882 20.4111 5.5477 20.4385C6.46368 20.4678 6.92167 20.4825 7.27278 20.6902C7.6239 20.8979 7.84431 21.2703 8.28514 22.015L8.5602 22.4797C8.97002 23.1721 9.9938 23.1721 10.4036 22.4797ZM13.1928 14.5171C13.7783 14.5171 14.253 14.0424 14.253 13.4568C14.253 12.8713 13.7783 12.3966 13.1928 12.3966C12.6072 12.3966 12.1325 12.8713 12.1325 13.4568C12.1325 14.0424 12.6072 14.5171 13.1928 14.5171ZM10.5422 13.4568C10.5422 14.0424 10.0675 14.5171 9.48193 14.5171C8.89637 14.5171 8.42169 14.0424 8.42169 13.4568C8.42169 12.8713 8.89637 12.3966 9.48193 12.3966C10.0675 12.3966 10.5422 12.8713 10.5422 13.4568ZM5.77108 14.5171C6.35664 14.5171 6.83133 14.0424 6.83133 13.4568C6.83133 12.8713 6.35664 12.3966 5.77108 12.3966C5.18553 12.3966 4.71084 12.8713 4.71084 13.4568C4.71084 14.0424 5.18553 14.5171 5.77108 14.5171Z" fill="currentColor"></path>
                                            <path opacity="0.5" d="M15.486 1C16.7529 0.999992 17.7603 0.999986 18.5683 1.07681C19.3967 1.15558 20.0972 1.32069 20.7212 1.70307C21.3632 2.09648 21.9029 2.63623 22.2963 3.27821C22.6787 3.90219 22.8438 4.60265 22.9226 5.43112C22.9994 6.23907 22.9994 7.24658 22.9994 8.51343V9.37869C22.9994 10.2803 22.9994 10.9975 22.9597 11.579C22.9191 12.174 22.8344 12.6848 22.6362 13.1632C22.152 14.3323 21.2232 15.2611 20.0541 15.7453C20.0249 15.7574 19.9955 15.7691 19.966 15.7804C19.8249 15.8343 19.7039 15.8806 19.5978 15.915H17.9477C17.9639 15.416 17.9639 14.8217 17.9639 14.093V13.2448C17.9639 10.4683 17.9639 9.08006 17.3389 8.06023C16.9892 7.48958 16.5094 7.0098 15.9388 6.66011C14.919 6.03516 13.5307 6.03516 10.7542 6.03516H8.20964C7.22423 6.03516 6.41369 6.03516 5.73242 6.06309V4.4127C5.76513 4.29934 5.80995 4.16941 5.86255 4.0169C5.95202 3.75751 6.06509 3.51219 6.20848 3.27821C6.60188 2.63623 7.14163 2.09648 7.78361 1.70307C8.40759 1.32069 9.10805 1.15558 9.93651 1.07681C10.7445 0.999986 11.7519 0.999992 13.0188 1H15.486Z" fill="currentColor"></path>
                                        </svg>

                                        <span className="px-2">{config.text.chat_box}</span>

                                    </div>

                                </Link>

                            </li>
                        }
                        {
                            config.user.id &&
                            <li className="nav-item relative">

                                <Link href="/account" className="nav-link">

                                    <div className="flex items-center">

                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"></circle>
                                            <path stroke="currentColor" strokeWidth="1.5" d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 
                                                12 13C16.4183 13 20 15.0147 20 17.5Z">
                                            </path>
                                        </svg>

                                        <span className="px-2">{config.text.account}</span>

                                    </div>

                                </Link>

                            </li>
                        }
                        {
                            config.user.see_products &&
                            <li className="nav-item relative">

                                <Link href="/properties" className="nav-link">

                                    <div className="flex items-center">

                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='scale-[.9] -mt-[3px]'>
                                            <path d="M9.5 21.5V18.5C9.5 17.5654 9.5 17.0981 9.70096 16.75C9.83261 16.522 10.022 16.3326 10.25 16.201C10.5981 16 11.0654 16 12 16C12.9346 16 13.4019 16 13.75 16.201C13.978 16.3326 14.1674 16.522 14.299 16.75C14.5 17.0981 14.5 17.5654 14.5 18.5V21.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <path d="M21 22H9M3 22H5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <path d="M19 22V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <path d="M5 22V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <path d="M11.9999 2H7.47214C6.26932 2 5.66791 2 5.18461 2.2987C4.7013 2.5974 4.43234 3.13531 3.89443 4.21114L2.49081 7.75929C2.16652 8.57905 1.88279 9.54525 2.42867 10.2375C2.79489 10.7019 3.36257 11 3.99991 11C5.10448 11 5.99991 10.1046 5.99991 9C5.99991 10.1046 6.89534 11 7.99991 11C9.10448 11 9.99991 10.1046 9.99991 9C9.99991 10.1046 10.8953 11 11.9999 11C13.1045 11 13.9999 10.1046 13.9999 9C13.9999 10.1046 14.8953 11 15.9999 11C17.1045 11 17.9999 10.1046 17.9999 9C17.9999 10.1046 18.8953 11 19.9999 11C20.6373 11 21.205 10.7019 21.5712 10.2375C22.1171 9.54525 21.8334 8.57905 21.5091 7.75929L20.1055 4.21114C19.5676 3.13531 19.2986 2.5974 18.8153 2.2987C18.332 2 17.7306 2 16.5278 2H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                        </svg>

                                        <span className="px-2">{config.text.products}</span>
                                    
                                    </div>

                                </Link>

                            </li>
                        }
                        {
                            config.user.see_coupons &&
                            <li className="nav-item relative">

                                <Link href="/coupons" className="nav-link">

                                    <div className="flex items-center">
                                        
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M11.1459 7.02251C11.5259 6.34084 11.7159 6 12 6C12.2841 6 12.4741 6.34084 12.8541 7.02251L12.9524 7.19887C13.0603 7.39258 13.1143 7.48944 13.1985 7.55334C13.2827 7.61725 13.3875 7.64097 13.5972 7.68841L13.7881 7.73161C14.526 7.89857 14.895 7.98205 14.9828 8.26432C15.0706 8.54659 14.819 8.84072 14.316 9.42898L14.1858 9.58117C14.0429 9.74833 13.9714 9.83191 13.9392 9.93531C13.9071 10.0387 13.9179 10.1502 13.9395 10.3733L13.9592 10.5763C14.0352 11.3612 14.0733 11.7536 13.8435 11.9281C13.6136 12.1025 13.2682 11.9435 12.5773 11.6254L12.3986 11.5431C12.2022 11.4527 12.1041 11.4075 12 11.4075C11.8959 11.4075 11.7978 11.4527 11.6014 11.5431L11.4227 11.6254C10.7318 11.9435 10.3864 12.1025 10.1565 11.9281C9.92674 11.7536 9.96476 11.3612 10.0408 10.5763L10.0605 10.3733C10.0821 10.1502 10.0929 10.0387 10.0608 9.93531C10.0286 9.83191 9.95713 9.74833 9.81418 9.58117L9.68403 9.42898C9.18097 8.84072 8.92945 8.54659 9.01723 8.26432C9.10501 7.98205 9.47396 7.89857 10.2119 7.73161L10.4028 7.68841C10.6125 7.64097 10.7173 7.61725 10.8015 7.55334C10.8857 7.48944 10.9397 7.39258 11.0476 7.19887L11.1459 7.02251Z" stroke="currentColor" strokeWidth="1.5"></path>
                                            <path d="M19 9C19 12.866 15.866 16 12 16C8.13401 16 5 12.866 5 9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9Z" stroke="currentColor" strokeWidth="1.5"></path>
                                            <path d="M12 16.0678L8.22855 19.9728C7.68843 20.5321 7.41837 20.8117 7.18967 20.9084C6.66852 21.1289 6.09042 20.9402 5.81628 20.4602C5.69597 20.2495 5.65848 19.8695 5.5835 19.1095C5.54117 18.6804 5.52 18.4658 5.45575 18.2861C5.31191 17.8838 5.00966 17.5708 4.6211 17.4219C4.44754 17.3554 4.24033 17.3335 3.82589 17.2896C3.09187 17.212 2.72486 17.1732 2.52138 17.0486C2.05772 16.7648 1.87548 16.1662 2.08843 15.6266C2.18188 15.3898 2.45194 15.1102 2.99206 14.5509L5.45575 12" stroke="currentColor" strokeWidth="1.5"></path>
                                            <path d="M12 16.0678L15.7715 19.9728C16.3116 20.5321 16.5816 20.8117 16.8103 20.9084C17.3315 21.1289 17.9096 20.9402 18.1837 20.4602C18.304 20.2495 18.3415 19.8695 18.4165 19.1095C18.4588 18.6804 18.48 18.4658 18.5442 18.2861C18.6881 17.8838 18.9903 17.5708 19.3789 17.4219C19.5525 17.3554 19.7597 17.3335 20.1741 17.2896C20.9081 17.212 21.2751 17.1732 21.4786 17.0486C21.9423 16.7648 22.1245 16.1662 21.9116 15.6266C21.8181 15.3898 21.5481 15.1102 21.0079 14.5509L18.5442 12" stroke="currentColor" strokeWidth="1.5"></path>
                                        </svg>

                                        <span className="px-2">{config.text.coupons}</span>
                                    
                                    </div>

                                </Link>

                            </li>
                        }
                        {
                            config.user.see_bookings &&
                            <li className="nav-item relative">

                                <Link href="/bookings" className="nav-link">

                                    <div className="flex items-center">

                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='-mt-[3px]'>
                                            <path d="M2 3L2.26491 3.0883C3.58495 3.52832 4.24497 3.74832 4.62248 4.2721C5 4.79587 5 5.49159 5 6.88304V9.5C5 12.3284 5 13.7426 5.87868 14.6213C6.75736 15.5 8.17157 15.5 11 15.5H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <path d="M7.5 18C8.32843 18 9 18.6716 9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18Z" stroke="currentColor" strokeWidth="1.5"></path>
                                            <path d="M16.5 18.0001C17.3284 18.0001 18 18.6716 18 19.5001C18 20.3285 17.3284 21.0001 16.5 21.0001C15.6716 21.0001 15 20.3285 15 19.5001C15 18.6716 15.6716 18.0001 16.5 18.0001Z" stroke="currentColor" strokeWidth="1.5"></path>
                                            <path d="M11 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <path d="M5 6H16.4504C18.5054 6 19.5328 6 19.9775 6.67426C20.4221 7.34853 20.0173 8.29294 19.2078 10.1818L18.7792 11.1818C18.4013 12.0636 18.2123 12.5045 17.8366 12.7523C17.4609 13 16.9812 13 16.0218 13H5" stroke="currentColor" strokeWidth="1.5"></path>
                                        </svg>

                                        <span className="px-2">{config.text.bookings}</span>
                                    
                                    </div>

                                </Link>

                            </li>
                        }
                        {
                            config.user.reports &&
                            <li className="nav-item relative">

                                <Link href="/reports" className="nav-link">

                                    <div className="flex items-center">

                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className='-mt-[3px]'>
                                            <path opacity="0.5" d="M16 4.00195C18.175 4.01406 19.3529 4.11051 20.1213 4.87889C21 5.75757 21 7.17179 21 10.0002V16.0002C21 
                                                18.8286 21 20.2429 20.1213 21.1215C19.2426 22.0002 17.8284 22.0002 15 22.0002H9C6.17157 22.0002 4.75736 22.0002 3.87868 
                                                21.1215C3 20.2429 3 18.8286 3 16.0002V10.0002C3 7.17179 3 5.75757 3.87868 4.87889C4.64706 4.11051 5.82497 
                                                4.01406 8 4.00195" stroke="currentColor" strokeWidth="1.5">
                                            </path>
                                            <path d="M8 14H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <path d="M7 10.5H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <path d="M9 17.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                            <path d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 
                                                6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z" stroke="currentColor" strokeWidth="1.5">
                                            </path>
                                        </svg>

                                        <span className="px-2">{config.text.reports}</span>
                                    
                                    </div>

                                </Link>

                            </li>
                        }
                            
                    </ul>

                </div> :
                <div className="shadow-sm no-select">

                    <div className="relative flex w-full items-center bg-white px-5 py-3 dark:bg-black">

                        <div className="horizontal-logo flex items-center justify-between ltr:mr-2 rtl:ml-2 lg:hidden">

                            <Link href="/" className="main-logo flex items-center shrink-0 px-2">

                                {/* <img className="w-5 rtl:ml-3 ltr:mr-3 flex-none" src="/media/public/logo.svg"/> */}

                                <span className="text-2xl font-semibold align-middle lg:inline dark:text-white-dark" style={{fontSize: "1.2rem", marginTop: "0"}}>
                                    <span className='text-primary'>{config.text.logo1}</span> <span className='text-danger'>{config.text.logo2}</span>
                                </span>

                            </Link>

                        </div>

                        <div className="flex items-center space-x-1.5 ltr:ml-auto rtl:mr-auto rtl:space-x-reverse dark:text-[#d0d2d6] sm:flex-1 ltr:sm:ml-0 sm:rtl:mr-0 lg:space-x-2">
                            
                            <div className="sm:ltr:mr-auto sm:rtl:ml-auto"></div>
                            <div className="flex items-center space-x-3 rtl:space-x-reverse px-2">
                                <div className="dropdown shrink-0">

                                    <Dropdown offset={[0, 8]} placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                                        btnClassName="block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                                        button={lang && <img className="h-5 w-5 rounded-full object-cover" src={`/media/public/flags/${lang.toUpperCase()}.svg`} alt="flag" />}>
                                        
                                        <ul className="langs-list grid w-[280px] grid-cols-2 gap-2 !px-2 font-semibold text-dark dark:text-white-dark dark:text-white-light/90">
                                            {
                                                config.langs_list.map((item) =>

                                                    <li key={item.code}>

                                                        <button type="button" className={`flex w-full hover:text-primary ${lang === item.code ? 'bg-primary/10 text-primary' : ''}`}
                                                            onClick={() => { dispatch(toggle_lang(item.code)); setLang(item.code); }}>
                                                            <img src={`/media/public/flags/${item.code.toUpperCase()}.svg`} alt="flag" className="h-5 w-5 rounded-full object-cover" />
                                                            <span className="ltr:ml-3 rtl:mr-3">{config.text[item.code]}</span>
                                                        </button>

                                                    </li>

                                                )
                                            }
                                        </ul>

                                    </Dropdown>

                                </div>
                                <div className="dropdown shrink-0">

                                    <Dropdown offset={[0, 8]} placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`} btnClassName="relative block p-2 rounded-full bg-white-light/40 dark:bg-dark/40 hover:text-primary hover:bg-white-light/90 dark:hover:bg-dark/60"
                                        button={
                                            <span>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path stroke="currentColor" strokeWidth="1.5" d="M19.0001 9.7041V9C19.0001 5.13401 15.8661 2 12.0001 2C8.13407 2 5.00006 5.13401 5.00006 9V9.7041C5.00006 10.5491 4.74995 11.3752 4.28123 12.0783L3.13263 13.8012C2.08349 15.3749 2.88442 17.5139 4.70913 18.0116C9.48258 19.3134 14.5175 19.3134 19.291 18.0116C21.1157 17.5139 21.9166 15.3749 20.8675 13.8012L19.7189 12.0783C19.2502 11.3752 19.0001 10.5491 19.0001 9.7041Z"/>
                                                    <path d="M7.5 19C8.15503 20.7478 9.92246 22 12 22C14.0775 22 15.845 20.7478 16.5 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                    <path d="M12 6V10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                                <span className="absolute top-0 flex h-3 w-3 ltr:right-0 rtl:left-0">
                                                    <span className="absolute -top-[3px] inline-flex h-full w-full animate-ping rounded-full bg-success/50 opacity-75 ltr:-left-[3px] rtl:-right-[3px]"></span>
                                                    <span className="relative inline-flex h-[6px] w-[6px] rounded-full bg-success"></span>
                                                </span>
                                            </span>
                                        }>
                                        
                                        <ul className="w-[300px] !py-0 text-xs text-dark dark:text-white-dark sm:w-[320px]">

                                            <li className="mb-5" onClick={(e) => e.stopPropagation()}>

                                                <div className="relative !h-[55px] w-full overflow-hidden rounded-t-md p-5 text-white hover:!bg-transparent">
                                                    
                                                    <div className="bg- absolute inset-0 h-full w-full bg-[url(/media/public/menu-heade.jpg)] bg-cover bg-center bg-no-repeat"></div>
                                                    
                                                    <h4 className="relative z-10 text-[.95rem] font-semibold">{config.text.notifications}</h4>

                                                </div>

                                            </li>
                                                
                                            <li className="mb-10" onClick={(e) => e.stopPropagation()}>
                                                                                                                                        
                                                <div className="default !grid min-h-[200px] place-content-center text-[.9rem] hover:!bg-transparent">
                                                    
                                                    <div className="mx-auto mb-4 rounded-full text-white ring-4 ring-primary/30">
                                                        <svg width="40" height="40" viewBox="0 0 24 24" fill="#a9abb6" strokeWidth="1.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg" className="feather feather-info rounded-full bg-primary">
                                                            <line x1="12" y1="16" x2="12" y2="12"></line>
                                                            <line x1="12" y1="8" x2="12.01" y2="8"></line>
                                                        </svg>
                                                    </div>

                                                    {config.text.no_data}

                                                </div>

                                            </li>

                                        </ul>
                                        
                                    </Dropdown>

                                </div>
                                <div>
                                    {
                                        config.theme === 'light' ?
                                        <button className='flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                                            onClick={() => dispatch(toggle_theme('dark'))}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="12" r="5" stroke="currentColor" strokeWidth="1.5" />
                                                <path d="M12 2V4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                <path d="M12 20V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                <path d="M4 12L2 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                <path d="M22 12L20 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                <path opacity="0.5" d="M19.7778 4.22266L17.5558 6.25424" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                <path opacity="0.5" d="M4.22217 4.22266L6.44418 6.25424" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                <path opacity="0.5" d="M6.44434 17.5557L4.22211 19.7779" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                                <path opacity="0.5" d="M19.7778 19.7773L17.5558 17.5551" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                        </button> :
                                        <button className='flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
                                            onClick={() => dispatch(toggle_theme('light'))}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fill="currentColor" d="M21.0672 11.8568L20.4253 11.469L21.0672 11.8568ZM12.1432 2.93276L11.7553 2.29085V2.29085L12.1432 2.93276ZM21.25 12C21.25 17.1086 17.1086 21.25 12 21.25V22.75C17.9371 22.75 22.75 17.9371 22.75 12H21.25ZM12 21.25C6.89137 21.25 2.75 17.1086 2.75 12H1.25C1.25 17.9371 6.06294 22.75 12 22.75V21.25ZM2.75 12C2.75 6.89137 6.89137 2.75 12 2.75V1.25C6.06294 1.25 1.25 6.06294 1.25 12H2.75ZM15.5 14.25C12.3244 14.25 9.75 11.6756 9.75 8.5H8.25C8.25 12.5041 11.4959 15.75 15.5 15.75V14.25ZM20.4253 11.469C19.4172 13.1373 17.5882 14.25 15.5 14.25V15.75C18.1349 15.75 20.4407 14.3439 21.7092 12.2447L20.4253 11.469ZM9.75 8.5C9.75 6.41182 10.8627 4.5828 12.531 3.57467L11.7553 2.29085C9.65609 3.5593 8.25 5.86509 8.25 8.5H9.75ZM12 2.75C11.9115 2.75 11.8077 2.71008 11.7324 2.63168C11.6686 2.56527 11.6538 2.50244 11.6503 2.47703C11.6461 2.44587 11.6482 2.35557 11.7553 2.29085L12.531 3.57467C13.0342 3.27065 13.196 2.71398 13.1368 2.27627C13.0754 1.82126 12.7166 1.25 12 1.25V2.75ZM21.7092 12.2447C21.6444 12.3518 21.5541 12.3539 21.523 12.3497C21.4976 12.3462 21.4347 12.3314 21.3683 12.2676C21.2899 12.1923 21.25 12.0885 21.25 12H22.75C22.75 11.2834 22.1787 10.9246 21.7237 10.8632C21.286 10.804 20.7293 10.9658 20.4253 11.469L21.7092 12.2447Z"/>
                                            </svg>
                                        </button>
                                    }
                                </div>
                            </div>
                            <div className="dropdown flex shrink-0 all-data">

                                <img src='/media/public/user_icon.png' className="opacity-[.7] pointer h-[2.25rem] w-[2.25rem] rounded-full saturate-50 group-hover:saturate-100"/>

                            </div>

                        </div>

                    </div>

                </div>
            }
        </header>

    );

}
