import React, {
  useState, 
  useEffect,
  useRef,
  useReducer, 
  useCallback
} from 'react';
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
      // only run after the first mount
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



const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

function App() {
  const [stories, dispatchStories] = useReducer(
    storiesReducer,
    {data:[], isLoading: false, IsError: false}
  );

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

  const handleRemoveStory = item => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item
    })
  }

  function handleSearchInput(event) {
    setSearchTerm(event.target.value)
  }

  function handleSearchSubmit(e){
    e.preventDefault();
    setUrl(`${API_ENDPOINT}${searchTerm}`)
  }


  return (
    <div className="container">
      <h1 className="headline-primary">Hacker Stories</h1>

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
        onRemoveItem={handleRemoveStory}/>
      )}
     
    </div>
  );
}

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit
}) =>(
  <form
    onSubmit={onSearchSubmit}
    className="search-form"
  >
    <InputWithLabel 
      id="search"
      type="text"
      value={searchTerm}
      onInputChange={onSearchInput}
    >
      <strong>Search</strong>
    </InputWithLabel>

    <button
      type="submit"
      disabled={!searchTerm}
      className="button__small"
    >
      Submit
    </button>
  </form>
)


// SEARCH
const InputWithLabel = ({
  id, 
  value, 
  type, 
  onInputChange, 
  children,
  isFocused
}) => {

  const inputRef = useRef();

  useEffect(() => {
    if(isFocused && inputRef.current) {
      inputRef.current.focus();
    }
  },[isFocused])

  return (
    <>
      <label
        className="label"
        htmlFor={id}>{children} </label>
      <input 
        id={id} 
        type={type}
        value={value}
        onChange={onInputChange}
        autoFocus={isFocused}
        ref={inputRef}
        className="input"
      />
    </>
  )
}

const List = (props) => {
  const {onRemoveItem} = props;
  return props.list.map((item) => (
    <Item key={item.ObjectID} item={item} onRemoveItem={onRemoveItem}/>
  ))
}

const Item = ({
    item,
    onRemoveItem
}) => {

  return ( 
  <div
    className="item"
    key={item.ObjectID}>
    <span style={{width: '40%'}}>
      <a href={item.url}>
        {item.title}
      </a>
    </span>
    <span style={{width: '30%'}}>
      {item.author}
    </span>
    <span style={{width: '10%'}}>{item.num_comments}</span>
    <span style={{width: '10%'}}>{item.points}</span>
    <span style={{width: '10%'}}>
      <button 
        className="button button__small" 
        onClick={()=>onRemoveItem(item)}>
          Dismiss
        </button>
    </span>
   
  </div>
)
}
 

export default App;
