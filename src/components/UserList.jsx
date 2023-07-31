import React, { useEffect, useState } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

import { InviteIcon } from '../assets';

const ListContainer = ({ children }) => {
    return (
        <div className="user-list__container">
            <div className="user-list__header">
                <p>User</p>
                <p>Invite</p>
            </div>
            {children}
        </div>
    )
}

const UserItem = ({ user, setSelectedUsers }) => {
    const [selected, setSelected] = useState(false)
    

    const handleSelect = () => {
        if(selected) {
            setSelectedUsers((prevUsers) => prevUsers.filter((prevUser) => prevUser !== user.id))
        } else {
            setSelectedUsers((prevUsers) => [...prevUsers, user.id])
        }

        setSelected((prevSelected) => !prevSelected)
    }

    return (
        <div className="user-item__wrapper" onClick={handleSelect}>
            <div className="user-item__name-wrapper">
                <Avatar image={user.image} name={user.fullName || user.id} size={32} />
            
                <p className="user-item__name">{user.fullName || user.id}</p>
                {user.online ? (
                <div className="user-item__status user-item__status--online" />
                    ) : (
                  <div className="user-item__status user-item__status--offline" />
                 )}
            </div>
            {selected ? <InviteIcon /> : <div className="user-item__invite-empty" />}
        </div>
    )
}


const UserList = ({ setSelectedUsers }) => {
    const { client } = useChatContext();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [listEmpty, setListEmpty] = useState(false);
    const [error, setError] = useState(false);

    useEffect(() => {
        const getUsers = async () => {
            if(loading) return;

            setLoading(true);
            
            try {
                const response = await client.queryUsers(
                    { role: 'doctor', id: { $ne: client.userID }, 
                    
                },
                    { id: 1 },
                    // { limit: 8 } 
                );

                if (response.users.length) {
                    // Sort the users based on their online status
                    const sortedUsers = response.users.sort((a, b) => {
                      if (a.online && !b.online) {
                        return -1; // a comes before b
                      } else if (!a.online && b.online) {
                        return 1; // b comes before a
                      } else {
                        return 0; // no change in order
                      }
                    });
              
                    setUsers(sortedUsers);
                  } else {
                    setListEmpty(true);
                  }
                } catch (error) {
                  setError(true);
                }
                setLoading(false);
        }

        if(client) {
            getUsers();
    
            client.on('user.updated', (updatedUser) => {
                setUsers((prevUsers) => {
                    const index = prevUsers.findIndex((user) => user.id === updatedUser.id);
                    if (index > -1) {
                        const newUsers = [...prevUsers];
                        newUsers[index] = updatedUser;
                        return newUsers;
                    }
                    return prevUsers;
                });
            });
        }
    
        return () => {
            if (client) {
                client.off('user.updated');
            }
        };
            
        
    }, []);

    if(error) {
        return (
            <ListContainer>
                <div className="user-list__message">
                    Error loading, please refresh and try again.
                </div>
            </ListContainer>
        )
    }

    if(listEmpty) {
        return (
            <ListContainer>
                <div className="user-list__message">
                    No users found.
                </div>
            </ListContainer>
        )
    }

    return (
        <ListContainer>
            {loading ? <div className="user-list__message">
                Loading users...
            </div> : (
                users?.map((user, i) => (
                  <UserItem index={i} key={user.id} user={user} setSelectedUsers={setSelectedUsers} />  
                ))
            )}
        </ListContainer>
    )
}

export default UserList;