import React, {useRef, useEffect} from 'react';

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
  export default InputWithLabel;