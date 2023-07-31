import React,{ useState, useEffect } from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

const TeamChannelPreview = ({ setActiveChannel, setIsCreating, setIsEditing, setToggleContainer, channel, type, }) => {
    const { channel: activeChannel, client } = useChatContext();
    const [timer, setTimer] = useState('10:00');

    // useEffect(() => {
    //     const intervalId = setInterval(() => {
    //         const timeLeft = Math.round((channel?.data?.timer - Date.now()) / 1000);

    //         const minutes = Math.floor(timeLeft / 60);
    //         const seconds = timeLeft % 60;

    //         setTimer(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);

    //         // if (timeLeft <= 0) {
    //         //     channel.delete();
    //         // }
    //     }, 1000);

    //     return () => clearInterval(intervalId);
    // }, [channel]);


    const ChannelPreview = () => (
        <p className="channel-preview__item">
            # {channel?.data?.name || channel?.data?.id}
        </p>
    );


    const DirectPreview = () => {
        const members = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID);
    
        console.log(members[0]);

        return (
            <div className="channel-preview__item single">
                <Avatar 
                    image={members[0]?.user?.image}
                    name={members[0]?.user?.fullName || members[0]?.user?.id}
                    size={24}
                />
                <p>{members[0]?.user?.fullName || members[0]?.user?.id}</p>
                <p> | </p>
                <p> {timer} min left</p>
                
                
                
            </div>
        )
    }

    return (
        <div className={
            channel?.id === activeChannel?.id
                ? 'channel-preview__wrapper__selected'
                : 'channel-preview__wrapper'
        }
        onClick={() => {
            setIsCreating(false);
            setIsEditing(false);
            setActiveChannel(channel);
            if(setToggleContainer) {
                setToggleContainer((prevState) => !prevState)
            }
        }}
        >
            {type === 'team' ? <ChannelPreview /> : <DirectPreview />}
        </div>
    );
}

export default TeamChannelPreview
