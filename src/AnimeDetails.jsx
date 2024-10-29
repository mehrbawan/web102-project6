// AnimeDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const AnimeDetails = () => {
  const { animeId } = useParams();
  const [animeDetails, setAnimeDetails] = useState(null);

  useEffect(() => {
    const fetchAnimeDetails = async () => {
      try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${animeId}`);
        const data = await response.json();
        setAnimeDetails(data.data);
      } catch (error) {
        console.error("Error fetching anime details:", error);
      }
    };
    fetchAnimeDetails();
  }, [animeId]);

  if (!animeDetails) return <p>Loading...</p>;

  return (
    <>
      <h3>{animeDetails.title}</h3>
      <div className="animeCard">
        <div>
          <img src={animeDetails.images.jpg.image_url}></img>
          <h2>Episodes: {animeDetails.episodes}</h2>
          <h2>Score: {animeDetails.score}</h2></div>
        <div className="animeDesc"><p>{animeDetails.synopsis}</p></div>
      </div>
    </>
  );
};

export default AnimeDetails;
