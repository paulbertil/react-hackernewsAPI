import React, {
  useState, 
  useEffect,
  useRef,
  useReducer, 
  useCallback
} from 'react';
import SearchForm from './SearchForm';
import List from './List';

// styles
import './App.css';

// custom hook
const useSemiPersistentState = (key, initialState) => {
  const isMounted = useRef(false)
  const [value, setValue] = useState(localStorage.getItem(key) || '');

  useEffect(() => {
    // Only render after mount
    if(!isMounted.current) {
      isMounted.current = true;
    } else {
      // only run after the first mount on re-renders
      console.log('A')
      localStorage.setItem(key, value)
    }
    
  },[value, key]);

  return [value, setValue];
}

const storiesReducer = (state, action) => {
  switch(action.type) {
    case 'STORIES_FETCH_INIT': 
      return {
        ...state,
        isLoading: true,
        IsError: false
      }
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        IsError: false,
        data: action.payload
      }
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        IsError: true
      }
    case 'REMOVE_STORY': 
      return {
        ...state,
        data: state.data.filter(story => story.objectID !== action.payload.objectID)
      }
    default:
      throw new Error();
  }
}

const getSumComments = stories => {
  console.log('C');
  return stories.data.reduce((result, value) => result + value.num_comments, 0);
}


const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

const App = () => {
  
  
  const [stories, dispatchStories] = useReducer(
    storiesReducer,
    {data:[], isLoading: false, IsError: false}
  );


  const sumComments = React.useMemo(() => {
    return getSumComments(stories);
  },[stories]);

  const [searchTerm, setSearchTerm] = useSemiPersistentState('search');
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`)


  const handleFetchStories = useCallback(() => {
    dispatchStories({
      type: 'STORIES_FETCH_INIT'
    })
    fetch(`${url}`)
      .then(response => response.json())
      .then(result => {
        dispatchStories({
          type: 'STORIES_FETCH_SUCCESS', 
          payload: result.hits
        })
      }).catch(err => {
        console.error(err);
        dispatchStories({
          type: 'STORIES_FETCH_FAILURE'
        })
      })
  },[url])
  useEffect(() => {
    handleFetchStories();
  }, [handleFetchStories])

  const handleRemoveStory = useCallback(item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item
    })
  },[]) 

  const handleSearchInput = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setUrl(`${API_ENDPOINT}${searchTerm}`)
  }

  

  

  return (
    <div className="container">
      <h1 className="headline-primary">My Hacker Stories with {sumComments}</h1>

      <SearchForm 
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      <p>Searching for <strong>{searchTerm}</strong></p>
     
      

      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List 
        list={stories.data} 
        onRemoveItem={handleRemoveStory}
        />
      )}
     
    </div>
  );
}


 

export default App;
