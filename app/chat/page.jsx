"use client";
import { api, date, host, file_info, fix_date, check_class, matching, fix_time, sound, print, diff_date } from '@/public/script/public';
import Loader from "@/app/component/loader";
import Dropdown from '@/app/component/menu';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Chat () {

    const textInput = useRef(null);
    const fileInput = useRef(null);
    const router = useRouter();
    const config = useSelector((state) => state.config);
    const [loader, setLoader] = useState(false);
    const [sideMenu, setSideMenu] = useState(false);
    const [data, setData] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [contact, setContact] = useState(0);
    const [search, setSearch] = useState('');
    const [button, setButton] = useState(false);
    const [smooth, setSmooth] = useState(false);
    const [users, setUsers] = useState([]);
    const [socket, setSocket] = useState({});

    const scroll = ( id, smooth ) => {

        setSmooth(smooth || false);

        if ( id ) {
            document.querySelector(`#${id}`)?.scrollIntoView();
        }
        else {
            document.querySelector(".chat-div .display-content")?.scrollBy(0, 100000);
            setTimeout(_ => document.querySelector(".chat-div .display-content")?.scrollBy(0, 100000), 100);
            setTimeout(() => {
                const element = document.querySelector('.chat-div .display-content');
                element.scrollTop = element.scrollHeight;
            }, 100);
        }

        setTimeout(_ => setSmooth(true), 500);

    }
    const set_data = ( _data_ ) => {

        let new_data = _data_?.map((item) => {

            item.messages = item.messages.filter(_ => _.sender !== 0);
            return item;

        });
        new_data = new_data?.map((item) => {

            let last_date = '',
            unread = 0,
            unreadIndex = 0,
            messages = [...item.messages];

            item.messages.forEach((message, index) => {

                if ( message.date?.split(' ')[0] !== last_date ) {

                    last_date = message.date.split(' ')[0];
                    messages.splice(messages.indexOf(message), 0,  {id: 0, sender: 0, content: fix_date(message.date), date: date(), active: true});

                }
                if ( !message.active && message.sender !== config.user?.id ){

                    unread++;
                    unreadIndex = unreadIndex || messages.indexOf(message);

                }

            });

            item.messages = messages;
            item.unread = unread;
            if ( unread ) item.messages.splice(unreadIndex, 0,  {id: 0, sender: 0, content: `${unread} Unread Messages`, unread: true, readen: false, date: date(), active: true});

            return item;

        });

        setData([...new_data]);
        setContacts([...new_data]);

    }
    const get_data = async() => {

        const response = await api('chat', {token: config.user.token});
        let contacts = response.contacts?.sort((a, b) => diff_date(a.messages.slice(-1)[0]?.date, b.messages.slice(-1)[0]?.date)) || [];
        contacts = contacts.map(_ => { _.user.id === 1 ? _.user = {id: 1, name: config.text.support, online: true} : ''; return _; });

        setLoader(false);
        set_data(contacts);
        setUsers([{id: 1, name: config.text.support, online: true}]);

    }
    const get_messages = async( id ) => {

        if ( data.find(_ => _.id === id)?.opened ) return scroll(0, false);

        setLoader(true);
        const response  = await api('chat/get', {id: id, token: config.user.token});
        let new_data = data.map((item) => {
            if ( item.id === id ) {
                item.messages = response.messages || [];
                item.opened = true;
            }
            return item;
        });

        set_data([...new_data]);
        scroll(0, false);
        setLoader(false);

    }
    const new_contact = async( id ) => {

        let _contact_ = data.find(_ => _.user.id === id);
        if ( _contact_?.id ) return select({}, _contact_.id);
        let new_data = data;
        let contact_id = date();
        new_data.unshift({id: contact_id, date: date(), user: users.find(_ => _.id === id), messages: []});
        setData([...new_data]);
        setContacts([...new_data]);
        select({}, contact_id);

    }
    const delete_contact = async( id, for_all ) => {

        if ( !confirm('Are you sure to delete this chat ?') ) return;
        if ( contact === id ) setContact(0);
        setData(data.filter(_ => _.id !== id));
        setContacts(data.filter(_ => _.id !== id));
        const response = await api('chat/delete', {id: id, for_all: for_all || false, token: config.user.token});

    }
    const send_message = async( file, link ) => {

        let id = date();

        let msg = {
            id: id,
            token: config.user.token,
            sender: config.user.id,
            receiver: data.find(_ => _.id === contact).user?.id || 0,
            content: textInput.current?.value || '',
            date: date(),
            file: file || '',
            type: file_info(file, 'type') || 'text',
            name: file_info(file, 'name') || '',
            size: file_info(file, 'size') || '',
            ext: file_info(file, 'ext') || '',
            url: file ? true : false,
        }

        textInput.current ? textInput.current.value = '' : '';
        let new_data = data.filter(_ => _.id !== contact);
        let item = data.find(_ => _.id === contact);
        item.messages.push({...msg, link: link || ''});
        new_data.unshift(item);
        set_data([...new_data]);
        scroll(0, true);
        setTimeout(_ => sound('send', .5));

        const response = await api('chat/send', msg);
        // if ( response.message?.id ) socket?.send(JSON.stringify(response.message));
        
    }
    const handle_file = ( e ) => {

        if ( !e.target.files.length ) return;

        Array.from(e.target.files).forEach((f) => {
            var fr = new FileReader();
            fr.readAsDataURL(f);
            fr.onload = async() => send_message(f, fr.result);
        });

        textInput.current ? textInput.current.value = '' : '';
        fileInput.current ? fileInput.current.value = '' : '';

    }
    const active_contact = async( id ) => {

        let new_data = data;
        let _data_ = new_data[new_data.indexOf(new_data.find(_ => _.id === id))];
        _data_.messages = _data_.messages.filter(_ => !(_.readen && _.unread));
        _data_.messages = _data_.messages.map(_ => { _.receiver === config.user.id ? _.active = true : ''; _.readen = true; return _ });
        _data_.unread = 0;
        setData([...new_data]);
        const response = await api('chat/active', {id: id, token: config.user.token});

    }
    const select = ( e, id ) => {

        setTimeout(_ => textInput.current?.focus(), 100);
        if ( check_class(e.target, 'contact-options') || contact === id ) return;
        textInput.current ? textInput.current.value = '' : ''
        setSideMenu(false);
        setContact(id);
        get_messages(id);

    }
    const on_message = ( msg ) => {

        let new_data = data.filter(_ => _.user.id !== msg.user.id);
        let item = data.filter(_ => _.user.id === msg.user.id);
        if ( item.length ) item = item[0];
        else item = {id: date(), date: date(), messages: [], user: {}};

        if ( item.id === contact ) { msg.message.active = true; active_contact(contact); }
        else sound('receive', .5);
        item.messages.push(msg.message);
        item.user = msg.user;
        new_data.unshift(item);
        set_data([...new_data]);

    }
    const handle_scroll = ( e ) => {

        if ( parseInt(e.target.scrollTop + e.target.offsetHeight) > ( e.target.scrollHeight - 200 ) ) setButton(false)
        else setButton(true);

    }
    useEffect(() => {

        let result = data.filter(_ => 
            matching(`--${_.user?.id}`, search) ||
            matching(_.user?.name, search) ||
            matching(_.messages.slice(-1)[0]?.date, search) ||
            matching(_.messages.slice(-1)[0]?.content, search) ||
            matching(_.user?.id, search) ||
            matching(_.id, search) ||
            matching(`-${_.user?.id}`, search) ||
            matching(`-${_.user?.id}`, search)
        );

        setContacts(result);

    }, [search]);
    useEffect(() => {

        get_data();
        document.title = config.text.chat_box;
        setTimeout(_ => textInput.current?.focus(), 100);        
        // setSocket(new WebSocket(`ws://${host}/chat/${config.user.token}`));
        // socket.onmessage = (e) => on_message(JSON.parse(e.data));

    }, []);

    return (
            
        <div className='chat-div relative flex gap-5'>

            <div className={`panel no-select absolute z-10 hidden w-full max-w-xs flex-none overflow-hidden p-4 xl:relative xl:block xl:h-full left-content ${sideMenu ? '!block' : ''}`}>

                <div className="flex items-center justify-between w-full">

                    <div onClick={() => router.push('/account')} className="pointer flex items-center overflow-hidden hover:text-primary">

                        <img 
                            src={`${host}/U${config.user.id}`} 
                            onError={(e) => e.target.src = "/media/public/user_icon.png"} 
                            onLoad={(e) => e.target.src.includes('_icon') ? e.target.classList.add('empty') : e.target.classList.remove('empty')}
                            className='rounded-full h-8 w-8 object-cover'
                        />

                        <span className='px-[.85rem] -mt-[3px] truncate max-w-[9rem] tracking-wide'>{config.user.name}</span>

                    </div>

                    <button type='button' onClick={() => new_contact(1)} className="flex justify-center items-center w-9 h-9 mt-[-2px] rounded-full pointer hover:text-primary bg-primary/10 hover:bg-primary/20">

                        <svg className="scale-[.95]" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M10.4036 22.4797L10.6787 22.015C11.1195 21.2703 11.3399 20.8979 11.691 20.6902C12.0422 20.4825 12.5001 20.4678 13.4161 20.4385C14.275 20.4111 14.8523 20.3361 15.3458 20.1317C16.385 19.7012 17.2106 18.8756 17.641 17.8365C17.9639 17.0571 17.9639 16.0691 17.9639 14.093V13.2448C17.9639 10.4683 17.9639 9.08006 17.3389 8.06023C16.9892 7.48958 16.5094 7.0098 15.9388 6.66011C14.919 6.03516 13.5307 6.03516 10.7542 6.03516H8.20964C5.43314 6.03516 4.04489 6.03516 3.02507 6.66011C2.45442 7.0098 1.97464 7.48958 1.62495 8.06023C1 9.08006 1 10.4683 1 13.2448V14.093C1 16.0691 1 17.0571 1.32282 17.8365C1.75326 18.8756 2.57886 19.7012 3.61802 20.1317C4.11158 20.3361 4.68882 20.4111 5.5477 20.4385C6.46368 20.4678 6.92167 20.4825 7.27278 20.6902C7.6239 20.8979 7.84431 21.2703 8.28514 22.015L8.5602 22.4797C8.97002 23.1721 9.9938 23.1721 10.4036 22.4797ZM13.1928 14.5171C13.7783 14.5171 14.253 14.0424 14.253 13.4568C14.253 12.8713 13.7783 12.3966 13.1928 12.3966C12.6072 12.3966 12.1325 12.8713 12.1325 13.4568C12.1325 14.0424 12.6072 14.5171 13.1928 14.5171ZM10.5422 13.4568C10.5422 14.0424 10.0675 14.5171 9.48193 14.5171C8.89637 14.5171 8.42169 14.0424 8.42169 13.4568C8.42169 12.8713 8.89637 12.3966 9.48193 12.3966C10.0675 12.3966 10.5422 12.8713 10.5422 13.4568ZM5.77108 14.5171C6.35664 14.5171 6.83133 14.0424 6.83133 13.4568C6.83133 12.8713 6.35664 12.3966 5.77108 12.3966C5.18553 12.3966 4.71084 12.8713 4.71084 13.4568C4.71084 14.0424 5.18553 14.5171 5.77108 14.5171Z" fill="currentColor"></path>
                            <path opacity="0.5" d="M15.486 1C16.7529 0.999992 17.7603 0.999986 18.5683 1.07681C19.3967 1.15558 20.0972 1.32069 20.7212 1.70307C21.3632 2.09648 21.9029 2.63623 22.2963 3.27821C22.6787 3.90219 22.8438 4.60265 22.9226 5.43112C22.9994 6.23907 22.9994 7.24658 22.9994 8.51343V9.37869C22.9994 10.2803 22.9994 10.9975 22.9597 11.579C22.9191 12.174 22.8344 12.6848 22.6362 13.1632C22.152 14.3323 21.2232 15.2611 20.0541 15.7453C20.0249 15.7574 19.9955 15.7691 19.966 15.7804C19.8249 15.8343 19.7039 15.8806 19.5978 15.915H17.9477C17.9639 15.416 17.9639 14.8217 17.9639 14.093V13.2448C17.9639 10.4683 17.9639 9.08006 17.3389 8.06023C16.9892 7.48958 16.5094 7.0098 15.9388 6.66011C14.919 6.03516 13.5307 6.03516 10.7542 6.03516H8.20964C7.22423 6.03516 6.41369 6.03516 5.73242 6.06309V4.4127C5.76513 4.29934 5.80995 4.16941 5.86255 4.0169C5.95202 3.75751 6.06509 3.51219 6.20848 3.27821C6.60188 2.63623 7.14163 2.09648 7.78361 1.70307C8.40759 1.32069 9.10805 1.15558 9.93651 1.07681C10.7445 0.999986 11.7519 0.999992 13.0188 1H15.486Z" fill="currentColor"></path>
                        </svg>
                        
                    </button>

                </div>

                <div className="relative mt-4">

                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="form-input peer search-input" placeholder={config.text.search} autoComplete='off'/>

                    <div className="h-px w-full border-b border-[#e0e6ed] dark:border-[#1b2e4b] mt-3"></div>

                </div>

                {
                    contacts.length ?
                    <div className="contacts no-outline no-border perfect-scrollbar relative h-full min-h-[100px] sm:h-[calc(100vh_-_300px)] space-y-0.5 pr-3.5 -mr-4 overflow-auto">
                        {
                            contacts.map((item, index) =>
                            
                                <div key={index} onClick={(e) => select(e, item.id)} className="chat-user relative pointer no-select type-admin no-margin no-outline for-ar">
                                                
                                    <div className="flex-1">
                        
                                        <div className="flex items-center">
                        
                                            <div className="flex-shrink-0 relative image layer-div">
                        
                                                <img 
                                                   src={`${host}/U${item.user?.id}`} 
                                                    onError={(e) => e.target.src = "/media/public/user_icon.png"} 
                                                    onLoad={(e) => e.target.src.includes('_icon') ? e.target.classList.add('empty') : e.target.classList.remove('empty')}
                                                    className='rounded-full h-9 w-9 object-cover'
                                                />

                                                <div className="absolute bottom-0 ltr:right-0 rtl:left-0">
                        
                                                    { item.user?.online && <div className="w-3 h-3 bg-success rounded-full online"></div> }
                        
                                                </div>
                        
                                            </div>
                        
                                            <div className="mx-3 ltr:text-left rtl:text-right">
                        
                                                <p className="font-semibold name truncate max-w-[9rem]">
                                                    {item.user?.name || ''}
                                                </p>
                        
                                                <p className="flex text-xs text-white-dark truncate max-w-[10rem] mt-[.15rem]">
                                                    {
                                                        item.messages.slice(-1)[0]?.sender === config.user.id &&
                                                        <span className={`material-symbols-outlined check-mark ltr:mr-[2px] rtl:ml-[2px] ${item.messages.slice(-1)[0]?.active ? 'active': ''}`}>check</span>
                                                    }
                                                    {
                                                        item.messages.slice(-1)[0]?.type === 'file' ? 'File' :
                                                        item.messages.slice(-1)[0]?.type === 'image' ? 'Image' :
                                                        item.messages.slice(-1)[0]?.type === 'video' ? 'Video' :
                                                        item.messages.slice(-1)[0]?.content || '~~'
                                                    }
                                                </p>
                        
                                            </div>
                        
                                        </div>
                        
                                    </div>
                        
                                    <div className="font-semibold whitespace-nowrap text-xs">
                        
                                        <p className="mb-1 date">
                                            {fix_date(item.messages.slice(-1)[0]?.date || item.date, true)}
                                        </p>
                        
                                        <div className='flex justify-end'>
                        
                                            {
                                                item.unread > 0 &&
                                                <div className="count text-center">
                                                    {item.unread}
                                                </div>
                                            }

                                            <div className="dropdown contact-options ltr:ml-2 rtl:mr-2">

                                                <Dropdown offset={[0, 5]} placement={`${config.dir === 'rtl' ? 'bottom-start' : 'bottom-end'}`}
                                                    button={
                                                        <svg className="w-5 h-5 rotate-90 svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                                                        </svg>
                                                    }>

                                                    <ul className="whitespace-nowrap">

                                                        <li onClick={(e) => delete_contact(item.id)}>
                                                            <button>
                                                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-4.5 h-4.5 ltr:mr-2 rtl:ml-2 shrink-0">
                                                                    <path opacity="0.5" d="M9.17065 4C9.58249 2.83481 10.6937 2 11.9999 2C13.3062 2 14.4174 2.83481 14.8292 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                                    <path d="M20.5001 6H3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                                    <path d="M18.8334 8.5L18.3735 15.3991C18.1965 18.054 18.108 19.3815 17.243 20.1907C16.378 21 15.0476 21 12.3868 21H11.6134C8.9526 21 7.6222 21 6.75719 20.1907C5.89218 19.3815 5.80368 18.054 5.62669 15.3991L5.16675 8.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                                    <path opacity="0.5" d="M9.5 11L10 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                                    <path opacity="0.5" d="M14.5 11L14 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"></path>
                                                                </svg>
                                                                <span className="ltr:mr-4 rtl:ml-4">{config.text.delete}</span>
                                                            </button>
                                                        </li>
                                                    
                                                    </ul>

                                                </Dropdown>

                                            </div>

                                        </div>

                                    </div>
                        
                                </div>

                            )
                        }
                    </div> :
                    <div className="empty mt-4">

                        <div className="w-full flex justify-center items-center py-10 no-select">

                            <p className="tracking-wide">{config.text.no_data}</p>

                        </div>

                    </div>
                }

            </div>

            <div className={`absolute z-[5] hidden h-full w-full rounded-md bg-black/60 ${sideMenu ? '!block xl:!hidden' : ''}`} onClick={() => setSideMenu(!sideMenu)}></div>

            <div className="panel p-0 flex-1 right-content relative overflow-hidden">

                { loader && <Loader /> }

                {
                    contact ?
                    <div className="relative h-full active-content">

                        <div className="flex justify-between items-center p-4">

                            <div className="flex items-center">

                                <button type="button" className="xl:hidden hover:text-primary show-side-chat ltr:mr-3 rtl:ml-3" onClick={() => setSideMenu(!sideMenu)}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
                                        <path d="M20 7L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path opacity="0.5" d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        <path d="M20 17L4 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                    </svg>
                                </button>

                                <div className="relative flex-none content-image layer-div">
                                    
                                    <img 
                                        src={`${host}/U${data.filter(_ => _.id === contact)[0]?.user?.id}`} 
                                        onError={(e) => e.target.src = "/media/public/user_icon.png"} 
                                        onLoad={(e) => e.target.src.includes('_icon') ? e.target.classList.add('empty') : e.target.classList.remove('empty')}
                                        className='rounded-full w-10 h-10 sm:h-11 sm:w-11 object-cover'
                                    />

                                    <div className="absolute bottom-0 ltr:right-0 rtl:left-0">

                                        { data.filter(_ => _.id === contact)[0]?.user?.online && <div className="w-3 h-3 bg-success rounded-full online"></div> }

                                    </div>

                                </div>

                                <div className="mx-3">

                                    <p className="font-semibold truncate max-w-[9rem] tracking-wide default">
                                        {data.filter(_ => _.id === contact)[0]?.user.name}
                                    </p>

                                    <p className="text-white-dark text-xs mt-[.15rem] no-select">
                                        {data.filter(_ => _.id === contact)[0]?.user.online ? config.text.online : config.text.offline}
                                    </p>

                                </div>

                            </div>

                        </div>

                        <div className="h-px w-full border-b border-[#e0e6ed] dark:border-[#1b2e4b]"></div>

                        <div className={`h-full overflow-auto sm:h-[calc(100vh_-_300px)] display-content ${smooth ? '' : 'none-smooth'}`} onScroll={handle_scroll}>

                            <div className="space-y-5 p-4 chat-conversation-box sm:pb-0 pb-[68px] sm:min-h-[300px] min-h-[400px] messages-list">

                                <div className="flex system-message text default">

                                    <div className="msg-text">

                                        <span className="warn flex items-start text-[.75rem]">

                                            <span className="material-symbols-outlined icon mt-[2px]" style={{ fontSize: '.85rem' }}>lock</span>

                                            <span className='mx-[.4rem]'>
                                                {config.text.encrypt_messages}
                                            </span>

                                        </span>

                                    </div>

                                </div>

                                {
                                    data.filter(_ => _.id === contact)[0]?.messages?.map((message, index) =>

                                        <div key={index}>
                                            {
                                                message.sender === 0 ?
                                                <div className="flex system-message text default" id={message.unread ? 'unread-message' : ''}>

                                                    <div className="msg-text"><span>{message.content}</span></div>

                                                </div> :
                                                <div className={`flex items-start ${message.sender === config.user?.id ? 'justify-end sender' : 'receiver'}-message for-ar ${message.type}`}>

                                                    <div className={`flex-none layer-div ${message.sender === config.user?.id ? 'order-2' : ''}`}>

                                                        <img 
                                                            src={`${host}/U${message.sender === config.user.id ? config.user.id : data.filter(_ => _.id === contact)[0]?.user?.id}`} 
                                                            onError={(e) => e.target.src = "/media/public/user_icon.png"} 
                                                            onLoad={(e) => e.target.src.includes('_icon') ? e.target.classList.add('empty') : e.target.classList.remove('empty')}
                                                            className='rounded-full h-8 w-8 object-cover profile-image'
                                                        />

                                                    </div>

                                                    <div className="space-y-2 msg-content">

                                                        <div className={`flex items-center gap-3 ${message.sender === config.user?.id ? 'justify-end' : ''}`}>

                                                            <div className={`dark:bg-gray-800 p-4 py-2 rounded-md bg-black/10 relative msg-${message.type} ${message.sender === config.user?.id ? 'bg-black/10 !bg-primary text-white' : ''}`}>

                                                                {
                                                                    message.sender === config.user?.id ?
                                                                    <div>
                                                                        <svg viewBox="0 0 8 13" height="13" width="8" className="absolute svg">
                                                                            <path fill="" d="M5.188,1H0v11.193l6.467-8.625 C7.526,2.156,6.958,1,5.188,1z"></path>
                                                                            <path fill="" d="M5.188,0H0v11.193l6.467-8.625C7.526,1.156,6.958,0,5.188,0z"></path>
                                                                        </svg>
                                                                        <svg viewBox="0 0 8 13" height="13" width="8" className="absolute svg hide">
                                                                            <path fill="" d="M1.533,3.568L8,12.193V1H2.812 C1.042,1,0.474,2.156,1.533,3.568z"></path>
                                                                            <path fill="" d="M1.533,2.568L8,11.193V0L2.812,0C1.042,0,0.474,1.156,1.533,2.568z"></path>
                                                                        </svg>
                                                                    </div> :
                                                                    <div>
                                                                        <svg viewBox="0 0 8 13" height="13" width="8" className="absolute svg hide">
                                                                            <path fill="" d="M5.188,1H0v11.193l6.467-8.625 C7.526,2.156,6.958,1,5.188,1z"></path>
                                                                            <path fill="" d="M5.188,0H0v11.193l6.467-8.625C7.526,1.156,6.958,0,5.188,0z"></path>
                                                                        </svg>
                                                                        <svg viewBox="0 0 8 13" height="13" width="8" className="absolute svg">
                                                                            <path fill="" d="M1.533,3.568L8,12.193V1H2.812 C1.042,1,0.474,2.156,1.533,3.568z"></path>
                                                                            <path fill="" d="M1.533,2.568L8,11.193V0L2.812,0C1.042,0,0.474,1.156,1.533,2.568z"></path>
                                                                        </svg>
                                                                    </div>
                                                                }
                                                                {
                                                                    message.type === 'file' &&
                                                                    <Link href={message.url ? `${message.link}` : `${host}/H${message.id}`} target='_blank' download className="no-select file flex flex-space full-width">

                                                                        <div className="flex flex-start">

                                                                            <span className="material-symbols-outlined icon opacity-[.5]">description</span>

                                                                            <div className="flex flex-column">
                                                                                <span className="name flex flex-start full-width truncate tracking-wide opacity-[.7]">{message.name}</span>
                                                                                <span className="flex flex-start full-width size opacity-[.6]">{message.size}</span>
                                                                            </div>

                                                                        </div>

                                                                        <div>
                                                                            <span className="material-symbols-outlined icon download-icon">download</span>
                                                                        </div>

                                                                    </Link>
                                                                }

                                                                { message.type === 'text' && <span>{message.content}</span> }
                                                                { message.type === 'image' && <Link href={message.url ? `${message.link}` : `${host}/H${message.id}`} target="_blank" className='layer-div'><img src={message.url ? `${message.link}` : `${host}/H${message.id}`}/></Link> }
                                                                { message.type === 'video' && <Link href={message.url ? `${message.link}` : `${host}/H${message.id}`} target="_blank" className='layer-div'><video src={message.url ? `${message.link}` : `${host}/H${message.id}`}></video></Link> }

                                                            </div>

                                                        </div>

                                                        <div className={`text-xs relative text-white-dark msg-date default ${message.sender === config.user?.id ? 'ltr:text-right rtl:text-left' : ''}`}>
                                                            
                                                            {fix_time(message.date)}

                                                        </div>

                                                    </div>

                                                </div>
                                            }
                                        </div>

                                    )
                                }

                            </div>

                            {
                                button &&
                                <div className="scroll-down" onClick={() => scroll(0, true)}>
                                    <span className="material-symbols-outlined icon">expand_more</span>
                                </div>
                            }

                        </div>

                        <div className="p-4 absolute bottom-0 left-0 w-full chat-footer no-select for-ar">

                            <div className="sm:flex w-full space-x-3 rtl:space-x-reverse items-center foot">

                                <form className="relative flex-1 input" onSubmit={(e) => { e.preventDefault(); send_message(); }}>

                                    <input ref={textInput} className="form-input rounded-full border-0 bg-[#f4f4f4] px-12 focus:outline-none py-2 send-msg-input" placeholder="Write a Message" autoComplete='off'/>

                                    <button type="button" className="absolute ltr:left-4 rtl:right-4 top-1/2 -translate-y-1/2 hover:text-primary no-outline">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                            <circle opacity="0.5" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
                                            <path d="M9 16C9.85038 16.6303 10.8846 17 12 17C13.1154 17 14.1496 16.6303 15 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            <path d="M16 10.5C16 11.3284 15.5523 12 15 12C14.4477 12 14 11.3284 14 10.5C14 9.67157 14.4477 9 15 9C15.5523 9 16 9.67157 16 10.5Z" fill="currentColor" />
                                            <ellipse cx="9" cy="10.5" rx="1" ry="1.5" fill="currentColor" />
                                        </svg>
                                    </button>

                                    <button type="submit" className="absolute ltr:right-4 rtl:left-4 -translate-y-1/2 hover:text-primary send-msg-btn no-outline">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                            <path d="M17.4975 18.4851L20.6281 9.09373C21.8764 5.34874 22.5006 3.47624 21.5122 2.48782C20.5237 1.49939 18.6511 2.12356 14.906 3.37189L5.57477 6.48218C3.49295 7.1761 2.45203 7.52305 2.13608 8.28637C2.06182 8.46577 2.01692 8.65596 2.00311 8.84963C1.94433 9.67365 2.72018 10.4495 4.27188 12.0011L4.55451 12.2837C4.80921 12.5384 4.93655 12.6658 5.03282 12.8075C5.22269 13.0871 5.33046 13.4143 5.34393 13.7519C5.35076 13.9232 5.32403 14.1013 5.27057 14.4574C5.07488 15.7612 4.97703 16.4131 5.0923 16.9147C5.32205 17.9146 6.09599 18.6995 7.09257 18.9433C7.59255 19.0656 8.24576 18.977 9.5522 18.7997L9.62363 18.79C9.99191 18.74 10.1761 18.715 10.3529 18.7257C10.6738 18.745 10.9838 18.8496 11.251 19.0285C11.3981 19.1271 11.5295 19.2585 11.7923 19.5213L12.0436 19.7725C13.5539 21.2828 14.309 22.0379 15.1101 21.9985C15.3309 21.9877 15.5479 21.9365 15.7503 21.8474C16.4844 21.5244 16.8221 20.5113 17.4975 18.4851Z" stroke="currentColor" strokeWidth="1.5" />
                                            <path opacity="0.5" d="M6 18L21 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </button>

                                </form>

                                <div className="flex items-center space-x-3 rtl:space-x-reverse sm:py-0 py-3 sm:flex buttons">

                                    <button className="no-outline record-voice bg-[#f4f4f4] dark:bg-[#1b2e4b] hover:bg-primary-light rounded-md p-2 hover:text-primary">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                            <path d="M7 8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V11C17 13.7614 14.7614 16 12 16C9.23858 16 7 13.7614 7 11V8Z" stroke="currentColor" strokeWidth="1.5" />
                                            <path opacity="0.5" d="M13.5 8L17 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            <path opacity="0.5" d="M13.5 11L17 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            <path opacity="0.5" d="M7 8L9 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            <path opacity="0.5" d="M7 11L9 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                            <path opacity="0.5" d="M20 10V11C20 15.4183 16.4183 19 12 19M4 10V11C4 15.4183 7.58172 19 12 19M12 19V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                        </svg>
                                    </button>

                                    <button onClick={() => fileInput.current?.click()} className="no-outline attach-file bg-[#f4f4f4] dark:bg-[#1b2e4b] hover:bg-primary-light rounded-md p-2 hover:text-primary">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-5 h-5">
                                            <path d="M22 14V11.7979C22 11.4227 21.9978 10.75 21.9978 10.75L22 10H2V10.75V14C2 17.7712 2 19.6569 3.17157 20.8284C4.34315 22 6.22876 22 10 22H14C17.7712 22 19.6569 22 20.8284 20.8284C22 19.6569 22 17.7712 22 14Z" fill="currentColor"></path>
                                            <path opacity="0.5" d="M11 4L10.4497 3.44975C10.1763 3.17633 10.0396 3.03961 9.89594 2.92051C9.27652 2.40704 8.51665 2.09229 7.71557 2.01738C7.52976 2 7.33642 2 6.94975 2C6.06722 2 5.62595 2 5.25839 2.06935C3.64031 2.37464 2.37464 3.64031 2.06935 5.25839C2 5.62595 2 6.06722 2 6.94975V9.25V10H22L21.9531 9.25C21.8809 8.20117 21.6973 7.51276 21.2305 6.99383C21.1598 6.91514 21.0849 6.84024 21.0062 6.76946C20.1506 6 18.8345 6 16.2021 6H15.8284C14.6747 6 14.0979 6 13.5604 5.84678C13.2651 5.7626 12.9804 5.64471 12.7121 5.49543C12.2237 5.22367 11.8158 4.81578 11 4Z" fill="currentColor"></path>
                                        </svg>
                                    </button>
                                    
                                    <input type="file" ref={fileInput} onChange={handle_file} multiple className="hide"/>

                                </div>

                            </div>

                        </div>

                    </div> :
                    <div className="flex items-center justify-center h-full relative p-4 no-select none-content">

                        <button type="button" className="xl:hidden absolute top-4 ltr:left-4 rtl:right-4 hover:text-primary show-side-chat" onClick={() => setSideMenu(!sideMenu)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7">
                                <path d="M20 7L4 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <path opacity="0.5" d="M20 12L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                <path d="M20 17L4 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            </svg>
                        </button>

                        <div className="flex items-center justify-center flex-col">

                            <div className="w-[280px] md:w-[430px] h-[calc(100vh_-_320px)] min-h-[120px] text-white dark:text-[#0e1726]">
                                <svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" className="w-full h-full" viewBox="0 0 891.29496 745.19434" xmlnsXlink="http://www.w3.org/1999/xlink">
                                    <ellipse cx="418.64354" cy="727.19434" rx="352" ry="18" fill={config.theme === 'dark' ? '#888ea8' : '#e6e6e6'}/>
                                    <path d="M778.64963,250.35008h-3.99878V140.80476a63.40187,63.40187,0,0,0-63.4018-63.40193H479.16232a63.40188,63.40188,0,0,0-63.402,63.4017v600.9744a63.40189,63.40189,0,0,0,63.4018,63.40192H711.24875a63.40187,63.40187,0,0,0,63.402-63.40168V328.32632h3.99878Z" transform="translate(-154.35252 -77.40283)" fill="#3f3d56" />
                                    <path d="M761.156,141.24713v600.09a47.35072,47.35072,0,0,1-47.35,47.35h-233.2a47.35084,47.35084,0,0,1-47.35-47.35v-600.09a47.3509,47.3509,0,0,1,47.35-47.35h28.29a22.50659,22.50659,0,0,0,20.83,30.99h132.96a22.50672,22.50672,0,0,0,20.83-30.99h30.29A47.35088,47.35088,0,0,1,761.156,141.24713Z" transform="translate(-154.35252 -77.40283)" fill="currentColor" />
                                    <path d="M686.03027,400.0032q-2.32543,1.215-4.73047,2.3-2.18994.99-4.4497,1.86c-.5503.21-1.10987.42-1.66992.63a89.52811,89.52811,0,0,1-13.6001,3.75q-3.43506.675-6.96,1.06-2.90991.33-5.87989.47c-1.41015.07-2.82031.1-4.24023.1a89.84124,89.84124,0,0,1-16.75977-1.57c-1.44043-.26-2.85009-.57-4.26025-.91a88.77786,88.77786,0,0,1-19.66992-7.26c-.56006-.28-1.12012-.58-1.68018-.87-.83008-.44-1.63965-.9-2.4497-1.38.38964-.54.81005-1.07,1.23974-1.59a53.03414,53.03414,0,0,1,78.87012-4.1,54.27663,54.27663,0,0,1,5.06006,5.86C685.25977,398.89316,685.6499,399.44321,686.03027,400.0032Z" transform="translate(-154.35252 -77.40283)" fill="#6c63ff" />
                                    <circle cx="492.14325" cy="234.76352" r="43.90974" fill="#2f2e41" />
                                    <circle cx="642.49883" cy="327.46205" r="32.68086" transform="translate(-232.6876 270.90663) rotate(-28.66315)" fill="#a0616a" />
                                    <path d="M676.8388,306.90589a44.44844,44.44844,0,0,1-25.402,7.85033,27.23846,27.23846,0,0,0,10.796,4.44154,89.62764,89.62764,0,0,1-36.61.20571,23.69448,23.69448,0,0,1-7.66395-2.63224,9.699,9.699,0,0,1-4.73055-6.3266c-.80322-4.58859,2.77227-8.75743,6.488-11.567a47.85811,47.85811,0,0,1,40.21662-8.03639c4.49246,1.16124,8.99288,3.12327,11.91085,6.731s3.78232,9.16981,1.00224,12.88488Z" transform="translate(-154.35252 -77.40283)" fill="#2f2e41" />
                                    <path d="M644.5,230.17319a89.98675,89.98675,0,0,0-46.83984,166.83l.58007.34q.72.43506,1.43995.84c.81005.48,1.61962.94,2.4497,1.38.56006.29,1.12012.59,1.68018.87a88.77786,88.77786,0,0,0,19.66992,7.26c1.41016.34,2.81982.65,4.26025.91a89.84124,89.84124,0,0,0,16.75977,1.57c1.41992,0,2.83008-.03,4.24023-.1q2.97-.135,5.87989-.47,3.52513-.39,6.96-1.06a89.52811,89.52811,0,0,0,13.6001-3.75c.56005-.21,1.11962-.42,1.66992-.63q2.26464-.87,4.4497-1.86,2.40015-1.08,4.73047-2.3a90.7919,90.7919,0,0,0,37.03955-35.97c.04-.07995.09034-.16.13038-.24a89.30592,89.30592,0,0,0,9.6499-26.41,90.051,90.051,0,0,0-88.3501-107.21Zm77.06006,132.45c-.08008.14-.1499.28-.23.41a88.17195,88.17195,0,0,1-36.48,35.32q-2.29542,1.2-4.66992,2.25c-1.31006.59-2.64991,1.15-4,1.67-.57032.22-1.14991.44-1.73.64a85.72126,85.72126,0,0,1-11.73,3.36,84.69473,84.69473,0,0,1-8.95019,1.41c-1.8501.2-3.73.34-5.62012.41-1.21.05-2.42969.08-3.6499.08a86.762,86.762,0,0,1-16.21973-1.51,85.62478,85.62478,0,0,1-9.63037-2.36,88.46592,88.46592,0,0,1-13.98974-5.67c-.52-.27-1.04-.54-1.5503-.82-.73-.39-1.46972-.79-2.18994-1.22-.54-.3-1.08008-.62-1.60986-.94-.31006-.18-.62012-.37-.93018-.56a88.06851,88.06851,0,1,1,123.18018-32.47Z" transform="translate(-154.35252 -77.40283)" fill="#3f3d56" />
                                    <path d="M624.2595,268.86254c-.47244-4.968-6.55849-8.02647-11.3179-6.52583s-7.88411,6.2929-8.82863,11.19308a16.0571,16.0571,0,0,0,2.16528,12.12236c2.40572,3.46228,6.82664,5.623,10.95,4.74406,4.70707-1.00334,7.96817-5.59956,8.90127-10.32105s.00667-9.58929-.91854-14.31234Z" transform="translate(-154.35252 -77.40283)" fill="#2f2e41" />
                                    <path d="M691.24187,275.95964c-.47245-4.968-6.5585-8.02646-11.3179-6.52582s-7.88412,6.29289-8.82864,11.19307a16.05711,16.05711,0,0,0,2.16529,12.12236c2.40571,3.46228,6.82663,5.623,10.95,4.74406,4.70707-1.00334,7.96817-5.59955,8.90127-10.32105s.00667-9.58929-.91853-14.31234Z" transform="translate(-154.35252 -77.40283)" fill="#2f2e41" />
                                    <path d="M488.93638,356.14169a4.47525,4.47525,0,0,1-3.30664-1.46436L436.00767,300.544a6.02039,6.02039,0,0,0-4.42627-1.94727H169.3618a15.02615,15.02615,0,0,1-15.00928-15.00927V189.025a15.02615,15.02615,0,0,1,15.00928-15.00928H509.087A15.02615,15.02615,0,0,1,524.0963,189.025v94.5625A15.02615,15.02615,0,0,1,509.087,298.59676h-9.63135a6.01157,6.01157,0,0,0-6.00464,6.00489v47.0332a4.474,4.474,0,0,1-2.87011,4.1958A4.52563,4.52563,0,0,1,488.93638,356.14169Z" transform="translate(-154.35252 -77.40283)" fill="currentColor" />
                                    <path d="M488.93638,356.14169a4.47525,4.47525,0,0,1-3.30664-1.46436L436.00767,300.544a6.02039,6.02039,0,0,0-4.42627-1.94727H169.3618a15.02615,15.02615,0,0,1-15.00928-15.00927V189.025a15.02615,15.02615,0,0,1,15.00928-15.00928H509.087A15.02615,15.02615,0,0,1,524.0963,189.025v94.5625A15.02615,15.02615,0,0,1,509.087,298.59676h-9.63135a6.01157,6.01157,0,0,0-6.00464,6.00489v47.0332a4.474,4.474,0,0,1-2.87011,4.1958A4.52563,4.52563,0,0,1,488.93638,356.14169ZM169.3618,176.01571A13.024,13.024,0,0,0,156.35252,189.025v94.5625a13.024,13.024,0,0,0,13.00928,13.00927H431.5814a8.02436,8.02436,0,0,1,5.90039,2.59571l49.62208,54.1333a2.50253,2.50253,0,0,0,4.34716-1.69092v-47.0332a8.0137,8.0137,0,0,1,8.00464-8.00489H509.087a13.024,13.024,0,0,0,13.00928-13.00927V189.025A13.024,13.024,0,0,0,509.087,176.01571Z" transform="translate(-154.35252 -77.40283)" fill="#3f3d56" />
                                    <circle cx="36.81601" cy="125.19345" r="13.13371" fill="#6c63ff" />
                                    <path d="M493.76439,275.26947H184.68447a7.00465,7.00465,0,1,1,0-14.00929H493.76439a7.00465,7.00465,0,0,1,0,14.00929Z" transform="translate(-154.35252 -77.40283)" fill={config.theme === 'dark' ? '#888ea8' : '#e6e6e6'}/>
                                    <path d="M393.07263,245.49973H184.68447a7.00465,7.00465,0,1,1,0-14.00929H393.07263a7.00464,7.00464,0,0,1,0,14.00929Z" transform="translate(-154.35252 -77.40283)" fill={config.theme === 'dark' ? '#888ea8' : '#e6e6e6'}/>
                                    <path d="M709.41908,676.83065a4.474,4.474,0,0,1-2.87011-4.1958v-47.0332a6.01157,6.01157,0,0,0-6.00464-6.00489H690.913a15.02615,15.02615,0,0,1-15.00928-15.00927V510.025A15.02615,15.02615,0,0,1,690.913,495.01571H1030.6382a15.02615,15.02615,0,0,1,15.00928,15.00928v94.5625a15.02615,15.02615,0,0,1-15.00928,15.00927H768.4186a6.02039,6.02039,0,0,0-4.42627,1.94727l-49.62207,54.1333a4.47525,4.47525,0,0,1-3.30664,1.46436A4.52563,4.52563,0,0,1,709.41908,676.83065Z" transform="translate(-154.35252 -77.40283)" fill="currentColor" />
                                    <path d="M709.41908,676.83065a4.474,4.474,0,0,1-2.87011-4.1958v-47.0332a6.01157,6.01157,0,0,0-6.00464-6.00489H690.913a15.02615,15.02615,0,0,1-15.00928-15.00927V510.025A15.02615,15.02615,0,0,1,690.913,495.01571H1030.6382a15.02615,15.02615,0,0,1,15.00928,15.00928v94.5625a15.02615,15.02615,0,0,1-15.00928,15.00927H768.4186a6.02039,6.02039,0,0,0-4.42627,1.94727l-49.62207,54.1333a4.47525,4.47525,0,0,1-3.30664,1.46436A4.52563,4.52563,0,0,1,709.41908,676.83065ZM690.913,497.01571A13.024,13.024,0,0,0,677.9037,510.025v94.5625A13.024,13.024,0,0,0,690.913,617.59676h9.63135a8.0137,8.0137,0,0,1,8.00464,8.00489v47.0332a2.50253,2.50253,0,0,0,4.34716,1.69092l49.62208-54.1333a8.02436,8.02436,0,0,1,5.90039-2.59571h262.2196a13.024,13.024,0,0,0,13.00928-13.00927V510.025a13.024,13.024,0,0,0-13.00928-13.00928Z" transform="translate(-154.35252 -77.40283)" fill="#3f3d56" />
                                    <path d="M603.53027,706.11319a89.06853,89.06853,0,0,1-93.65039,1.49,54.12885,54.12885,0,0,1,9.40039-12.65,53.43288,53.43288,0,0,1,83.90967,10.56994C603.2998,705.71316,603.41992,705.91318,603.53027,706.11319Z" transform="translate(-154.35252 -77.40283)" fill="#6c63ff" />
                                    <circle cx="398.44256" cy="536.68841" r="44.20157" fill="#2f2e41" />
                                    <circle cx="556.81859" cy="629.4886" r="32.89806" transform="translate(-416.96496 738.72884) rotate(-61.33685)" fill="#ffb8b8" />
                                    <path d="M522.25039,608.79582a44.74387,44.74387,0,0,0,25.57085,7.9025,27.41946,27.41946,0,0,1-10.8677,4.47107,90.22316,90.22316,0,0,0,36.85334.20707,23.852,23.852,0,0,0,7.71488-2.64973,9.76352,9.76352,0,0,0,4.762-6.36865c.80855-4.61909-2.7907-8.81563-6.53113-11.64387a48.17616,48.17616,0,0,0-40.4839-8.08981c-4.52231,1.169-9.05265,3.144-11.99,6.77579s-3.80746,9.23076-1.0089,12.97052Z" transform="translate(-154.35252 -77.40283)" fill="#2f2e41" />
                                    <path d="M555.5,721.17319a89.97205,89.97205,0,1,1,48.5708-14.21875A89.87958,89.87958,0,0,1,555.5,721.17319Zm0-178a88.00832,88.00832,0,1,0,88,88A88.09957,88.09957,0,0,0,555.5,543.17319Z" transform="translate(-154.35252 -77.40283)" fill="#3f3d56" />
                                    <circle cx="563.81601" cy="445.19345" r="13.13371" fill="#6c63ff" />
                                    <path d="M1020.76439,595.26947H711.68447a7.00465,7.00465,0,1,1,0-14.00929h309.07992a7.00464,7.00464,0,0,1,0,14.00929Z" transform="translate(-154.35252 -77.40283)" fill={config.theme === 'dark' ? '#888ea8' : '#e6e6e6'}/>
                                    <path d="M920.07263,565.49973H711.68447a7.00465,7.00465,0,1,1,0-14.00929H920.07263a7.00465,7.00465,0,0,1,0,14.00929Z" transform="translate(-154.35252 -77.40283)" fill={config.theme === 'dark' ? '#888ea8' : '#e6e6e6'}/>
                                    <ellipse cx="554.64354" cy="605.66091" rx="24.50394" ry="2.71961" fill={config.theme === 'dark' ? '#888ea8' : '#e6e6e6'}/>
                                    <ellipse cx="335.64354" cy="285.66091" rx="24.50394" ry="2.71961" fill={config.theme === 'dark' ? '#888ea8' : '#e6e6e6'}/>
                                </svg>
                            </div>

                        </div>

                    </div>
                }

            </div>

        </div>

    );

};
