import React, { useEffect, useState } from 'react';
import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux";

export default function Header() {
    const { currentUser } = useSelector(state => state.user);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set("searchTerm", searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    }
    // HandleSubmit() - 
    // It creates a new URLSearchParams object from the current window's location search parameters.
    // It sets the "searchTerm" parameter in the URL to the current value of searchTerm.
    // It converts the updated search parameters back to a string (searchQuery).
    // Finally, it uses the navigate function (provided by the useNavigate hook from react-router-dom) to navigate to the "/search" route with the updated search query.

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);
    // useEffect() - In this case, it is used to synchronize the searchTerm state with the value in the URL's search parameters.
    // It runs when the component mounts (initial render) and whenever the location.search value changes.
    // Inside the effect, it creates a new URLSearchParams object from the current location's search parameters.
    // It retrieves the value of the "searchTerm" parameter from the URL.
    // If a searchTerm is found in the URL, it updates the local state using setSearchTerm, ensuring that the component reflects the URL state.

    return (
        <header className='bg-slate-200 shadow-md'>
            <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
                <Link to="/">
                    <h1 className='font-bold flex flex-wrap text-sm sm:text-xl'>
                        <span className='text-slate-500'>Prime</span>
                        <span className='text-slate-700'>Estate</span>
                    </h1>
                </Link>
                <form onSubmit={handleSubmit} className='bg-slate-100 p-3 rounded-lg flex items-center'>
                    <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} type="text" placeholder='Search...' className='bg-transparent focus:outline-none w-24 sm:w-64' />
                    <button>
                        <FaSearch className='text-slate-600' />
                    </button>
                </form>
                <ul className='flex gap-4 '>
                    <Link to="/">
                        <li className='hidden sm:inline text-slate-700 hover:underline cursor-pointer'>Home</li>
                    </Link>
                    <Link to="/about">
                        <li className='hidden sm:inline text-slate-700 hover:underline cursor-pointer'>About</li>
                    </Link>
                    <Link to="/profile">
                        {currentUser ?
                            <img src={currentUser.avatar} className='rounded-full h-7 w-7 object-cover' alt='profileImage' />
                            :
                            <li className=' text-slate-700 hover:underline cursor-pointer'>Signin</li>
                        }
                    </Link>
                </ul>
            </div>
        </header>
    )
}
