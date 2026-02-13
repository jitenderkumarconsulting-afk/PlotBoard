import React from 'react';
import { useParams } from 'react-router-dom';

import GameRoomSetup from './game-room';

const GameRoomContainer = () => {
    const params=useParams();

    const gameToken=params.token;
    
    return (
        <GameRoomSetup gameToken= {gameToken} />
    );
};

export default GameRoomContainer;