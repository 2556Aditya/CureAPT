'use client'

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Circularpro from './Circularpro';
import Avataar from './Avataar';
import Chip1 from './Chip1';
import Navbars from './Navbarss';
import Recommendation from './Recommendation';
import Pb1 from './Pb1';
import Pb2 from './Pb2';
import Pb3 from './Pb3';
import Pb4 from './Pb4';
import Pb5 from './Pb5';
import Pb6 from './Pb6';
import Pb7 from './Pb7';
import Cal from './Cal';
import Modal5 from './Modal5';
import AiC from './AiC';
import { useRouter } from 'next/navigation';
import Quote from 'inspirational-quotes';
import { CardBody, CardContainer, CardItem } from "./3d-card";
import { ShootingStars } from "../../../components/shooting-stars";
import { StarsBackground } from "../../../components/stars-background";

const Modal1entries = dynamic(() => import('./Modal1entries'), {
  loading: () => <p>Loading...</p>,
  ssr: false
});

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [streakUpdated, setStreakUpdated] = useState(false); // New state to track streak updates
  const [metrics, setMetrics] = useState(null);
  const router = useRouter();
  const [quote, setQuote] = useState({ text: '', author: '' });
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString());
  const [journalRefreshKey, setJournalRefreshKey] = useState(0);

  const getPhotoUrl = (photoPath) => {
    if (!photoPath) return null;
    return photoPath.startsWith('http') ? photoPath : `${window.location.origin}${photoPath}`;
  };

// Add this useEffect for quote generation
useEffect(() => {
  const randomQuote = Quote.getQuote();
  setQuote(randomQuote);
}, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userResponse, metricsResponse] = await Promise.all([
          fetch('/api/user/get-profile'),
          fetch('/api/user/health-metrics')
        ]);

        if (userResponse.ok && metricsResponse.ok) {
          const userData = await userResponse.json();
          const metricsData = await metricsResponse.json();
          setUser(userData);
          setMetrics(metricsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }

      
    };

    
    fetchData();
  }, []);

useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await fetch('/api/user/get-profile');
      console.log('User response:', response);
      if (response.ok) {
        const userData = await response.json();
        console.log('User data:', userData);
        setUser(userData);
      } else {
        console.error('Failed to fetch user profile');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  fetchUser();
}, []);

// pages/dashboard/page.js - Update useEffect
useEffect(() => {
  const checkAssessment = async () => {
    try {
      const response = await fetch('/api/user/check-assessment');
      const data = await response.json();
      
      if (data.needsAssessment || !data.hasValidMetrics) {
        console.log('Redirecting to assessment');
        router.push('/details');
      }
    } catch (error) {
      console.error('Assessment check error:', error);
    }
  };
  
  checkAssessment();
}, [router]);


   // Modified useEffect for streak updates
   useEffect(() => {
    if (!user || streakUpdated) return; // Don't update if already updated

    const updateStreak = async () => {
      try {
        const response = await fetch('/api/user/update-streak', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: user.userId }),
        });

        if (response.ok) {
          const data = await response.json();
          setUser(prev => ({
            ...prev,
            streakCount: data.streakCount,
            tag: data.tag,
          }));
          setStreakUpdated(true); // Mark streak as updated
        }
      } catch (error) {
        console.error('Error updating streak:', error);
      }
    };

    updateStreak();
  }, [user, streakUpdated]);

  
  

  const handleJournalSaved = () => {
    setJournalRefreshKey(prev => prev + 1);
  };

  return (
    <main className="bg-gradient-to-t from-blue-600 to-black">
            <ShootingStars />
            <StarsBackground />
      <div className="max-h-[400px]">
        <Navbars onJournalSaved={handleJournalSaved} />
        <div className="grid justify-items-center justify-self-center grid-cols-2 mt-2 gap-4 p-4">

          <Circularpro streakCount={user ? user.streakCount : 0} />

          <div className="grid grid-flow-row auto-rows-auto justify-items-start grid-rows-3">
            <div className="flex flex-wrap">
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="p-2">
                  {user && <Avataar currentPhoto={getPhotoUrl(user.profilePhoto)} />}
                </div>
              )}
              <div>
                {user ? (
                  <div className="p-1">
                    <div className="flex flex-nowrap">
                      <h2 className="font-black place-content-center drop-shadow-md font-sans">{user.username}</h2>
                      <div className="pl-1">
                        <Chip1 tag={user.tag} />
                      </div>
                    </div>
                    <p className="font-extralight drop-shadow-md font-sans">{user.manifestation}</p>
                  </div>
                ) : (
                  <p>Loading user information...</p>
                )}
              </div>
            </div>
            <div className="row-span-2 -translate-y-7">
              
              <Recommendation />

            </div>
          </div>
        </div>
      </div>
      <div className='m-auto pl-28 pr-28 pt-7 '>
      <h1 className="flex justify-center text-md font-light drop-shadow-lg text-center">{quote.text}</h1>
      </div>
      <>
      <div className="gap-16 flex justify-center p-4">
      <CardContainer>
      <CardBody>
      <Pb1 value={metrics?.generalLifestyle || 0} />
      </CardBody>
      </CardContainer>
      <CardContainer>
      <CardBody>
      <Pb2 value={metrics?.nutritionHydration || 0} />
      </CardBody>
      </CardContainer>
      </div>
      
      <div className="gap-10 flex justify-center p-4">
      <CardContainer>
      <CardBody>
      <Pb3 value={metrics?.physicalActivity || 0} />
      </CardBody>
      </CardContainer>
      <CardContainer>
      <CardBody>
      <Pb4 value={metrics?.mindfulnessMentalHealth || 0} />
      </CardBody>
      </CardContainer>
      </div>
      <div className="gap-4 flex justify-center p-4">
      <CardContainer>
      <CardBody>
      <Pb5 value={metrics?.socialConnection || 0} />
      </CardBody>
      </CardContainer>
      <CardContainer>
      <CardBody>
      <Pb6 value={metrics?.selfCarePersonalGrowth || 0} />
      </CardBody>
      </CardContainer>
      </div>
      <div className='flex justify-center p-4'>
      <CardContainer>
      <CardBody>
      <Pb7 value={metrics?.overallHealth || 0} />
      </CardBody>
      </CardContainer>
      </div>
      </>
      <>
        <h1 className="flex justify-center text-3xl mt-20 font-black drop-shadow-lg">What You Did Today?</h1>
        <h3 className="flex justify-center text-md font-light drop-shadow-lg">let us know about your day! I hope you had a productive one</h3>
      </>
      <div className="flex justify-center gap-5 mt-7">
  <Cal onDateChange={(date) => setSelectedDate(date)} />
  <div className="translate-y-2">
    <Modal5 selectedDate={selectedDate} />
  </div>
</div>
      <div className="mt-10 flex justify-center">
        <AiC />
      </div>
      <>
        <h1 className="flex justify-center text-6xl mt-16 font-black drop-shadow-lg p-2 gradient-sunset">My Journals</h1>
        <h3 className="flex justify-center text-center text-md font-light drop-shadow-lg">Start writing, no matter what. The water does not flow until the faucet is turned on.</h3>
      </>
      <div className="flex justify-center p-10">
        <Modal1entries refreshKey={journalRefreshKey} />
      </div>
    </main>
  );
}