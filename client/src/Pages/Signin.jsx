import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { signInStart, signInFailure, signInSuccess } from '../Redux/User/UserSlice';
import OAuth from '../Components/OAuth';

export default function Signin() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const { error, loading } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };
    const signinbtn = async (e) => {
        e.preventDefault();
        dispatch(signInStart());
        try {
            const res = await fetch('http://localhost:8080/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // withCredentials: true,
                // sameSite: 'None',
                // secure: true,
                // credentials: 'include',
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.msg != undefined) {
                dispatch(signInFailure(data.msg));
                return;
            }
            dispatch(signInSuccess(data));
            navigate("/");
        } catch (error) {
            dispatch(signInFailure(error.msg));
            alert(error.message);
        }
    }

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
            <form onSubmit={signinbtn} className='flex flex-col gap-4 '>
                <input onChange={handleChange} required type="email" placeholder='email' className='border p-3 rounded-lg' id="email" />
                <input onChange={handleChange} required type="password" placeholder='password' className='border p-3 rounded-lg' id="password" />
                <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'> {loading ? "Loading..." : "Signin"}</button>
                <OAuth />
            </form>
            <div className="flex gap-2 mt-5">
                <p>Dont Have an Account ?</p>
                <Link className='text-blue-700' to="/signup">Signup</Link>
            </div>
            {error && <p className='text-red-500 mt-5'>{error}</p>}
        </div>
    )
}
