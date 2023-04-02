import React, { useEffect, useState } from "react"
import star from './../assets/star.jpg'
import {
    Button
} from 'react-bootstrap'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
    const navigate = useNavigate();
    const [Email, setEmail] = useState(null)
    const login = async (data) => {
        if (!Email) {
            toast.error("email cannot be null", {
                position: toast.POSITION.TOP_CENTER
            });
            return
        }
        const login = await axios.post(process.env.REACT_APP_API_URL + 'user/login', {
            email: Email
        })
        if (login.status == 200) {
            console.log(login);
            if (login.data.status == true) {
                localStorage.setItem('token', JSON.stringify('lalaala'))
                navigate("/feed");
            } else {
                toast.error(login.data.message, {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        }
    }
    return (
        <>
            <ToastContainer
                position='top-center'
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme='light'
            />
            <div className="bg-white px-3 px-md-5">
                <main>
                    <div className=" mt-5 align-self-center">

                        <div className="row mt-5">
                            <div className="col text-center">
                                <img src={star} alt="award" width="200" height="200" />
                            </div>
                        </div>

                    </div>
                </main>
            </div>

            <div className="bg-white px-3 py-3">
                <main>
                    <div className="">
                        <div className="row">
                            <div className="col-12 m-auto">
                                <div className="px-4">
                                    <div className="mt-3 text-lg text-center">
                                        <h1>Award</h1>
                                    </div>
                                    <div className="mb-2 text-center py-3">
                                        <span>Enter your email addres <br /> to sign in and continue</span>
                                        <input type="text" className="form-control award-form mt-3" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                                    </div>
                                    <Button variant="award" className="btn-block mt-4 award-btn" onClick={() => login()}>Sign in</Button>
                                </div>
                            </div>
                        </div>

                    </div>

                </main>
            </div>
        </>
    )
}