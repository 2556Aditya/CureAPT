// components/Recommendation.jsx
import React, { useState, useEffect } from "react";
import { CardBody, CardContainer, CardItem } from "./3d-card";

export default function Recommendation() {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debug, setDebug] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const response = await fetch('/api/user/get-recommendations');
        const data = await response.json();
        
        console.log('API Response:', data); // Debug log
        
        if (!response.ok) throw new Error(data.error || 'Failed to fetch');
        
        setRecommendations(data.recommendations || []);
        setDebug(data.debug); // Store debug info
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  return (
    <CardContainer >
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
        <CardItem translateZ={52}>
          {loading ? (
            <p className="text-gray-400">Loading recommendations...</p>
          ) : error ? (
            <p className="text-red-400">Error: {error}</p>
          ) : recommendations.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-xl font-bold mb-4 text-white">Your Health Recommendations</h3>
              <ul className="space-y-2">
                {recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-gray-300">
                    • {rec}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div>
              <p className="text-gray-400">No recommendations available</p>
              {debug && (
                <p className="text-xs text-gray-500 mt-2">
                  Debug: {JSON.stringify(debug)}
                </p>
              )}
            </div>
          )}
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}