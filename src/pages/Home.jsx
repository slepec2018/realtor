import React, { useEffect, useState } from 'react'
import { collection, query, orderBy, limit, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Link } from 'react-router-dom';

import Slider from '../components/Slider'
import ListingItem from '../components/ListingItem'


export default function Home() {
  const [offerListings, setOfferListings] = useState(null);
  const [rentListings, setRentListings] = useState(null);
  const [saleListings, setSaleListings] = useState(null);

  useEffect(() => { 
    async function fetchListings() { 
      try {
        const listingsRef = collection(db, 'listings');

        const q = query(listingsRef, where('offer', '==', true), orderBy('timestamp', 'desc'), limit(4));
        const r = query(listingsRef, where('type', '==', 'rent'), orderBy('timestamp', 'desc'), limit(4));
        const s = query(listingsRef, where('type', '==', 'sale'), orderBy('timestamp', 'desc'), limit(4));

        const querySnap = await getDocs(q);
        const rentSnap = await getDocs(r);
        const saleSnap = await getDocs(s);

        const listings = [];
        const rent = [];
        const sale = [];

        querySnap.forEach((doc) => {
          return listings.push({
            id: doc.id,
            data: doc.data()
          });
        });

        rentSnap.forEach((doc) => {
          return rent.push({
            id: doc.id,
            data: doc.data()
          });
        });

        saleSnap.forEach((doc) => {
          return sale.push({
            id: doc.id,
            data: doc.data()
          });
        });

        setOfferListings(listings);
        setRentListings(rent);
        setSaleListings(sale);
      } catch (error) {
        console.log(error);
      }
    }

    fetchListings();
  }, [])

  return (
    <>
      <Slider />
      <div className='max-w-6xl mx-auto pt-4 space-y-6'>
        {offerListings && offerListings.length && (
          <div className='m-2 mb-6'>
            <h2 className='px-3 text-2xl mt-6 font-semibold'>
              Recent Offers
            </h2>
            <Link to="/offers">
              <p className='px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out'>
                Show more offers
              </p>
            </Link>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {offerListings.map((listing) => (
                  <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
                ))}
              </ul>
           </div>
        )}
        {rentListings && rentListings.length && (
          <div className='m-2 mb-6'>
            <h2 className='px-3 text-2xl mt-6 font-semibold'>
              Places for rent
            </h2>
            <Link to="/category/rent">
              <p className='px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out'>
                Show more places for rent
              </p>
            </Link>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {rentListings.map((listing) => (
                  <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
                ))}
              </ul>
           </div>
        )}
        {saleListings && saleListings.length && (
          <div className='m-2 mb-6'>
            <h2 className='px-3 text-2xl mt-6 font-semibold'>
              Places for sale
            </h2>
            <Link to="/category/sale">
              <p className='px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out'>
                Show more places for sale
              </p>
            </Link>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
                {saleListings.map((listing) => (
                  <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
                ))}
              </ul>
           </div>
        )}
      </div>
    </>
  )
}
