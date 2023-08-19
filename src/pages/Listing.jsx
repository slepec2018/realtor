import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import Spinner from '../components/Spinner';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay, Navigation, Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { FaShare, FaMapMarkerAlt, FaBed, FaBath, FaParking, FaChair } from 'react-icons/fa';
import { getAuth } from 'firebase/auth';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import Contact from '../components/Contact';

export default function Listing() {
  const params = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [shareLinkCopied, setShareLinkCopied] = useState(false);
  const [contactLandlord, setContactLandlord] = useState(false);

  const auth = getAuth();

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
      <div className='flex flex-col md:flex-row max-w-6xl lg:mx-auto m-4 p-4 rounded-lg shadow-lg bg-white lg:space-x-5'> 
        <div className='w-full'>
          <p className='text-2xl font-bold mb-3 text-blue-900 '>
            {listing.name} - $ {listing.offer
              ? listing.discountedPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
            {listing.type === 'rent' ? '/month' : ''}
          </p>
          <p className='flex items-center mt-6 mb-3 font-semibold'>
            <FaMapMarkerAlt className='text-green-700 mr-1' />
            {listing.address}
          </p>
          <div className='flex justify-start items-center space-x-4 w-[75%]'>
            <p className='bg-red-800 w-full max-w-[200px] rounded-md p-1 text-white text-center font-semibold shadow-md'>
              {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
            </p>
            {listing.offer && (
              <p className='w-full max-w-[200px] bg-green-800 rounded-md p-1 text-white text-center font-semibold shadow-md'>
                $ {+listing.regularPrice - +listing.discountedPrice} discount
              </p>
            )}
          </div>
          <p className='mt-3 mb-3'>
            <span className='font-semibold'>Description - </span>
            {listing.discription}
          </p>
          <ul className='flex items-center space-x-2 lg:space-x-10 text-sm font-semibold mb-6'>
            <li className='flex items-center whitespace-nowrap'>
              <FaBed className='text-lg mr-1' />
              {+listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : `1 Bed`}
            </li>
            <li className='flex items-center whitespace-nowrap'>
              <FaBath className='text-lg mr-1' />
              {+listing.bathrooms > 1 ? `${listing.bathroom} Baths` : `1 Bath`}
            </li>
            <li className='flex items-center whitespace-nowrap'>
              <FaParking className='text-lg mr-1' />
              {listing.parking > 1 ? `Parking Spot` : `No Parking`}
            </li>
            <li className='flex items-center whitespace-nowrap'>
              <FaChair className='text-lg mr-1' />
              {listing.furnished ? `Furnished` : `Not furnished`}
            </li>
          </ul>
          {listing.userRef !== auth.currentUser?.uid && !contactLandlord && (
            <div className='mt-6'>
              <button onClick={() => setContactLandlord(true)} className='px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md
                hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg w-full text-center transition duration-150
                ease-in-out'>
                Contact Landlord
              </button>
            </div>
          )}
          {contactLandlord && (
            <Contact userRef={listing.userRef} listing={listing} />
          )}
        </div>
        <div className='w-full h-[200px] md:h-[400px] z-10 overflow-hidden mt-6 md:mt-0 md:ml-2'>
          <MapContainer
            center={[listing.geolocation.lat, listing.geolocation.lng]}
            zoom={13}
            scrollWheelZoom={false}
            className='w-full h-full'
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={[listing.geolocation.lat, listing.geolocation.lng]}>
              <Popup>
                {listing.name}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </main>
  )
}