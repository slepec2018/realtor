import React, { useEffect, useState } from "react";
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { useNavigate } from 'react-router-dom';

import Spinner from "./Spinner";


export default function Slider() { 
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => { 
    async function fetchListings() { 
      const listingsRef = collection(db, 'listings');
      const q = query(listingsRef, orderBy('timestamp', 'desc'), limit(5));
      const querySnap = await getDocs(q);
      let listings = [];

      querySnap.forEach((doc) => { 
        return listings.push({
          id: doc.id,
          data: doc.data()
        });
      })

      setListings(listings);
      setLoading(false);
    }

    fetchListings();
  }, [])

  if (loading) {
    return <Spinner />
  }

  if (listings.length === 0) {
    return <></>;
  }

  return (
    <>
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        autoplay={{ delay: 3000 }}
      >
        {listings.map(({ data, id }) => (
          <SwiperSlide key={id} onClick={() => navigate(`/category/${data.type}/${id}`)}>
            <div style={{ background: `url(${data.imgUrls[0]}) center no-repeat`, backgroundSize: 'cover' }}
            className="w-full h-[300px] overflov-hidden relative">
              <p className="text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] shadow-lg opacity-90
                p-2 rounded-br-2xl">
                {data.name}
              </p>
              <p className="text-[#f1faee] absolute left-1 bottom-1 font-semibold max-w-[90%] bg-[#e63946] shadow-lg opacity-90
                p-2 rounded-tr-3xl">
                ${data.discountedPrice
                  ? data.discountedPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  : data.regularPrice
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                }
                {data.type === 'rent' ? ' /month' : ''}
              </p>
            </div>
          </SwiperSlide>
        ))} 
      </Swiper>
    </>
  )
}