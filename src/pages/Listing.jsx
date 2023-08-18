import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Spinner from '../components/Spinner';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import {FaShare} from 'react-icons/fa';

export default function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);

  useEffect(() => { 
    async function fetchListing() { 
      const docRef = doc(db, "listings", params.listingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) { 
        setListing(docSnap.data());
        setLoading(false);
      }
    }

    fetchListing();
  }, [params.listingId]);

  if (loading) { 
    return <Spinner />
  }

  return (
    <main>
      <Swiper
        modules={[Autoplay, Navigation, Pagination, EffectFade]}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div style={{ background: `url(${listing.imgUrls[index]}) center no-repeat`, backgroundSize: 'cover' }}
              className='w-full overflow-hidden h-[300px] relative'>

            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className='fixed top-[13%] right-[3%] z-10 bg-white cursor-pointer border-2 border-gray-400 rounded-full
        w-12 h-12 flex justify-center items-center'>
        <FaShare onClick={() => {
          navigator.clipboard.writeText(window.location.href);
          setShareLinkCopied(true);
          setTimeout(() => { 
            setShareLinkCopied(false);
          }, 2000);
        }} className='text-lg text-slate-500' />
      </div>
      {shareLinkCopied && (
        <p className='fixed top-[23%] right-[5%] font-semibold border-2 border-gray-400 rounded-md bg-white z-10 p-2'>
          Link Copied
        </p>
      )}
    </main>
  )
}