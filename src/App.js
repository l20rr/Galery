import React, { useEffect, useState } from 'react';
import './App.css';
  import { createClient } from 'pexels';

  function App() {
    const [query, setQuery] = useState('');
    const [photos, setPhotos] = useState([]);
    const [videosa, setVideo] = useState([]);
    const [big, setBig] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
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
        setBig(false);
        // Buscar vídeos
        const videoResponse = await client.videos.search({ query, per_page: 80 });
        const filteredVideos = videoResponse.videos.filter(video => video.height >= 2732);
        setVideo(filteredVideos);
      } catch (error) {
        console.error('Erro ao buscar fotos ou vídeos:', error);
      }
    };

 
    const BigImg = async (ID) => {
      try {
        const photoResponse = await client.photos.show({ id: ID });
        // Armazena os detalhes da foto para renderização individual
        console.log(photoResponse)
        setSelectedPhoto(photoResponse);
        setBig(true);
      } catch (error) {
        console.log(error);
      }
    };
  // Combine as listas de fotos e vídeos em uma única lista
  const combinedList = [...photos, ...videosa];
  // Embaralhe a lista combinada
  const shuffledList = combinedList.sort(() => Math.random() - 0.5);

    return (
      <div className="App">
       <div id='geralbtn'>
        <button className='button-30'>
          Home
        </button>
     
       <input
          type='text'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className='button-30' onClick={handleSearch}>Buscar</button>
     
      </div>
      <section className="App-header">
    {big ? (
      <div className='enlarged-photo'>
        <div className='sectionphoto2'>
         <img  src={selectedPhoto.src.original} alt={`Photo by ${selectedPhoto.photographer}`} />
        </div>
        <div className='btnsbig'>
        <button onClick={() => setBig(false)}>X</button>
        <div id='btngeral'>
        <button className='btndisplay' onClick={() => setBig(false)}>Mobile</button>
        <button className='btndisplay' onClick={() => setBig(false)}>Descktop</button>
        <button className='btndisplay' onClick={() => setBig(false)}>Tablet</button>
        
        </div>
        </div>
      </div>
    ) : (
      shuffledList.map((item) => (
        <div className='sectionphoto' key={item.id} onClick={() => BigImg(item.id)}>
          {item.hasOwnProperty('src') ? (
            <img  src={item.src.portrait} alt={`Photo by ${item.photographer}`} />
          ) : (
            <video loop autoPlay muted>
              <source src={item.video_files[0].link} />
            </video>
          )}
        </div>
      ))
    )}
  </section>
      </div>
    );
  }
  
  export default App;