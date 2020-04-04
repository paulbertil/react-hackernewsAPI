import React, {useState} from 'react';
import {sortBy} from 'lodash'



const List = React.memo(({list, onRemoveItem}) => {
  const SORT = {
    NONE: list => list,
    TITLE: list => sortBy(list, 'title'),
    AUTHOR: list => sortBy(list, 'author'),
    COMMENT: list => sortBy(list, 'num_comments').reverse(),
    POINT: list => sortBy(list, 'points').reverse(),
  }

  const [sort, setSort] = useState('NONE')
  const [isReverse, setIsReverse] = useState(false);
  


  const handleSort = (key) => {
    if(sort === key) {
      console.log('reverse is now: ', isReverse)
      setIsReverse(!isReverse);
    }
    setSort(key);
  }

  const sortFunction = SORT[sort]
  const sortedList = isReverse ? sortFunction(list) 
                        : sortFunction(list).reverse();
  

  return (
    <>
    <div className="item">
      <button 

        style={{width: '40%'}}
        onClick={() => handleSort('TITLE')}
        className={sort === 'TITLE' ? 'button button__active' : 'button'}
      >
        Title
    </button>
    <button 
      onClick={() => handleSort('AUTHOR')}
      style={{width: '30%'}}
      className={sort === 'AUTHOR' ? 'button button__active' : 'button'}
      >
     Author
    </button>
    <button 
      onClick={() => handleSort('COMMENT')}
      style={{width: '10%'}}
      className={sort === 'COMMENT' ? 'button button__active' : 'button'}
      >
      Comments
    </button>
    <button 
      onClick={() => handleSort('POINT')}
      style={{width: '10%'}}
      className={sort === 'POINT' ? 'button button__active' : 'button'}
      >
      Points
    </button>
    <span style={{width: '10%'}}>
      
    </span>
    </div>
    
    {sortedList.map(item => (
    <Item 
      key={item.objectID} 
      item={item} 
      onRemoveItem={onRemoveItem}/>
  ))}
  </>
  )
})
  
 
  
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
)}

export default List;
