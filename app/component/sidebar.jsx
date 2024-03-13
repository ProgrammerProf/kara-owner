"use client";
import { toggle_side } from '@/public/script/store';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import Link from 'next/link';

export default function Sidebar () {
    
    const dispatch = useDispatch();
    const config = useSelector((state) => state.config);
    const [currentMenu, setCurrentMenu] = useState('');

    return (

        <div className={config.semidark ? 'dark' : ''}>

            <div className={`${(!config.side && 'hidden') || ''} fixed inset-0 z-50 bg-[black]/60 lg:hidden`} onClick={() => dispatch(toggle_side())}></div>

            <nav className={`sidebar fixed top-0 bottom-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${config.semidark ? 'text-white-dark' : ''}`}>
                
                <div className="h-full bg-white dark:bg-black no-select">

                    <div className="flex items-center justify-between px-4 py-3">

                        <Link href="/" className="main-logo flex items-center shrink-0 ltr:ml-2 rtl:mr-2">
                            <img className="w-5 rtl:ml-3 ltr:mr-3 flex-none" src="/media/public/logo.svg"/>
                            <span className="text-2xl font-semibold align-middle lg:inline dark:text-white-dark" style={{fontSize: "1.2rem", marginTop: "0"}}>
                                <span className='text-primary'>{config.text.logo1}</span> <span className='text-danger'>{config.text.logo2}</span>
                            </span>
                        </Link>

                        <button type="button" onClick={() => dispatch(toggle_side())} className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="m-auto h-5 w-5">
                                <path d="M13 19L7 12L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                <path opacity="0.5" d="M16.9998 19L10.9998 12L16.9998 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>

                    </div>

                    <PerfectScrollbar className="relative h-[calc(100vh-80px)]">

                        <ul className="relative space-y-0.5 p-4 py-0 font-semibold">

                            {
                                config.user.id &&
                                <li className="nav-item">

                                    <Link href="/" className="group">

                                        <div className="flex items-center">

                                            <svg className="group-hover:!text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path opacity="0.5" d="M6.22209 4.60105C6.66665 4.304 7.13344 4.04636 7.6171 3.82976C8.98898 3.21539 9.67491 2.9082 10.5875 3.4994C11.5 4.09061 11.5 5.06041 11.5 7.00001V8.50001C11.5 10.3856 11.5 11.3284 12.0858 11.9142C12.6716 12.5 13.6144 12.5 15.5 12.5H17C18.9396 12.5 19.9094 12.5 20.5006 13.4125C21.0918 14.3251 20.7846 15.011 20.1702 16.3829C19.9536 16.8666 19.696 17.3334 19.399 17.7779C18.3551 19.3402 16.8714 20.5578 15.1355 21.2769C13.3996 21.9959 11.4895 22.184 9.64665 21.8175C7.80383 21.4509 6.11109 20.5461 4.78249 19.2175C3.45389 17.8889 2.5491 16.1962 2.18254 14.3534C1.81598 12.5105 2.00412 10.6004 2.72315 8.86451C3.44218 7.12861 4.65982 5.64492 6.22209 4.60105Z" fill="currentColor"></path>
                                                <path d="M21.446 7.06901C20.6342 5.00831 18.9917 3.36579 16.931 2.55398C15.3895 1.94669 14 3.34316 14 5.00002V9.00002C14 9.5523 14.4477 10 15 10H19C20.6569 10 22.0533 8.61055 21.446 7.06901Z" fill="currentColor"></path>
                                            </svg>

                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{config.text.dashboard}</span>
                                        
                                        </div>

                                    </Link>

                                </li>
                            }
                            {
                                config.user.chat &&
                                <li className="nav-item">

                                    <Link href="/chat" className="group">

                                        <div className="flex items-center">
                                            <svg className="group-hover:!text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M10.4036 22.4797L10.6787 22.015C11.1195 21.2703 11.3399 20.8979 11.691 20.6902C12.0422 20.4825 12.5001 20.4678 13.4161 20.4385C14.275 20.4111 14.8523 20.3361 15.3458 20.1317C16.385 19.7012 17.2106 18.8756 17.641 17.8365C17.9639 17.0571 17.9639 16.0691 17.9639 14.093V13.2448C17.9639 10.4683 17.9639 9.08006 17.3389 8.06023C16.9892 7.48958 16.5094 7.0098 15.9388 6.66011C14.919 6.03516 13.5307 6.03516 10.7542 6.03516H8.20964C5.43314 6.03516 4.04489 6.03516 3.02507 6.66011C2.45442 7.0098 1.97464 7.48958 1.62495 8.06023C1 9.08006 1 10.4683 1 13.2448V14.093C1 16.0691 1 17.0571 1.32282 17.8365C1.75326 18.8756 2.57886 19.7012 3.61802 20.1317C4.11158 20.3361 4.68882 20.4111 5.5477 20.4385C6.46368 20.4678 6.92167 20.4825 7.27278 20.6902C7.6239 20.8979 7.84431 21.2703 8.28514 22.015L8.5602 22.4797C8.97002 23.1721 9.9938 23.1721 10.4036 22.4797ZM13.1928 14.5171C13.7783 14.5171 14.253 14.0424 14.253 13.4568C14.253 12.8713 13.7783 12.3966 13.1928 12.3966C12.6072 12.3966 12.1325 12.8713 12.1325 13.4568C12.1325 14.0424 12.6072 14.5171 13.1928 14.5171ZM10.5422 13.4568C10.5422 14.0424 10.0675 14.5171 9.48193 14.5171C8.89637 14.5171 8.42169 14.0424 8.42169 13.4568C8.42169 12.8713 8.89637 12.3966 9.48193 12.3966C10.0675 12.3966 10.5422 12.8713 10.5422 13.4568ZM5.77108 14.5171C6.35664 14.5171 6.83133 14.0424 6.83133 13.4568C6.83133 12.8713 6.35664 12.3966 5.77108 12.3966C5.18553 12.3966 4.71084 12.8713 4.71084 13.4568C4.71084 14.0424 5.18553 14.5171 5.77108 14.5171Z"
                                                    fill="currentColor"/>
                                                <path opacity="0.5" d="M15.486 1C16.7529 0.999992 17.7603 0.999986 18.5683 1.07681C19.3967 1.15558 20.0972 1.32069 20.7212 1.70307C21.3632 2.09648 21.9029 2.63623 22.2963 3.27821C22.6787 3.90219 22.8438 4.60265 22.9226 5.43112C22.9994 6.23907 22.9994 7.24658 22.9994 8.51343V9.37869C22.9994 10.2803 22.9994 10.9975 22.9597 11.579C22.9191 12.174 22.8344 12.6848 22.6362 13.1632C22.152 14.3323 21.2232 15.2611 20.0541 15.7453C20.0249 15.7574 19.9955 15.7691 19.966 15.7804C19.8249 15.8343 19.7039 15.8806 19.5978 15.915H17.9477C17.9639 15.416 17.9639 14.8217 17.9639 14.093V13.2448C17.9639 10.4683 17.9639 9.08006 17.3389 8.06023C16.9892 7.48958 16.5094 7.0098 15.9388 6.66011C14.919 6.03516 13.5307 6.03516 10.7542 6.03516H8.20964C7.22423 6.03516 6.41369 6.03516 5.73242 6.06309V4.4127C5.76513 4.29934 5.80995 4.16941 5.86255 4.0169C5.95202 3.75751 6.06509 3.51219 6.20848 3.27821C6.60188 2.63623 7.14163 2.09648 7.78361 1.70307C8.40759 1.32069 9.10805 1.15558 9.93651 1.07681C10.7445 0.999986 11.7519 0.999992 13.0188 1H15.486Z"
                                                    fill="currentColor"/>
                                            </svg>
                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{config.text.chat_box}</span>
                                        </div>

                                    </Link>

                                </li>
                            }
                            {
                                config.user.id &&
                                <li className="nav-item">

                                    <Link href="/account" className="group">

                                        <div className="flex items-center">

                                            <svg className="group-hover:!text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <circle cx="12" cy="6" r="4" stroke="currentColor" strokeWidth="1.5"></circle>
                                                <path stroke="currentColor" strokeWidth="1.5" d="M20 17.5C20 19.9853 20 22 12 22C4 22 4 19.9853 4 17.5C4 15.0147 7.58172 13 
                                                    12 13C16.4183 13 20 15.0147 20 17.5Z">
                                                </path>
                                            </svg>

                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{config.text.account}</span>
                                        
                                        </div>

                                    </Link>

                                </li>
                            }
                            {
                                config.user.see_products || 
                                config.user.see_bookings ||
                                config.user.see_coupons ?
                                <div className="h-px w-full border-b border-[#e0e6ed] dark:border-[#1b2e4b]" style={{margin: '.7rem 0'}}></div> : ''
                            }
                            {
                                config.user.see_products &&
                                <li className="nav-item">

                                    <Link href="/properties" className="group">

                                        <div className="flex items-center">

                                            <svg className="group-hover:!text-primary" style={{transform: 'scale(.95)'}} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M9.5 21.5V18.5C9.5 17.5654 9.5 17.0981 9.70096 16.75C9.83261 16.522 10.022 16.3326 10.25 16.201C10.5981 16 11.0654 16 12 16C12.9346 16 13.4019 16 13.75 16.201C13.978 16.3326 14.1674 16.522 14.299 16.75C14.5 17.0981 14.5 17.5654 14.5 18.5V21.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                <path d="M21 22H9M3 22H5.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                <path d="M19 22V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                <path d="M5 22V15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                <path d="M11.9999 2H7.47214C6.26932 2 5.66791 2 5.18461 2.2987C4.7013 2.5974 4.43234 3.13531 3.89443 4.21114L2.49081 7.75929C2.16652 8.57905 1.88279 9.54525 2.42867 10.2375C2.79489 10.7019 3.36257 11 3.99991 11C5.10448 11 5.99991 10.1046 5.99991 9C5.99991 10.1046 6.89534 11 7.99991 11C9.10448 11 9.99991 10.1046 9.99991 9C9.99991 10.1046 10.8953 11 11.9999 11C13.1045 11 13.9999 10.1046 13.9999 9C13.9999 10.1046 14.8953 11 15.9999 11C17.1045 11 17.9999 10.1046 17.9999 9C17.9999 10.1046 18.8953 11 19.9999 11C20.6373 11 21.205 10.7019 21.5712 10.2375C22.1171 9.54525 21.8334 8.57905 21.5091 7.75929L20.1055 4.21114C19.5676 3.13531 19.2986 2.5974 18.8153 2.2987C18.332 2 17.7306 2 16.5278 2H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                            </svg>

                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{config.text.products}</span>
                                        
                                        </div>

                                    </Link>

                                </li>
                            }
                            {
                                config.user.see_coupons &&
                                <li className="nav-item">

                                    <Link href="/coupons" className="group">

                                        <div className="flex items-center">
                                            
                                            <svg className="group-hover:!text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11.1459 7.02251C11.5259 6.34084 11.7159 6 12 6C12.2841 6 12.4741 6.34084 12.8541 7.02251L12.9524 7.19887C13.0603 7.39258 13.1143 7.48944 13.1985 7.55334C13.2827 7.61725 13.3875 7.64097 13.5972 7.68841L13.7881 7.73161C14.526 7.89857 14.895 7.98205 14.9828 8.26432C15.0706 8.54659 14.819 8.84072 14.316 9.42898L14.1858 9.58117C14.0429 9.74833 13.9714 9.83191 13.9392 9.93531C13.9071 10.0387 13.9179 10.1502 13.9395 10.3733L13.9592 10.5763C14.0352 11.3612 14.0733 11.7536 13.8435 11.9281C13.6136 12.1025 13.2682 11.9435 12.5773 11.6254L12.3986 11.5431C12.2022 11.4527 12.1041 11.4075 12 11.4075C11.8959 11.4075 11.7978 11.4527 11.6014 11.5431L11.4227 11.6254C10.7318 11.9435 10.3864 12.1025 10.1565 11.9281C9.92674 11.7536 9.96476 11.3612 10.0408 10.5763L10.0605 10.3733C10.0821 10.1502 10.0929 10.0387 10.0608 9.93531C10.0286 9.83191 9.95713 9.74833 9.81418 9.58117L9.68403 9.42898C9.18097 8.84072 8.92945 8.54659 9.01723 8.26432C9.10501 7.98205 9.47396 7.89857 10.2119 7.73161L10.4028 7.68841C10.6125 7.64097 10.7173 7.61725 10.8015 7.55334C10.8857 7.48944 10.9397 7.39258 11.0476 7.19887L11.1459 7.02251Z" stroke="currentColor" strokeWidth="1.5"></path>
                                                <path d="M19 9C19 12.866 15.866 16 12 16C8.13401 16 5 12.866 5 9C5 5.13401 8.13401 2 12 2C15.866 2 19 5.13401 19 9Z" stroke="currentColor" strokeWidth="1.5"></path>
                                                <path d="M12 16.0678L8.22855 19.9728C7.68843 20.5321 7.41837 20.8117 7.18967 20.9084C6.66852 21.1289 6.09042 20.9402 5.81628 20.4602C5.69597 20.2495 5.65848 19.8695 5.5835 19.1095C5.54117 18.6804 5.52 18.4658 5.45575 18.2861C5.31191 17.8838 5.00966 17.5708 4.6211 17.4219C4.44754 17.3554 4.24033 17.3335 3.82589 17.2896C3.09187 17.212 2.72486 17.1732 2.52138 17.0486C2.05772 16.7648 1.87548 16.1662 2.08843 15.6266C2.18188 15.3898 2.45194 15.1102 2.99206 14.5509L5.45575 12" stroke="currentColor" strokeWidth="1.5"></path>
                                                <path d="M12 16.0678L15.7715 19.9728C16.3116 20.5321 16.5816 20.8117 16.8103 20.9084C17.3315 21.1289 17.9096 20.9402 18.1837 20.4602C18.304 20.2495 18.3415 19.8695 18.4165 19.1095C18.4588 18.6804 18.48 18.4658 18.5442 18.2861C18.6881 17.8838 18.9903 17.5708 19.3789 17.4219C19.5525 17.3554 19.7597 17.3335 20.1741 17.2896C20.9081 17.212 21.2751 17.1732 21.4786 17.0486C21.9423 16.7648 22.1245 16.1662 21.9116 15.6266C21.8181 15.3898 21.5481 15.1102 21.0079 14.5509L18.5442 12" stroke="currentColor" strokeWidth="1.5"></path>
                                            </svg>

                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{config.text.coupons}</span>
                                        
                                        </div>

                                    </Link>

                                </li>
                            }
                            {
                                config.user.see_bookings &&
                                <li className="nav-item">

                                    <Link href="/bookings" className="group">

                                        <div className="flex items-center">

                                            <svg className="group-hover:!text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2 3L2.26491 3.0883C3.58495 3.52832 4.24497 3.74832 4.62248 4.2721C5 4.79587 5 5.49159 5 6.88304V9.5C5 12.3284 5 13.7426 5.87868 14.6213C6.75736 15.5 8.17157 15.5 11 15.5H19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                <path d="M7.5 18C8.32843 18 9 18.6716 9 19.5C9 20.3284 8.32843 21 7.5 21C6.67157 21 6 20.3284 6 19.5C6 18.6716 6.67157 18 7.5 18Z" stroke="currentColor" strokeWidth="1.5"></path>
                                                <path d="M16.5 18.0001C17.3284 18.0001 18 18.6716 18 19.5001C18 20.3285 17.3284 21.0001 16.5 21.0001C15.6716 21.0001 15 20.3285 15 19.5001C15 18.6716 15.6716 18.0001 16.5 18.0001Z" stroke="currentColor" strokeWidth="1.5"></path>
                                                <path d="M11 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                <path d="M5 6H16.4504C18.5054 6 19.5328 6 19.9775 6.67426C20.4221 7.34853 20.0173 8.29294 19.2078 10.1818L18.7792 11.1818C18.4013 12.0636 18.2123 12.5045 17.8366 12.7523C17.4609 13 16.9812 13 16.0218 13H5" stroke="currentColor" strokeWidth="1.5"></path>
                                            </svg>

                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{config.text.bookings}</span>
                                        
                                        </div>

                                    </Link>

                                </li>
                            }
                            {
                                config.user.reports &&
                                <div className="h-px w-full border-b border-[#e0e6ed] dark:border-[#1b2e4b]" style={{margin: '.7rem 0'}}></div>
                            }
                            {
                                config.user.reports &&
                                <li className="nav-item">

                                    <Link href="/reports" className="group">

                                        <div className="flex items-center">

                                            <svg className="group-hover:!text-primary -mt-[2px]" style={{transform: 'scale(.9)'}} width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
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

                                            <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690] dark:group-hover:text-white-dark">{config.text.reports}</span>
                                        
                                        </div>

                                    </Link>

                                </li>
                            }

                        </ul>

                    </PerfectScrollbar>

                </div>

            </nav>

        </div>

    );

}
