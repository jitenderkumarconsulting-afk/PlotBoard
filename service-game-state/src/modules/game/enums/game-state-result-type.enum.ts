/**
 * Enum representing different types of game results.
 */
enum GameStateResultType {
  GAME_STOPPED = 'GAME_STOPPED', // Game stopped and ended with no result.
  GAME_TIED = 'GAME_TIED', // Game ended in a tie.
  PLAYER_WON = 'PLAYER_WON', // A player won the game.
  NO_RESULT = 'NO_RESULT', // Game ended with no clear result.
}

export default GameStateResultType;
