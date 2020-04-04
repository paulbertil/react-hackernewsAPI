import React from 'react';
import InputWithLabel from '../InputWithLabel';

const SearchForm = ({
    searchTerm,
    onSearchInput,
    onSearchSubmit
  }) =>( console.log('D: SearchFrom') ||
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

  export default SearchForm;
