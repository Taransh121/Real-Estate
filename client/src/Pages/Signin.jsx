import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';


export default function Signin() {
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    const signinbtn = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/api/auth/signin', { email, password });
            const responseData = response.data;
            // console.log(responseData);
            if (responseData.success === false) {
                setLoading(false);
                setError(responseData.message);
                return;
            }
            setLoading(false);
            setError(null);
            navigate("/");
        } catch (error) {
            setLoading(false);
            setError(error.message);
            alert(error.message);
        }
    }

    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl text-center font-semibold my-7'>Sign In</h1>
            <form onSubmit={signinbtn} className='flex flex-col gap-4 '>
                <input onChange={handleEmailChange} required value={email} type="email" placeholder='email' className='border p-3 rounded-lg' id="email" />
                <input onChange={handlePasswordChange} required value={password} type="password" placeholder='password' className='border p-3 rounded-lg' id="password" />
                <button disabled={loading} className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'> {loading ? "Loading..." : "Signin"}</button>
            </form>
            <div className="flex gap-2 mt-5">
                <p>Dont Have an Account ?</p>
                <Link className='text-blue-700' to="/signup">Signup</Link>
            </div>
            {error && <p className='text-red-500 mt-5'>{error}</p>}
        </div>
    )
}
