import React, { useEffect, useRef, useState } from "react"
import { Navigate, useNavigate } from "react-router-dom";
import { HiMenuAlt2, HiMenu } from "react-icons/hi";
import star from './../assets/star.jpg'
import axios from "axios";
import InfiniteScroll from 'react-infinite-scroller';
import { BackgroundImage } from "react-image-and-background-image-fade";

export default function FeedPage() {
    const navigate = useNavigate()
    let Params = {
        limit: 4,
        offset: 1,
        type: null,
        pointMin: null,
        pointMax: null
    }
    const [VouchersFilter, setVouchersFilter] = useState(false)
    const [ProductsFilter, setProductsFilter] = useState(false)
    const [OthersFilter, setOthersFilter] = useState(false)
    const [AllFilter, setAllFilter] = useState(false)
    const [MinPointFilter, setMinPointFilter] = useState(null)
    const [MaxPointFilter, setMaxPointFilter] = useState(null)
    const [awardDatas, setAwardDatas] = useState([])

    const listInnerRef = useRef();
    const Logout = async () => {
        localStorage.clear()
        navigate('/')
    }
    const ToFeed = async () => {
        navigate('/feed')
        navigate(0)
    }

    const ListAward = async (origin = null) => {
        let type = []
        if (AllFilter) {
            type.push('Vouchers')
            type.push('Products')
            type.push('Giftcard')
        } else {
            if (OthersFilter) type.push('Giftcard')
            if (ProductsFilter) type.push('Products')
            if (VouchersFilter) type.push('Vouchers')
        }
        Params = {
            ...Params,
            pointMin: MinPointFilter,
            pointMax: MaxPointFilter,
            type
        }
        const award = await axios.get(process.env.REACT_APP_API_URL + 'award/list', {
            params: Params
        })
        // if (origin) {
        //     console.log(origin);
        // } else {
        //     setAwardDatas(award)
        // }
        console.log(awardDatas, "list award");
        console.log(award?.data?.data.rows, 'rows');
        setAwardDatas(awardDatas.concat(award?.data?.data.rows))

    }

    const CheckAllFilter = async () => {
        if (VouchersFilter && ProductsFilter && OthersFilter) {
            setAllFilter(true)
        } else {
            setAllFilter(false)
        }
    }

    const ClearAllFilter = () => {
        setAllFilter(false)
        setVouchersFilter(false)
        setProductsFilter(false)
        setOthersFilter(false)
        setMaxPointFilter(null)
        setMinPointFilter(null)
    }

    const onScroll = () => {
        const bottom = Math.ceil(window.innerHeight + window.scrollY) == document.documentElement.scrollHeight
        if (bottom) {
            Params.offset += 1
            ListAward()
        }
    };

    const style = {
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover"
    };

    useEffect(() => {
        ListAward()
        window.addEventListener('scroll', onScroll, {
            passive: true
        });

        return () => {
            window.removeEventListener('scroll', onScroll);
        };
    }, []);
    return (
        <>
            <div className="bg-white" onScroll={() => { onScroll() }} ref={listInnerRef}>
                <main>
                    <div className="align-self-center">
                        <div className="row">
                            <div className="d-flex justify-content-between">
                                <button type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample" style={{ all: "unset" }}>
                                    <HiMenuAlt2 />
                                </button>
                                <span className="text">Awards</span>
                                <button data-bs-toggle="offcanvas" data-bs-target="#offcanvasTop" aria-controls="offcanvasTop" style={{ all: "unset" }}>
                                    <HiMenu />
                                </button>

                            </div>
                        </div>
                        <div className="row py-5">

                            {
                                (awardDatas.length > 0) ?
                                    awardDatas.map((v, k) => {
                                        return (
                                            <div className="col-12 pb-3">

                                                <div className="card">
                                                    <div className="card-body bg-light">
                                                        <BackgroundImage
                                                            src={process.env.REACT_APP_API_URL + '' + v.image}
                                                            width="800px"
                                                            height="350px"
                                                            isResponsive
                                                            style={style}
                                                            className="image"
                                                            lazyLoad
                                                        >
                                                        </BackgroundImage>
                                                        <h5 className={` card-title text-right ${(v.type == 'Vouchers') ? 'text-primary' : (v.type == 'Products') ? 'text-danger' : 'text-warning'} `}>{v.type}</h5>

                                                        <p className="card-text">{v.point}</p>
                                                        {/* <img src={process.env.REACT_APP_API_URL + 'star.jpg'} className="card-img-fluid" /> */}

                                                    </div>
                                                </div>
                                                <span>{v.name}</span>
                                            </div>
                                        )
                                    }) : 'No Awards Found'
                            }

                        </div>
                    </div>
                </main >

                <div className="offcanvas offcanvas-start" tabIndex={-1} id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
                    <div className="offcanvas-body py-5">
                        <div className="text-center">
                            <img src={star} alt="award" width="100" height="100" />
                        </div>
                        <div className="">
                            <ul className="list-group list-group-flush py-5">
                                <li className="list-group-item py-3 text-bold">Award Menu</li>
                                <li className="list-group-item py-2" onClick={() => { ToFeed() }}>Home</li>
                                <li className="list-group-item py-3">Card</li>
                                <li className="list-group-item py-3">Profile</li>
                                <li className="list-group-item py-3 cursor-pointer" onClick={() => { Logout() }}>Logout</li>
                            </ul>

                        </div>
                    </div>
                </div>


                <div className="offcanvas offcanvas-top " tabIndex={-1} id="offcanvasTop" aria-labelledby="offcanvasTopLabel">
                    <div className="offcanvas-header">
                        <h5 id="offcanvasTopLabel">Filter</h5>
                        <button type="button" className="btn-close text-reset" data-bs-dismiss="offcanvas" aria-label="Close" />
                    </div>
                    <div className="offcanvas-body">
                        {(MinPointFilter && MaxPointFilter) ?
                            <button type="button" class="btn-custom-white mb-2">
                                Point {MinPointFilter} - {MaxPointFilter} <span class="badge bg-primary ms-2" onClick={() => { setMinPointFilter(null); setMaxPointFilter(null); }}> X</span>
                            </button> : ''
                        }
                        {
                            (VouchersFilter || ProductsFilter || OthersFilter) ?
                                <button type="button" class="btn-custom-white mb-2">
                                    Type: {(VouchersFilter) ? 'Vouchers' : ''} {(ProductsFilter) ? 'Products' : ''} {(OthersFilter) ? 'Others' : ''}
                                    <span class="badge bg-primary ms-2" onClick={() => { setAllFilter(false); setVouchersFilter(false); setProductsFilter(false); setOthersFilter(false) }}> X</span>
                                </button>
                                : ''
                        }
                        {
                            ((VouchersFilter || ProductsFilter || OthersFilter) && MinPointFilter && MaxPointFilter) ?
                                <button type="button" class="btn-custom-white mb-2">
                                    Clear all filter <span class="badge bg-primary ms-2" onClick={() => { ClearAllFilter() }}> X</span>
                                </button>
                                : ''
                        }
                        <div className="py-3">
                            <label htmlFor="customRange3" className="form-label">Point Needed</label>
                            <div className="d-flex justify-content-between">
                                <span className="text tex-primary">IDR 1000</span>
                                <span className="text tex-primary">IDR 3000</span>
                            </div>
                            <input type="range" className="form-range" min={1000} max={3000} step="100" id="customRange3" onClick={(e) => { setMaxPointFilter(e.target.value); setMinPointFilter(1000) }} />
                        </div>
                        <div className="py-3">
                            <span>Award type</span>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" onClick={(e) => { setAllFilter(e.target.checked); setVouchersFilter(e.target.checked); setProductsFilter(e.target.checked); setOthersFilter(e.target.checked) }} checked={AllFilter} />
                                <label className="form-check-label" htmlFor="flexCheckDefault">
                                    All type
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" onClick={(e) => { setVouchersFilter(e.target.checked); CheckAllFilter() }} checked={VouchersFilter} />
                                <label className="form-check-label" htmlFor="flexCheckChecked">
                                    Vouchers
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" onClick={(e) => { setProductsFilter(e.target.checked); CheckAllFilter() }} checked={ProductsFilter} />
                                <label className="form-check-label" htmlFor="flexCheckChecked">
                                    Products
                                </label>
                            </div>
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" onClick={(e) => { setOthersFilter(e.target.checked); CheckAllFilter() }} checked={OthersFilter} />
                                <label className="form-check-label" htmlFor="flexCheckChecked">
                                    Others
                                </label>
                            </div>
                        </div>
                    </div>
                    <button type="button" data-bs-dismiss="offcanvas" aria-label="Close" className="btn btn-primary footer" onClick={async () => { await ListAward() }}>Filter</button>
                </div>
            </div >
        </>
    )
}