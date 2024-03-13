"use client";
import { api, matching, host, fix_date, print } from '@/public/script/public';
import Table from "@/app/component/table";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function Bookings () {

    const router = useRouter();
    const config = useSelector((state) => state.config);
    const [data, setData] = useState([]);

    const columns = () => {
        
        return [
            {
                accessor: 'id', sortable: true, title: 'id',
                render: ({ id }) => <div className="font-semibold select-text default">{id}</div>,
            },
            {
                accessor: 'user', sortable: true, title: 'guest',
                render: ({ user, id }) => 
                    user.id ?
                    <div className="flex items-center font-semibold default">
                        <div className="h-7 w-7 rounded-full overflow-hidden ltr:mr-3 rtl:ml-3 -mt-[2px]">
                            <img 
                                src={`${host}/U${user.id}`} className="h-full w-full rounded-full object-cover" 
                                onLoad={(e) => e.target.src.includes('_icon') ? e.target.classList.add('empty') : e.target.classList.remove('empty')}
                                onError={(e) => e.target.src = `/media/public/user_icon.png`}
                            />
                        </div>
                        <div className="font-semibold select-text truncate max-w-[12rem]">{user.name}</div>
                    </div> : <div className="font-semibold select-text">--</div>
                ,
            },
            {
                accessor: 'product', sortable: true, title: 'product',
                render: ({ product, id }) =>
                    product.id ?
                    <div className="flex items-center font-semibold pointer hover:text-primary hover:underline" 
                        onClick={() => router.push(`/properties/edit/${product.id}`)}>
                        <div className="h-7 w-7 rounded-[.5rem] overflow-hidden ltr:mr-3 rtl:ml-3">
                            <img 
                                src={`${host}/P${product.image}`} className="h-7 w-7 rounded-[.5rem] overflow-hidden ltr:mr-3 rtl:ml-3" 
                                onLoad={(e) => e.target.src.includes('_icon') ? e.target.classList.add('empty') : e.target.classList.remove('empty')}
                                onError={(e) => e.target.src = `/media/public/empty_icon.png`}
                            />
                        </div>
                        <div className="font-semibold select-text truncate max-w-[12rem]">{product.name}</div>
                    </div> : <div className="font-semibold select-text">--</div>
                ,
            },
            {
                accessor: 'price', sortable: true, title: 'price',
                render: ({ price, id }) => <div className="font-semibold select-text default">{price} {config.text.currency}</div>,
            },
            {
                accessor: 'paid', sortable: true, title: 'paid',
                render: ({ paid, id }) => <span className={`badge badge-outline-${paid ? 'success' : 'danger'}`}>
                    {paid ? config.text.paid : config.text.not_paid}
                </span>,
            },
            {
                accessor: 'status', sortable: true, title: 'status',
                render: ({ status, id }) => 
                status === 1 ?
                    <span className='badge badge-outline-warning'>{config.text.pending}</span>
                : status === 2 ?
                    <span className='badge badge-outline-warning'>{config.text.stopped}</span>
                : status === 3 ?
                    <span className='badge badge-outline-danger'>{config.text.cancelled}</span>
                :
                    <span className='badge badge-outline-success'>{config.text.confirmed}</span>
                ,
            },
            {
                accessor: 'create_date', sortable: true, title: 'date',
                render: ({ create_date, id }) => <div className="font-semibold select-text default">{fix_date(create_date)}</div>,
            },
        ];

    }
    const get = async() => {

        const response = await api('booking', {token: config.user.token});
        setData(response.data || []);

    }
    const delete_ = async( ids ) => {

        await api('booking/delete', {ids: JSON.stringify(ids), token: config.user.token});

    }
    const search = ( items, query ) => {

        let result = items.filter((item) => 
            matching(`--${item.id}`, query) ||
            matching(item.user?.name, query) ||
            matching(item.product?.name, query) ||
            matching(item.price, query) ||
            matching(item.discount, query) ||
            matching(item.paid ? 'paid' : 'no', query) ||
            matching(item.status === 1 ? 'pending' : item.status === 2 ? 'stopped' : item.status === 3 ? 'cancelled' : 'confirmed', query) ||
            matching(item.date, query)
        );

        return result;

    }
    useEffect(() => {

        document.title = config.text.all_bookings || '';
        get();

    }, []);

    return (

        <Table 
            columns={columns} data={data} delete_={delete_} search={search} async_search={false} btn_name="add_booking"
            add={() => router.push(`/bookings/add`)} edit={(id) => router.push(`/bookings/edit/${id}`)} 
            no_delete={!data.length || !config.user.delete_bookings} no_search={!data.length} 
            no_add={!config.user.add_bookings} no_edit={!config.user.see_bookings}
        />

    );

};
