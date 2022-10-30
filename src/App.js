import {useState,useEffect,useRef,useCallback} from 'react'
import wiki from './wiki-logo.png';
import Navbar from './components/Navbar';
import Loading from './components/Loading';
import axios from 'axios';

const url =
  'https://en.wikipedia.org/w/api.php?action=query&list=search&srlimit=20&format=json&origin=*&srsearch=';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('apple');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [wikiPedia, setWikiPedia] = useState([]);
  const searchRef = useRef('');

  const fetchWiki = useCallback(async () => {
    try {
      setIsLoading(true);
      const resp = await axios(`${url}${searchTerm}`);
      const data = resp.data.query.search;
      if (data.length < 1) {
        return (
          <h4>no match to your search criteria, please try again.</h4>
        )
      }
      if (data) {
        const results = data.map((item) => {
          const { pageid,  title } = item
          return {
            pageid,
            title
          }
        })
        setWikiPedia(results);
        setIsLoading(false)
      } else {
        setWikiPedia([])
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false);
      setError(true)
    }
  }, [searchTerm]);

  useEffect(() => {
    searchRef.current.focus();
  },[])

  useEffect(() => {
    setTimeout(() => {
      fetchWiki()
    }, 3000);
  }, [searchTerm, fetchWiki]);

  if (error) {
    return (
      <h3>there was an error....</h3>
    )
  }

  if (isLoading) {
    return <Loading />
  }

  const handleSearchChange = (e) => {
      setSearchTerm(searchRef.current.value);
  }


  const handleSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <>
      <Navbar />
      <section className="wiki">
        <div className="container">
          <img src={wiki} alt="" />
          <h3>wikipedia</h3>
          <form
            onSubmit={handleSubmit}
            className="form"
          >
            <input
              type="text"
              className="search"
              placeholder="apple"
              ref={ searchRef}
              onChange={handleSearchChange}
            />
          </form>
          <article className="results">
            {wikiPedia.map((wiki) => {
              const { pageid, title } = wiki;
              return (
                <article className="articles" key={pageid}>
                  <a
                    href="http://en.wikipedia.org/?curid={pageid}"
                    target="_blank"
                    rel="noreferrer"
                  >
                    <h1>{title}</h1>
                  </a>
                </article>
              )
            })}
          </article>
        </div>
      </section>
    </>
  )
};

export default App