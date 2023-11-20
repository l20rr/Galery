import React, { useEffect, useState } from 'react';
import './App.css';
  import { createClient } from 'pexels';
  import SmartphoneIcon from '@mui/icons-material/Smartphone';
  import DesktopMacIcon from '@mui/icons-material/DesktopMac';
  import TabletIcon from '@mui/icons-material/Tablet';

  function App() {
    const [query, setQuery] = useState('');
    const [photos, setPhotos] = useState([]);
    const [videosa, setVideo] = useState([]);
    const [big, setBig] = useState(false);
    const [selectedPhoto, setSelectedPhoto] = useState(null);
    const [size, setSize] = useState('mobile');
    const client = createClient('T3hNun21w2MhkeflmOh72keMzwriuc2QARDDafnuoRFwVjXGnccQl6OE');
  
    useEffect(() => {
      const fetchPhotosAndVideos  = async () => {
        try {
          const photoResponse = await client.photos.curated({ per_page: 50});
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
        const photoResponse = await client.photos.search({ query, per_page: 50 });
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

    const handleButtonClick = (newSize) => {
      setSize(newSize);
    };
  
    const handleDownloadButtonClick = () => {
      if (selectedPhoto) {
        fetch(selectedPhoto.src.original)
          .then(response => response.blob())
          .then(blob => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `photo_by_${selectedPhoto.photographer}.jpg`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          })
          .catch(error => console.error('Error downloading image:', error));
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
       <div id='space'>
       <div className={`sectionphoto2 ${size}`}>
         <img  src={selectedPhoto.src.original} alt={`Photo by ${selectedPhoto.photographer}`} />
        </div>
       </div>
        <div className='btnsbig'>
        <button id='x' onClick={() => setBig(false)}>X</button>
        <div id='btngeral'>
          <h2>Choose size <br/> download image</h2>
         
        <button className='btndisplay' onClick={() => handleButtonClick('mobile')}><SmartphoneIcon/></button>
          <button className='btndisplay' onClick={() => handleButtonClick('desktop')}><DesktopMacIcon/></button>
          <button className='btndisplay' onClick={() => handleButtonClick('tablet')}><TabletIcon/></button>
          <button className='button-30 btn3'  onClick={handleDownloadButtonClick} >Download</button>
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