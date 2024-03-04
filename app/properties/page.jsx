"use client";
import { api, host, fix_date, matching } from '@/public/script/public';
import Table from "@/app/component/table";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

export default function Property () {

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
                accessor: 'details', sortable: true,
                render: ({ details, id }) => (
                    <div className="flex items-center font-semibold">
                        <div className="h-7 w-7 rounded-[.5rem] overflow-hidden layer-div ltr:mr-3 rtl:ml-3">
                            <img 
                                src={`${host}/P${details.image_id}`} className="h-full w-full rounded-[.5rem] object-cover" 
                                onLoad={(e) => e.target.src.includes('_icon') ? e.target.classList.add('empty') : e.target.classList.remove('empty')}
                                onError={(e) => e.target.src = `/media/public/empty_icon.png`}
                            />
                        </div>
                        <div className="font-semibold select-text default truncate max-w-[15rem]">{details.name}</div>
                    </div>
                ),
            },
            {
                accessor: 'category', sortable: true,
                render: ({ category, id }) => (
                    <div>
                        {
                            category ?
                            <div className="flex items-center font-semibold pointer hover:text-primary hover:underline" 
                                onClick={() => router.push(`/categories/edit/${category.id}`)}>
                                <div className="h-7 w-7 rounded-[.5rem] overflow-hidden ltr:mr-3 rtl:ml-3">
                                    <img 
                                        src={`${host}/C${category.id}`} className="h-full w-full rounded-[.5rem] object-cover" 
                                        onLoad={(e) => e.target.src.includes('_icon') ? e.target.classList.add('empty') : e.target.classList.remove('empty')}
                                        onError={(e) => e.target.src = `/media/public/empty_icon.png`}
                                    />
                                </div>
                                <div className="font-semibold select-text truncate max-w-[10rem]">{category.name}</div>
                            </div> :
                            <div className="font-semibold select-text default">--</div>
                        }
                    </div>
                ),
            },
            {
                accessor: 'owner', sortable: true,
                render: ({ owner, id }) => (
                    <div>
                        {
                            owner ?
                            <div className="flex items-center font-semibold pointer hover:text-primary hover:underline" 
                                onClick={() => router.push(`/owners/edit/${owner.id}`)}>
                                <div className="h-7 w-7 rounded-full overflow-hidden ltr:mr-3 rtl:ml-3 mt-[-2px]">
                                    <img className="h-full w-full rounded-full object-cover" src={`${host}/U${owner.id}`} 
                                    onError={(e) => e.target.src='/media/public/user_icon.png'}/>
                                </div>
                                <div className="font-semibold select-text truncate max-w-[10rem]">{owner.name}</div>
                            </div> :
                            <div className="font-semibold select-text default">--</div>
                        }
                    </div>
                ),
            },
            {
                accessor: 'new_price', sortable: true, title: 'Price',
                render: ({ new_price, id }) => <div className="font-semibold select-text default">{new_price} RAS</div>,
            },
            {
                accessor: 'bookings', sortable: true,
                render: ({ bookings, id }) => <div className="font-semibold select-text default">{bookings}</div>,
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

        const response = await api('product', {user: config.user.id});
        setData(response.data || []);

    }
    const delete_ = async( ids ) => {

        const response = await api('product/delete', {ids: JSON.stringify(ids), user: config.user.id});
        return response;
        
    }
    const search = ( items, query ) => {

        let result = items.filter((item) => 
            matching(`--${item.id}`, query) ||
            matching(item.details?.name, query) ||
            matching(item.category?.name, query) ||
            matching(item.new_price, query) ||
            matching(item.bookings, query) ||
            matching(item.active ? 'active' : 'stopped', query) ||
            matching(item.create_date, query) ||
            matching(fix_date(item.create_date), query)
        );

        return result;

    }
    useEffect(() => {

        document.title = "All Property";
        get();

    }, []);

    return (

        <Table 
            columns={columns} data={data} delete_={delete_} search={search} async_search={false} btn_name="Add Property"
            add={() => router.push(`/properties/add`)} edit={(id) => router.push(`/properties/edit/${id}`)} 
            no_delete={!data.length || !config.user.delete_products} no_search={!data.length} 
            no_add={!config.user.add_products} no_edit={!config.user.see_products}
        />

    );

};
