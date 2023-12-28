import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from '../firebase';
import { updateUserFailure, updateUserStart, updateUserSuccess } from '../Redux/User/UserSlice';

export default function Profile() {
    const fileRef = useRef(null);
    const { currentUser } = useSelector(state => state.user);
    const [file, setFile] = useState(undefined);
    const [formData, setFormData] = useState({});
    const [filePerc, setFilePerc] = useState(0);
    const [fileUploadError, setFileUploadError] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        if (file) {
            handleFileUpload(file);
        }
    }, [file]);
    const handleFileUpload = () => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFilePerc(Math.round(progress));
            },
            (error) => {
                setFileUploadError(true);
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
                    setFormData({ ...formData, avatar: downloadURL })
                );
            }
        );
    }
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch(updateUserStart())
        try {
            const res = await fetch(`http://localhost:8080/api/user/update/${currentUser._id}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            console.log(data);
            if (data.msg != undefined) {
                dispatch(updateUserFailure(data.msg));
                return;
            }
            dispatch(updateUserSuccess(data));
        } catch (error) {
            dispatch(updateUserFailure(error.msg));
            alert(error.message);
        }
    }
    return (
        <div className='p-3 max-w-lg mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept='image/' />
                <img onClick={() => fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt='ProfileImage' className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2'></img>
                <p className='text-sm self-center'>
                    {fileUploadError ? (
                        <span className='text-red-700'>
                            Error Image upload (image must be less than 2 mb)
                        </span>
                    ) : filePerc > 0 && filePerc < 100 ? (
                        <span className='text-slate-700'>{`Uploading ${filePerc}%`}</span>
                    ) : filePerc === 100 ? (
                        <span className='text-green-700'>Image successfully uploaded!</span>
                    ) : (
                        ''
                    )}
                </p>
                <input onChange={handleChange} defaultValue={currentUser.username} type="text" id='username' placeholder='username' className='border p-3 rounded-lg' />
                <input onChange={handleChange} defaultValue={currentUser.email} type="email" id='email' placeholder='email' className='border p-3 rounded-lg' />
                <input onChange={handleChange} type="password" id='password' placeholder='password' className='border p-3 rounded-lg' />
                <button className='text-white bg-slate-700 rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80'>Update</button>
            </form>
            <div className='flex justify-between mt-5'>
                <span className='text-red-700 cursor-pointer'>Delete Account</span>
                <span className='text-red-700 cursor-pointer'>Signout</span>
            </div>
        </div>
    )
}
