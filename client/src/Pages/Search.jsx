import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ListingItem from '../Components/ListingItem';

export default function Search() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [listings, setListings] = useState(false);
    const [showMore, setShowMore] = useState(false);
    // console.log(listings);
    const [sidebarData, setSidebarData] = useState({
        searchTerm: "",
        type: "all",
        furnished: false,
        parking: false,
        offer: false,
        sort: "createdAt",
        order: "desc"
    });
    // HandleChange() function - When a checkbox with the IDs "all," "rent," or "sale" is clicked, it updates the type property in the sidebarData state to the corresponding checkbox ID.This ensures that only one type can be selected at a time (exclusive selection).
    // Search Term Input - When the input field with the ID "searchTerm" changes, it updates the searchTerm property in the sidebarData state with the  current value of the input.
    // Amenities Selection (Parking, Furnished, Offer) - When a checkbox with the IDs "parking," "furnished," or "offer" is clicked, it updates the corresponding property in the sidebarData state based on the checkbox's checked status.
    // Sort Order Selection - When the value of the dropdown with the ID "sort_order" changes, it extracts the sort and order values from the selected option's value and updates the sort and order properties in the sidebarData state. Overall, the handleChange function provides a dynamic way to update the state based on various form input changes, making the component interactive and responsive to user input.
    const handleChange = (e) => {
        if (e.target.id === "all" || e.target.id === "rent" || e.target.id === "sale") {
            setSidebarData({
                ...sidebarData,
                type: e.target.id
            })
        }
        if (e.target.id === "searchTerm") {
            setSidebarData({
                ...sidebarData,
                searchTerm: e.target.value
            })
        }
        if (e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
            setSidebarData({
                ...sidebarData,
                [e.target.id]: e.target.checked || e.target.checked === "true" ? true : false
            })
        }
        if (e.target.id === "sort_order") {
            const sort = e.target.value.split('_')[0] || 'createdAt';
            const order = e.target.value.split('_')[1] || 'desc';
            setSidebarData({
                ...sidebarData,
                sort,
                order
            })
        }
    }
    //useEffect will change the data of sidebar anytime someone changes the data in the url .
    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const parkingFromUrl = urlParams.get('parking');
        const furnishedFromUrl = urlParams.get('furnished');
        const offerFromUrl = urlParams.get('offer');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if (searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl || orderFromUrl) {
            setSidebarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                parking: parkingFromUrl === 'true' ? true : false,
                furnished: furnishedFromUrl === 'true' ? true : false,
                offer: offerFromUrl === 'true' ? true : false,
                sort: sortFromUrl || 'createdAt',
                order: orderFromUrl || 'desc',
            });
        }

        const fetchListings = async () => {
            setLoading(true);
            setShowMore(false);
            const searchQuery = urlParams.toString();
            const res = await fetch(`https://real-estate-bokm.onrender.com/api/listing/get?${searchQuery}`);
            const data = await res.json();
            if (data.length > 8) {
                setShowMore(true);
            } else {
                setShowMore(false);
            }
            setListings(data);
            setLoading(false);
        }

        fetchListings();
    }, [location.search]);



    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams();
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('type', sidebarData.type);
        urlParams.set('parking', sidebarData.parking);
        urlParams.set('furnished', sidebarData.furnished);
        urlParams.set('offer', sidebarData.offer);
        urlParams.set('sort', sidebarData.sort);
        urlParams.set('order', sidebarData.order);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`)
    }

    const onShowMoreClick = async () => {
        const numberOfListings = listings.length;
        const startIndex = numberOfListings;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set("startIndex", startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`http://localhost:8080/api/listing/get?${searchQuery}`);
        const data = await res.json();
        if (data.length < 8) {
            setShowMore(false);
        }
        setListings([...listings, ...data]);
    }
    return (
        <div className='flex flex-col md:flex-row'>
            <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
                <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                    <div className="flex items-center gap-2">
                        <label className='whitespace-nowrap font-semibold'>Search Term : </label>
                        <input value={sidebarData.searchTerm} onChange={handleChange} type="text" id="searchTerm" placeholder='Search... ' className='border rounded-lg p-3 w-full' />
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>Type: </label>
                        <div className="flex gap-2 ">
                            <input checked={sidebarData.type === "all"} onChange={handleChange} type="checkbox" id="all" className='w-5' />
                            <span>Rent & Sale</span>
                        </div>
                        <div className="flex gap-2 ">
                            <input checked={sidebarData.type === "rent"} onChange={handleChange} type="checkbox" id="rent" className='w-5' />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2 ">
                            <input checked={sidebarData.type === "sale"} onChange={handleChange} type="checkbox" id="sale" className='w-5' />
                            <span>Sale</span>
                        </div>
                        <div className="flex gap-2 ">
                            <input checked={sidebarData.offer} onChange={handleChange} type="checkbox" id="offer" className='w-5' />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className='flex gap-2 flex-wrap items-center'>
                        <label className='font-semibold'>Amenties: </label>
                        <div className="flex gap-2 ">
                            <input checked={sidebarData.parking} onChange={handleChange} type="checkbox" id="parking" className='w-5' />
                            <span>Parking</span>
                        </div>
                        <div className="flex gap-2 ">
                            <input checked={sidebarData.furnished} onChange={handleChange} type="checkbox" id="furnished" className='w-5' />
                            <span>Furnished</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-2'>
                        <label className='font-semibold'>Sort:</label>
                        <select onChange={handleChange} defaultValue={"createdAt_desc"} className='border rounded-lg p-3' id="sort_order">
                            <option value="regularPrice_desc">Price high to low</option>
                            <option value="regularPrice_asc">Price Low to High</option>
                            <option value="createdAt_desc">Latest</option>
                            <option value="createdAt_asc">Oldest</option>
                        </select>
                    </div>
                    <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Search</button>
                </form>
            </div>
            <div className="flex-1">
                <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing Results</h1>
                <div className="p-7 flex flex-wrap  gap-4">
                    {
                        !loading && listings.length === 0 && (
                            <p className='text-xl text-slate-700'>No listing found.</p>
                        )
                    }
                    {
                        loading && (
                            <p className='w-full text-xl text-center text-slate-700'>Loading...</p>
                        )
                    }
                    {
                        !loading && listings && listings.map((listing) => (
                            <ListingItem key={Math.random()} listing={listing} />
                        ))
                    }{
                        showMore && (
                            <button className='text-green-700 hover:underline p-7 text-center w-full' onClick={onShowMoreClick}>Show More</button>
                        )
                    }
                </div>
            </div>
        </div>
    )
}
