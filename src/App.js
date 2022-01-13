import React, {useState, useEffect} from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import './App.css';

const accessKey = process.env.REACT_APP_UNSPLASH_ACCESS_KEY; // ключ доступу до апі

export default function App() {
  const [images, setImages] = useState([]); // стан картинок
  const [page, setPage] = useState(1); // стан сторінки
  const [query, setQuery] = useState(''); // стан запиту

  useEffect(() => {
    getImages();
    // eslint-disable-next-line
  }, [page]); // на зміну аргумента [page](прокрутка сторінки коли [page] !== 1 і [page] >= 2) оновлюєм контент

  function getImages() {
    let apiUrl = 'https://api.unsplash.com/photos/?';
    if (query) apiUrl = `https://api.unsplash.com/search/photos/?query=${query}`; // збираэм урл запиту
    apiUrl += `&page=${page}`;
    apiUrl += `&client_id=${accessKey}`;
    fetch(apiUrl) // запит 
      .then((res) => res.json()) // приймаэм запит 
      .then((data) => {
        const imagesFromApi = data.results ?? data; // враховуэм можливу структуру json , прсвоюэм значення в перемынну

        if(page === 1) {
          setImages(imagesFromApi); // якщо це перша сторінкка виводим контент по запиту ...imagesFromApi
          return;
        }

        setImages(images => [...images, ...imagesFromApi]) // додаєм новий контент ...imagesFromApi до існуючого ...images 

      })
  }
    
  if (!accessKey) {
    return (
      <a href='https://unsplash.com/documentation' className='error'>Required: Get Yuor Unsplash api key </a>
    )
  } // перевыряэм на помилку якщо немає accessKey даєм посилання на ресурс(документацію)

  function searchImages(e) {
    e.preventDefault();  // відміняєм дефолтну поведінку
    setPage(1); // встановлюєм стан галереї в першу сторінку прокрутки 
    getImages(); // дістаєм контент по запиту з апі
  }

  return (
    <div className="app">
      <h1>Unsplash Image Gallery!</h1>

      <form onSubmit={searchImages}>
        <input 
        type="text" 
        placeholder="Search Unsplash..." 
        value={query}
        onChange={(e) => setQuery(e.target.value)} // передєм запит з інпута в стан запиту івент онченджж

        />
        <button>Search</button>
      </form>

      <InfiniteScroll
        dataLength={images.length} //
        next={() => setPage((page) => page + 1)} //
        hasMore={true}
        loader={<h4>Loading...</h4>}

      >
        <div className="image-grid">
          {images.map((image) => (
            <a 
              className="image" 
              key={image.id}
              href={image.links.html}
              target='_blank'
              rel='noopener noreferrer'
            >
              <img src={image.urls.regular} alt={image.alt_description} />
            </a>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}
