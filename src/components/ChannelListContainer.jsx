import React, { useState } from 'react';
import { ChannelList, useChatContext } from 'stream-chat-react';
import Cookies from 'universal-cookie';

import { ChannelSearch, TeamChannelList, TeamChannelPreview } from './';
import LogoutIcon from '../assets/logout.png'

const cookies = new Cookies();

const SideBar = ({ logout, handleToggleInvisible, invisible }) => (
  <div className="channel-list__sidebar">
    <div className="channel-list__sidebar__icon2">
      <div className="icon1__inner" onClick={logout}>
        <img src={LogoutIcon} alt="Logout" width="30" />
      </div>
    </div>
        <div className="channel-list__sidebar__icon2">
            <div className="icon1__inner" onClick={handleToggleInvisible}>
            {invisible ? 'offline' : 'online'}
            </div>
    </div>
  </div>
);

const CompanyHeader = ({ invisible, handleToggleInvisible }) => {
    const { client } = useChatContext();
    const username = cookies.get('username');
    const status = client.user?.online ? <div className="user-item__status user-item__status--online" /> : <div className="user-item__status user-item__status--offline" />;
  
 
  
    return (
      <div className="channel-list__header">
        <p className="channel-list__header__text">
          User View Test ({username})
           {/* <span>{status}</span> */}
           {/* {client.user?.online ? (<div className="user-item__status user-item__status--online" />) : (<div className="user-item__status user-item__status--offline" />)} */}
        </p>
        
      </div>
    );
  };
  
  const customChannelTeamFilter = (channels) => {
    return channels.filter((channel) => channel.type === 'team');
  };
  
  const customChannelMessagingFilter = (channels) => {
    return channels.filter((channel) => channel.type === 'messaging');
  };
  
  const ChannelListContent = ({ isCreating, setIsCreating, setCreateType, setIsEditing, setToggleContainer }) => {
    const { client } = useChatContext();
    const [invisible, setInvisible] = useState(client.user.invisible);
  
    const handleToggleInvisible = async (updatedInvisible) => {
        setInvisible(updatedInvisible);
        await client.upsertUser({
          id: client.user.id,
          invisible: updatedInvisible,
        });
      };
  
    const logout = () => {
      cookies.remove('token');
      cookies.remove('userId');
      cookies.remove('username');
      cookies.remove('fullName');
      cookies.remove('avatarURL');
      cookies.remove('hashedPassword');
      cookies.remove('phoneNumber');
  
      window.location.reload();
    };

  const filters = { members: { $in: [client.userID] } };
    return (
        <>

            <SideBar 
            logout={logout}
            handleToggleInvisible={() => handleToggleInvisible(!invisible)} 
            invisible={invisible}
             />
            <div className="channel-list__list__wrapper">
                <CompanyHeader />
                <ChannelList 
                    filters={filters}
                    channelRenderFilterFn={customChannelMessagingFilter}
                    List={(listProps) => (
                        <TeamChannelList 
                            {...listProps}
                            type="messaging"
                            isCreating={isCreating}
                            setIsCreating={setIsCreating}
                            setCreateType={setCreateType} 
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                        />
                    )}
                    Preview={(previewProps) => (
                        <TeamChannelPreview 
                            {...previewProps}
                            setIsCreating={setIsCreating}
                            setIsEditing={setIsEditing}
                            setToggleContainer={setToggleContainer}
                            type="messaging"
                        />
                    )}
                />
            </div>
        </>
    );
}

const ChannelListContainer = ({ setCreateType, setIsCreating, setIsEditing }) => {
    const [toggleContainer, setToggleContainer] = useState(false);

    return (
        <>
            <div className="channel-list__container">
              <ChannelListContent 
                setIsCreating={setIsCreating} 
                setCreateType={setCreateType} 
                setIsEditing={setIsEditing} 
              />
            </div>

            <div className="channel-list__container-responsive"
                style={{ left: toggleContainer ? "0%" : "-89%", backgroundColor: "#005fff"}}
            >
                <div className="channel-list__container-toggle" onClick={() => setToggleContainer((prevToggleContainer) => !prevToggleContainer)}>
                </div>
                <ChannelListContent 
                setIsCreating={setIsCreating} 
                setCreateType={setCreateType} 
                setIsEditing={setIsEditing}
                setToggleContainer={setToggleContainer}
              />
            </div>
        </>
    )

}

export default ChannelListContainer;

