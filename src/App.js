
import React, { useEffect, useState } from 'react';
import './App.css';
  import { createClient } from 'pexels';

  function App() {
    const [query, setQuery] = useState('');
    const [photos, setPhotos] = useState([]);
    const [videosa, setVideo] = useState([]);
    
    const client = createClient('T3hNun21w2MhkeflmOh72keMzwriuc2QARDDafnuoRFwVjXGnccQl6OE');
  
    useEffect(() => {
      const fetchPhotosAndVideos  = async () => {
        try {
          const photoResponse = await client.photos.curated({ per_page: 16});
          setPhotos(photoResponse.photos);

          const videoResponse = await client.videos.popular({ per_page: 80 });
          const filteredVideos = videoResponse.videos.filter(video => video.height >= 2732);
          setVideo(filteredVideos);
        } catch (error) {
          console.error('Erro ao buscar fotos:', error);
        }
      };
  
     
      fetchPhotosAndVideos ();
    }, []);

    const handleSearch = async () => {
      try {
        // Buscar fotos
        const photoResponse = await client.photos.search({ query, per_page: 16 });
        setPhotos(photoResponse.photos);
    
        // Buscar vídeos
        const videoResponse = await client.videos.search({ query, per_page: 80 });
        const filteredVideos = videoResponse.videos.filter(video => video.height >= 2732);
        setVideo(filteredVideos);
      } catch (error) {
        console.error('Erro ao buscar fotos ou vídeos:', error);
      }
    };

      // Combine as listas de fotos e vídeos em uma única lista
  const combinedList = [...photos, ...videosa];

  // Embaralhe a lista combinada
  const shuffledList = combinedList.sort(() => Math.random() - 0.5);

    return (
      <div className="App">
         <div id='geralbtn'>
         <label htmlFor="fileInput">
        <div id="fileinp">+</div>
      </label>
      <input
        type="file"
        id="fileInput"
        style={{ display: 'none' }}
      />
          
        <input
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className='button-30' onClick={handleSearch}>Buscar</button>
      </div>
      <section className="App-header">
      {shuffledList.map((item) => (
        <div className='sectionphoto' key={item.id}>
          {item.hasOwnProperty('src') ? (
            <img src={item.src.original} alt={`Photo by ${item.photographer}`} />
          ) : (
            <video loop autoPlay muted>
              <source src={item.video_files[0].link} />
            </video>
          )}
        </div>
      ))}
    </section>
      </div>
    );
  }
  
  export default App;