"use client";
import { api, host, matching, fix_date } from '@/public/script/public';
import Table from "@/app/component/table";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function Owners () {

    const router = useRouter();
    const config = useSelector((state) => state.config);
    const [data, setData] = useState([]);

    const columns = () => {
        
        return [
            {
                accessor: 'invoice', sortable: true, title: 'ID',
                render: ({ id }) => <div className="font-semibold select-text default">{id}</div>,
            },
            {
                accessor: 'name', sortable: true, title: 'Name',
                render: ({ name, id }) => (
                    <div className="flex items-center font-semibold">
                        <div className="h-7 w-7 rounded-full overflow-hidden layer-div ltr:mr-3 rtl:ml-3 -mt-[2px]">
                            <img 
                                src={`${host}/U${id}`} className="h-full w-full rounded-full object-cover" 
                                onLoad={(e) => e.target.src.includes('_icon') ? e.target.classList.add('empty') : e.target.classList.remove('empty')}
                                onError={(e) => e.target.src = `/media/public/user_icon.png`}
                            />
                        </div>
                        <div className="font-semibold select-text default truncate max-w-[15rem]">{name}</div>
                    </div>
                ),
            },
            {
                accessor: 'products', sortable: true, title: 'Properties',
                render: ({ products, id }) => <div className="font-semibold select-text default truncate max-w-[15rem]">{products}</div>,
            },
            {
                accessor: 'orders', sortable: true, title: 'Bookings',
                render: ({ orders, id }) => <div className="font-semibold select-text default truncate max-w-[10rem]">{orders}</div>,
            },
            {
                accessor: 'balance', sortable: true, title: 'Balance',
                render: ({ balance, id }) => <div className="font-semibold select-text default truncate max-w-[15rem]">{balance} RAS</div>,
            },
            {
                accessor: 'active', sortable: true, title: 'Status',
                render: ({ active, id }) => <span className={`badge badge-outline-${active ? 'success' : 'danger'}`}>{active ? 'Active' : 'Stopped'}</span>,
            },
            {
                accessor: 'create_date', sortable: true, title: 'Date',
                render: ({ create_date, id }) => <div className="font-semibold select-text default">{fix_date(create_date)}</div>,
            },
        ];

    }
    const get = async() => {

        const response = await api('user', {role: 2, user: config.user.id});
        setData(response.data || []);

    }
    const delete_ = async( ids ) => {

        const response = await api('user/delete', {ids: JSON.stringify(ids), role: 2, user: config.user.id});
        return response;
        
    }
    const search = ( items, query ) => {

        let result = items.filter((item) => 
            matching(`--${item.id}`, query) ||
            matching(item.name, query) ||
            matching(item.email, query) ||
            matching(item.phone, query) ||
            matching(item.country, query) ||
            matching(item.city, query) ||
            matching(item.street, query) ||
            matching(item.balance, query) ||
            matching(item.active ? 'active' : 'stopped', query) ||
            matching(item.create_date, query) ||
            matching(fix_date(item.create_date), query) 
        );

        return result;

    }
    useEffect(() => {

        document.title = "All Owners";
        get();

    }, []);

    return (

        <Table 
            columns={columns} data={data} delete_={delete_} search={search} async_search={false} btn_name="Add Owner"
            add={() => router.push(`/owners/add`)} edit={(id) => router.push(`/owners/edit/${id}`)} 
            no_delete={!data.length || !config.user.delete_owners} no_search={!data.length} 
            no_add={!config.user.add_owners} no_edit={!config.user.see_owners}
        />
        
    );

};
