import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { db } from '../firebase';
import { collection, orderBy, query, where, limit, getDocs, startAfter } from 'firebase/firestore';
import { useParams } from 'react-router-dom';

import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

export default function Category() {
  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);
  const params = useParams();

  useEffect(() => { 
    async function fetchListings() { 
      try { 
        const listingRef = collection(db, "listings");
        const q = query(listingRef, where("type", "==", params.categoryName), orderBy("timestamp", "desc"), limit(8));
        const querySnap = await getDocs(q);
        const lastVisible = querySnap.docs[querySnap.docs.length - 1];
        setLastFetchedListing(lastVisible);

        const listing = [];

        querySnap.forEach((doc) => { 
          listing.push({
            id: doc.id,
            data: doc.data(),
           });
        });

        setListings(listing);
        setLoading(false);
      } catch (error) { 
        toast.error("Could not fetch listing.");
      }
    }

    fetchListings();
  }, [params.categoryName])

  async function onFetchMoreListings() { 
    try { 
      const listingRef = collection(db, "listings");
      const q = query(listingRef, where("type", "==", params.categoryName), orderBy("timestamp", "desc"),startAfter(lastFetchedListing), limit(4));
      const querySnap = await getDocs(q);
      const lastVisible = querySnap.docs[querySnap.docs.length - 1];
      setLastFetchedListing(lastVisible);

      const listing = [];

      querySnap.forEach((doc) => { 
        listing.push({
          id: doc.id,
          data: doc.data(),
         });
      });

      setListings((prevState) => [...prevState, ...listing]);
    } catch (error) { 
      toast.error("Could not fetch listing.");
    }
  }

  return (
    <div className='max-w-6xl mx-auto px-3'>
      <h1 className='text-3xl text-center mt-6 font-bold mb-6'>
        {params.categoryName === "rent" ? "Places for rent" : "Places for sale"}
      </h1>
      {loading && <Spinner />}
      {!loading && listings && listings.length === 0 && (
        <p>
          There are no current listings.
        </p>
      )}
      {!loading && listings && listings.length > 0 && (
        <>
          <main>
            <ul className='sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5'>
              {listings.map((listing) => (
                <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
              ))}
            </ul>
          </main>
          {lastFetchedListing && (
            <div className='flex justify-center items-center'>
              <button onClick={onFetchMoreListings} className='bg-white px-3 py-1.5 text-gray-700 border border-gray-300 mb-6 mt-6 hover:bg-slate-600 
                transition rounded duration-150 ease-in-out'>
                Load More
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
