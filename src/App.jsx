import React, { useState, useEffect } from 'react';
import { Pie, Bar } from 'react-chartjs-2'; // Import Bar from react-chartjs-2
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { BrowserRouter, Route, Routes, Link } from 'react-router-dom';
import AnimeDetails from "./AnimeDetails.jsx"

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement); // Register BarElement

import './App.css';

const App = () => {

  const [animeList, setAnimeList] = useState([]);
  const [filteredAnimeList, setFilteredAnimeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [averageRating, setAverageRating] = useState(0);
  const [averageReviewers, setAverageReviewers] = useState(0);
  const [countShonen, setCountShonen] = useState(0);
  const [countShojo, setCountShojo] = useState(0);
  const [countAction, setCountAction] = useState(0);
  const [countRomance, setCountRomance] = useState(0);
  const [countComedy, setCountComedy] = useState(0);
  const [countDrama, setCountDrama] = useState(0);
  const [searchVal, setSearchVal] = useState("");
  const [sliderVal, setSliderVal] = useState(0);
  const [randomAnimeId, setRandomAnimeId] = useState(null);


  useEffect(() => {
    const fetchAnime = async () => {
      setLoading(true);
      try {
        const response1 = await fetch(`https://api.jikan.moe/v4/top/anime?page=1`);
        const data1 = await response1.json();

        const response2 = await fetch(`https://api.jikan.moe/v4/top/anime?page=2`);
        const data2 = await response2.json();

        const combinedAnimeList = [...data1.data, ...data2.data].filter(anime => anime.rank !== null);

        setAnimeList(combinedAnimeList);
        setFilteredAnimeList(combinedAnimeList);
        calculateStats(combinedAnimeList);
        //console.log(combinedAnimeList);
      } catch (error) {
        console.error("Error fetching anime:", error);
      }
      setLoading(false);

    };
    fetchAnime();
    setRandomAnimeId(1);
  }, []);

  const calculateStats = (animeList) => {
    let ratingTotal = 0;
    let reviewerTotal = 0;
    let shonenCount = 0;
    let shojoCount = 0;
    let actionCount = 0;
    let romanceCount = 0;
    let dramaCount = 0;
    let comedyCount = 0;

    animeList.forEach(anime => {
      ratingTotal += anime.score;
      reviewerTotal += anime.members;
      if (anime.demographics.some(genre => genre.name === "Shounen" || genre.name === "Seinen")) {
        shonenCount++;
      }
      if (anime.demographics.some(genre => genre.name === "Shoujo" || genre.name === "Josei")) {
        shojoCount++;
      }
      if (anime.genres.some(genre => genre.name === "Action")) {
        actionCount++;
      }
      if (anime.genres.some(genre => genre.name === "Romance")) {
        romanceCount++;
      }
      if (anime.genres.some(genre => genre.name === "Drama")) {
        dramaCount++;
      }
      if (anime.genres.some(genre => genre.name === "Comedy")) {
        comedyCount++;
      }
    });

    setAverageRating((ratingTotal / animeList.length).toFixed(2));
    setAverageReviewers((reviewerTotal / animeList.length).toFixed(2));
    setCountShonen(shonenCount);
    setCountShojo(shojoCount);
    setCountAction(actionCount);
    setCountRomance(romanceCount);
    setCountComedy(comedyCount);
    setCountDrama(dramaCount);
  };

  const getRandomAnime = () => {
    const randomIndex = Math.floor(Math.random() * animeList.length);
    setRandomAnimeId(animeList[randomIndex]?.mal_id);
  };

  const handleSearch = (event) => {
    const searchValue = event.target.value;
    setSearchVal(searchValue);

    if (searchValue === "") {
      setFilteredAnimeList(animeList);
    } else {
      const filteredList = animeList.filter(anime =>
        anime.title.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredAnimeList(filteredList);
    }
  };

  const handleGenreFilter = (genreName) => {
    const filteredList = animeList.filter(anime =>
      anime.genres.some(genre => genre.name === genreName)
    );
    setFilteredAnimeList(filteredList);
  };

  const handleSlide = (event) => {
    const value = Number(event.target.value);
    setSliderVal(value);

    const filteredList = animeList.filter(anime => anime.score >= value);
    setFilteredAnimeList(filteredList);
  };

  const clearFilter = () => {
    setFilteredAnimeList(animeList);
  };

  const demographicData = {
    labels: ['Shoujo/Josei', 'Shounen/Seinen'],
    datasets: [
      {
        label: 'Demographic Spread',
        data: [countShojo, countShonen],
        backgroundColor: ['gray', 'gold'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB'],
      },
    ],
  };

  const demographicOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white',  // Set your desired label color here
          font: {
            size: 14, // Customize font size if needed
          },
        },
      },
    },
  };

  const genreData = {
    labels: ['Action', 'Romance', 'Drama', 'Comedy'], // Labels for the genres
    datasets: [
      {
        label: 'Genre Count',
        data: [countAction, countRomance, countDrama, countComedy], // Use the genre counts
        backgroundColor: ['gold','silver'], // Background color for bars
        borderColor: 'white', // Border color for bars
        borderWidth: 1,
      },
    ],
  };

  const genreOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white', // Set legend label color to white
        },
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`; // Custom tooltip label
          },
        },
        // Customize tooltip label color
        titleColor: 'white', // Set tooltip title color to white
        bodyColor: 'white', // Set tooltip body color to white
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white', // Set x-axis tick label color to white
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Optional: Set x-axis grid color
        },
      },
      y: {
        ticks: {
          color: 'white', // Set y-axis tick label color to white
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // Optional: Set y-axis grid color
        },
      },
    },
  };
  

  return (
    <BrowserRouter>
      <div className='App'>
        <div className="sidebarContainer">
          <Link
            to='/'
            style={{ textDecoration: 'none', color: 'inherit' }}>
            <img src="https://static.wikia.nocookie.net/delicious-in-dungeon/images/2/22/Senshi_Transparent.png" height="300px"></img>
            <h3>Home</h3>
          </Link>
          <Link
            to='/about'
            style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3>About</h3>
          </Link>
          <Link to={`/anime/${randomAnimeId}`} onClick={getRandomAnime} style={{ textDecoration: 'none', color: 'inherit' }}>
            <h3>Random!</h3>
          </Link>
        </div>
        <h1>
          <Link
            to='/'>
            <h1>Top 50 Anime</h1>
          </Link>
        </h1>
        <Routes>
          <Route
            path='/'
            element={
              <div className="app">
                <div className="leftSide">
                  <div className="statContainer">
                    <div className="stat">
                      <h1>Stats</h1>
                      <h2>Average Rating:
                        <br>
                        </br>{averageRating}</h2>
                      <h2>Average Members:
                        <br></br>
                        {Math.round(averageReviewers)}</h2>
                    </div>
                    <div className="stat">
                      <h1>Genres</h1>
                      <h2>Action: {countAction}</h2>
                      <h2>Romance: {countRomance}</h2>
                      <h2>Drama: {countDrama}</h2>
                      <h2>Comedy: {countComedy}</h2>
                    </div>
                  </div>
                  <br />
                  <div className="dataContainer">
                    <p>source: MyAnimeList.net</p>
                    <div className="searchContainer">
                      <div className="scrollFilter">
                        <button>Score: </button>
                        <input
                          type="range"
                          min="8.5"
                          max="9.3"
                          step="0.1"
                          value={sliderVal}
                          onChange={handleSlide}
                        />
                      </div>
                      <br />
                      <input
                        type="text"
                        placeholder="Search anime by title"
                        value={searchVal}
                        onChange={handleSearch}
                        className="searchBar"
                      />
                      <button className="genreButton" onClick={() => handleGenreFilter('Action')}>Action</button>
                      <button className="genreButton" onClick={() => handleGenreFilter('Romance')}>Romance</button>
                      <button className="genreButton" onClick={() => handleGenreFilter('Comedy')}>Comedy</button>
                      <button className="genreButton" onClick={() => handleGenreFilter('Drama')}>Drama</button>
                      <button className="genreButton" onClick={() => clearFilter()}>Clear Filter</button>
                    </div>
                    <div className="tableContainer">
                      {!loading ? (
                        <table className="scrolldown">
                          <thead>
                            <tr>
                              <th>Rank</th>
                              <th>Title</th>
                              <th>Type</th>
                              <th>Episodes</th>
                              <th>Score</th>
                              <th>Details</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredAnimeList
                              .sort((a, b) => a.rank - b.rank)
                              .map(anime => (
                                <tr key={anime.mal_id}>
                                  <td>{anime.rank}</td>
                                  <td>{anime.title}</td>
                                  <td>{anime.type}</td>
                                  <td>{anime.episodes}</td>
                                  <td>{anime.score}</td>
                                  <td><Link to={`/anime/${anime.mal_id}`}>🔗</Link></td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      ) : (
                        <p>Loading...</p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="rightSide">
                  <div className="chartContainer">
                    <h1>Demographics</h1>
                    <div className="chart" style={{ width: '200px', height: '200px' }}>
                      <Pie data={demographicData} options={demographicOptions} />
                    </div>
                  </div>
                  <br></br>
                  <div className="chartContainer">
                    <h1>Genres</h1>
                    <div className="chart">
                      <Bar data={genreData} options={genreOptions} /> 
                    </div>
                  </div>
                </div>
              </div>
            }
          />
          <Route path="/anime/:animeId" element={<AnimeDetails />} />
          <Route path="/about" element={<h2>An React app that displays data about the top anime at the moment according to MAL users! Made for CodePath WEB102</h2>} />
        </Routes>
      </div>
    </BrowserRouter>
  );


};

export default App;
