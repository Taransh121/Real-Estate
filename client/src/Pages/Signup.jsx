import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import OAuth from '../Components/OAuth';

export default function Signup() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState("");
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };
    const signupbtn = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('http://localhost:8080/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.msg != undefined) {
                setLoading(false);
                setError(data.msg);
                return;
            }
            setLoading(false);
            setError(null);
            navigate("/signin");
        } catch (error) {
            setLoading(false);
            setError(error.message);
            alert(error.message);
        }
    }
    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7'>Sign Up</h1>
            <form onSubmit={signupbtn} className='flex flex-col gap-4 '>
                <input onChange={handleChange} required minLength={5} maxLength={20} type="text" placeholder='username' className='border p-3 rounded-lg' id="username" />
                <input onChange={handleChange} required type="email" placeholder='email' className='border p-3 rounded-lg' id="email" />
                <input onChange={handleChange} required type="password" placeholder='password' className='border p-3 rounded-lg' id="password" />
                <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'> {loading ? "Loading..." : "Signup"}</button>
                <OAuth />
            </form>
            <div className="flex gap-2 mt-5">
                <p>Have an Account ?</p>
                <Link className='text-blue-700' to="/signin">Signin</Link>
            </div>
            {error && <p className='text-red-500 mt-5'>{error}</p>}
        </div>
    )
}
