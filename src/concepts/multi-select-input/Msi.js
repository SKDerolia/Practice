import React, { useEffect, useState, useRef } from 'react'
import Pill from './Pill'

const Msi = () => {

    const [searchTerm, setSearchTerm] = useState("")
    const [suggestions, setSuggestions] = useState([])  //results we will get from api
    const [selectedUsers, setSelectedUsers] = useState([])

    const [selectedUserSet, setSelectedUserSet] = useState(new Set())
    // we will be using set data structure for the selecteduser

    const inputRef = useRef(null)

    // try to use debounce in below code
    useEffect(()=>{
        const fetchUsers = () =>{
            if(searchTerm.trim() === ""){
                setSuggestions([])
                return;
            }
    
            fetch(`https://dummyjson.com/users/search?q=${searchTerm}`)
            .then((res)=>res.json())
            .then((data)=>setSuggestions(data))
            .catch((err) =>{
                console.log(err)
            })
        }
        fetchUsers()
    },[searchTerm])

    const handleSelectUser = (user)=>{
        setSelectedUsers([...selectedUsers, user]);
        setSelectedUserSet(new Set([...selectedUserSet, user.email]))
        setSearchTerm("")
        setSuggestions([]);
        inputRef.current.focus()
    }
    // console.log(selectedUsers)

    const handleRemoveuser = (user)=>{
        const updatedUsers = selectedUsers.filter(
            (selectedUser) => selectedUser.id !== user.id
        );
        setSelectedUsers(updatedUsers)

        const updatedEmails = new Set(selectedUserSet)
        updatedEmails.delete(user.email)
        setSelectedUserSet(updatedEmails)
    }

    const handleKeyDown = (e) =>{
        if(e.key === 'Backspace' && e.target.value === "" && selectedUsers.length > 0){
            const lastUser = selectedUsers[selectedUsers.length - 1];
            handleRemoveuser(lastUser)
            setSuggestions([])
        }
    }

  return (
    <div className="user-search-container">
        <div className="user-search-input">
        {
            selectedUsers.map((user)=>{
                return <Pill key = {user.email}
                image = {user.image}
                text = {`${user.firstName} ${user.lastName}`}
                onClick = {()=>handleRemoveuser(user)}
                />
            })
        }
            
            <div className='user-search-div-input'>
                <input ref={inputRef} type='text' 
                    value={searchTerm} 
                    onChange={(e)=>setSearchTerm(e.target.value)} 
                    placeholder='Search for user...' 
                    onKeyDown={handleKeyDown}
                    />
                <ul className='suggestions-list'>
                {suggestions?.users?.map((user,index) =>{
                    return !selectedUserSet.has(user.email) ? 
                    (<li key={user.eamil} onClick={()=> handleSelectUser(user)}>
                        <img src={user.image} alt={`${user.firstName} ${user.lastName}`} />
                        <span> {user.firstName} {user.lastName} </span>
                    </li>) : (<></>)
                })}
                </ul>
            </div>
        </div>
    </div>
  )
}

export default Msi