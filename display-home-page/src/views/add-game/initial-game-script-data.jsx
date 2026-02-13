export const initialGameScriptData = {
  config: {
    description: "Currently playable game script.",
    max_players: 2,
    game_duration: "Infinite",
    turn_duration: 120,
    grid: {
      rows: 8,
      columns: 8,
    },
  },
  Events: {
    LOAD: {
      MaxCount: 1,
      Count: "increment",
      Run: {
        CanvasList: [1],
        GridList: [1],
        ObjectList: [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
        ],
        UiList: [1],
      },
    },
    START: {
      MaxCount: 1,
      Count: "increment",
      Run: {
        UiList: [1],
      },
    },
    TURN: {
      MaxCount: "infinite",
      Run: {
        UiList: [2],
        ObjectsClickable: {
          myTurn: true,
        },
      },
    },
    END: {
      MaxCount: 1,
      Count: "increment",
      Run: {
        UiList: [3, 4],
      },
    },
  },
  CanvasList: [
    {
      ClickableLayers: [1, 2],
      Size: {
        Height: 800,
        Width: 800,
      },
    },
  ],
  GridList: [
    {
      Layer: 0,
      Size: {
        Rows: 8,
        Columns: 8,
      },
      SquareHeight: 100,
      SquareWidth: 100,
      BackgroundImage: "url",
      Justify: "left",
    },
  ],
  ObjectList: [
    {
      Player: 1,
      Name: "Rook_P1_1",
      type: "Rook",
      Layer: 1,
      Class: "tokenPlayer1",
      Image: "/images/game/black_rook.svg",
      StartPosition: { Row: 1, Column: 1 },
      Moves: [
        {
          UP: "Infinite",
        },
        {
          DOWN: "Infinite",
        },
        {
          LEFT: "Infinite",
        },
        {
          RIGHT: "Infinite",
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 1,
      Name: "Knight_P1_1",
      type: "Knight",
      Layer: 1,
      Class: "tokenPlayer1",
      Image: "/images/game/black_knight.svg",
      StartPosition: { Row: 1, Column: 2 },
      Moves: [
        {
          UP: [1],
          LEFT: [2],
        },
        {
          UP: [2],
          LEFT: [1],
        },
        {
          UP: [1],
          RIGHT: [2],
        },
        {
          UP: [2],
          RIGHT: [1],
        },
        {
          DOWN: [1],
          LEFT: [2],
        },
        {
          DOWN: [2],
          LEFT: [1],
        },
        {
          DOWN: [1],
          RIGHT: [2],
        },
        {
          DOWN: [2],
          RIGHT: [1],
        },
      ],
      can_jump: true,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 1,
      Name: "Bishop_P1_1",
      type: "Bishop",
      Layer: 1,
      Class: "tokenPlayer1",
      Image: "/images/game/black_bishop.svg",
      StartPosition: { Row: 1, Column: 3 },
      Moves: [
        {
          DIAGONAL: "Infinite",
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 1,
      Name: "Queen_P1",
      type: "Queen",
      Layer: 1,
      Class: "tokenPlayer1",
      Image: "/images/game/black_queen.svg",
      StartPosition: { Row: 1, Column: 4 },
      Moves: [
        {
          UP: "Infinite",
        },
        {
          DOWN: "Infinite",
        },
        {
          LEFT: "Infinite",
        },
        {
          RIGHT: "Infinite",
        },
        {
          DIAGONAL: "Infinite",
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 1,
      Name: "King_P1",
      type: "King",
      Layer: 1,
      Class: "tokenPlayer1",
      Image: "/images/game/black_king.svg",
      StartPosition: { Row: 1, Column: 5 },
      Moves: [
        {
          UP: [1],
        },
        {
          DOWN: [1],
        },
        {
          LEFT: [1],
        },
        {
          RIGHT: [1],
        },
        {
          DIAGONAL: [1],
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 1,
      Name: "Bishop_P1_2",
      type: "Bishop",
      Layer: 1,
      Class: "tokenPlayer1",
      Image: "/images/game/black_bishop.svg",
      StartPosition: { Row: 1, Column: 6 },
      Moves: [
        {
          DIAGONAL: "Infinite",
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 1,
      Name: "Knight_P1_2",
      type: "Knight",
      Layer: 1,
      Class: "tokenPlayer1",
      Image: "/images/game/black_knight.svg",
      StartPosition: { Row: 1, Column: 7 },
      Moves: [
        {
          UP: [1],
          LEFT: [2],
        },
        {
          UP: [2],
          LEFT: [1],
        },
        {
          UP: [1],
          RIGHT: [2],
        },
        {
          UP: [2],
          RIGHT: [1],
        },
        {
          DOWN: [1],
          LEFT: [2],
        },
        {
          DOWN: [2],
          LEFT: [1],
        },
        {
          DOWN: [1],
          RIGHT: [2],
        },
        {
          DOWN: [2],
          RIGHT: [1],
        },
      ],
      can_jump: true,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 1,
      Name: "Rook_P1_2",
      type: "Rook",
      Layer: 1,
      Class: "tokenPlayer1",
      Image: "/images/game/black_rook.svg",
      StartPosition: { Row: 1, Column: 8 },
      Moves: [
        {
          UP: "Infinite",
        },
        {
          DOWN: "Infinite",
        },
        {
          LEFT: "Infinite",
        },
        {
          RIGHT: "Infinite",
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 1,
      Name: "Pawn_P1_1",
      type: "Pawn",
      Layer: 1,
      Class: "tokenPlayer1",
      Image: "/images/game/black_pawn.svg",
      StartPosition: { Row: 2, Column: 1 },
      Moves: [
        {
          DOWN: [1, 2],
          first_move_only: true,
        },
        {
          DOWN: [1],
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 1,
      Name: "Pawn_P1_2",
      type: "Pawn",
      Layer: 1,
      Class: "tokenPlayer1",
      Image: "/images/game/black_pawn.svg",
      StartPosition: { Row: 2, Column: 2 },
      Moves: [
        {
          DOWN: [1, 2],
          first_move_only: true,
        },
        {
          DOWN: [1],
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 1,
      Name: "Pawn_P1_3",
      type: "Pawn",
      Layer: 1,
      Class: "tokenPlayer1",
      Image: "/images/game/black_pawn.svg",
      StartPosition: { Row: 2, Column: 3 },
      Moves: [
        {
          DOWN: [1, 2],
          first_move_only: true,
        },
        {
          DOWN: [1],
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 1,
      Name: "Pawn_P1_4",
      type: "Pawn",
      Layer: 1,
      Class: "tokenPlayer1",
      Image: "/images/game/black_pawn.svg",
      StartPosition: { Row: 2, Column: 4 },
      Moves: [
        {
          DOWN: [1, 2],
          first_move_only: true,
        },
        {
          DOWN: [1],
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 1,
      Name: "Pawn_P1_5",
      type: "Pawn",
      Layer: 1,
      Class: "tokenPlayer1",
      Image: "/images/game/black_pawn.svg",
      StartPosition: { Row: 2, Column: 5 },
      Moves: [
        {
          DOWN: [1, 2],
          first_move_only: true,
        },
        {
          DOWN: [1],
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 1,
      Name: "Pawn_P1_6",
      type: "Pawn",
      Layer: 1,
      Class: "tokenPlayer1",
      Image: "/images/game/black_pawn.svg",
      StartPosition: { Row: 2, Column: 6 },
      Moves: [
        {
          DOWN: [1, 2],
          first_move_only: true,
        },
        {
          DOWN: [1],
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 1,
      Name: "Pawn_P1_7",
      type: "Pawn",
      Layer: 1,
      Class: "tokenPlayer1",
      Image: "/images/game/black_pawn.svg",
      StartPosition: { Row: 2, Column: 7 },
      Moves: [
        {
          DOWN: [1, 2],
          first_move_only: true,
        },
        {
          DOWN: [1],
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 1,
      Name: "Pawn_P1_8",
      type: "Pawn",
      Layer: 1,
      Class: "tokenPlayer1",
      Image: "/images/game/black_pawn.svg",
      StartPosition: { Row: 2, Column: 8 },
      Moves: [
        {
          DOWN: [1, 2],
          first_move_only: true,
        },
        {
          DOWN: [1],
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 2,
      Name: "Pawn_P2_1",
      type: "Pawn",
      Layer: 1,
      Class: "tokenPlayer2",
      Image: "/images/game/red_pawn.svg",
      StartPosition: { Row: 7, Column: 1 },
      Moves: [
        {
          UP: [1, 2],
          first_move_only: true,
        },
        {
          UP: [1],
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 2,
      Name: "Pawn_P2_2",
      type: "Pawn",
      Layer: 1,
      Class: "tokenPlayer2",
      Image: "/images/game/red_pawn.svg",
      StartPosition: { Row: 7, Column: 2 },
      Moves: [
        {
          UP: [1, 2],
          first_move_only: true,
        },
        {
          UP: [1],
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 2,
      Name: "Pawn_P2_3",
      type: "Pawn",
      Layer: 1,
      Class: "tokenPlayer2",
      Image: "/images/game/red_pawn.svg",
      StartPosition: { Row: 7, Column: 3 },
      Moves: [
        {
          UP: [1, 2],
          first_move_only: true,
        },
        {
          UP: [1],
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 2,
      Name: "Pawn_P2_4",
      type: "Pawn",
      Layer: 1,
      Class: "tokenPlayer2",
      Image: "/images/game/red_pawn.svg",
      StartPosition: { Row: 7, Column: 4 },
      Moves: [
        {
          UP: [1, 2],
          first_move_only: true,
        },
        {
          UP: [1],
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 2,
      Name: "Pawn_P2_5",
      type: "Pawn",
      Layer: 1,
      Class: "tokenPlayer2",
      Image: "/images/game/red_pawn.svg",
      StartPosition: { Row: 7, Column: 5 },
      Moves: [
        {
          UP: [1, 2],
          first_move_only: true,
        },
        {
          UP: [1],
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 2,
      Name: "Pawn_P2_6",
      type: "Pawn",
      Layer: 1,
      Class: "tokenPlayer2",
      Image: "/images/game/red_pawn.svg",
      StartPosition: { Row: 7, Column: 6 },
      Moves: [
        {
          UP: [1, 2],
          first_move_only: true,
        },
        {
          UP: [1],
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 2,
      Name: "Pawn_P2_7",
      type: "Pawn",
      Layer: 1,
      Class: "tokenPlayer2",
      Image: "/images/game/red_pawn.svg",
      StartPosition: { Row: 7, Column: 7 },
      Moves: [
        {
          UP: [1, 2],
          first_move_only: true,
        },
        {
          UP: [1],
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 2,
      Name: "Pawn_P2_8",
      type: "Pawn",
      Layer: 1,
      Class: "tokenPlayer2",
      Image: "/images/game/red_pawn.svg",
      StartPosition: { Row: 7, Column: 8 },
      Moves: [
        {
          UP: [1, 2],
          first_move_only: true,
        },
        {
          UP: [1],
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 2,
      Name: "Rook_P2_1",
      type: "Rook",
      Layer: 1,
      Class: "tokenPlayer2",
      Image: "/images/game/red_rook.svg",
      StartPosition: { Row: 8, Column: 1 },
      Moves: [
        {
          UP: "Infinite",
        },
        {
          DOWN: "Infinite",
        },
        {
          LEFT: "Infinite",
        },
        {
          RIGHT: "Infinite",
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 2,
      Name: "Knight_P2_1",
      type: "Knight",
      Layer: 1,
      Class: "tokenPlayer2",
      Image: "/images/game/red_knight.svg",
      StartPosition: { Row: 8, Column: 2 },
      Moves: [
        {
          UP: [1],
          LEFT: [2],
        },
        {
          UP: [2],
          LEFT: [1],
        },
        {
          UP: [1],
          RIGHT: [2],
        },
        {
          UP: [2],
          RIGHT: [1],
        },
        {
          DOWN: [1],
          LEFT: [2],
        },
        {
          DOWN: [2],
          LEFT: [1],
        },
        {
          DOWN: [1],
          RIGHT: [2],
        },
        {
          DOWN: [2],
          RIGHT: [1],
        },
      ],
      can_jump: true,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 2,
      Name: "Bishop_P2_1",
      type: "Bishop",
      Layer: 1,
      Class: "tokenPlayer2",
      Image: "/images/game/red_bishop.svg",
      StartPosition: { Row: 8, Column: 3 },
      Moves: [
        {
          DIAGONAL: "Infinite",
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 2,
      Name: "Queen_P2",
      type: "Queen",
      Layer: 1,
      Class: "tokenPlayer2",
      Image: "/images/game/red_queen.svg",
      StartPosition: { Row: 8, Column: 4 },
      Moves: [
        {
          UP: "Infinite",
        },
        {
          DOWN: "Infinite",
        },
        {
          LEFT: "Infinite",
        },
        {
          RIGHT: "Infinite",
        },
        {
          DIAGONAL: "Infinite",
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 2,
      Name: "King_P2",
      type: "King",
      Layer: 1,
      Class: "tokenPlayer2",
      Image: "/images/game/red_king.svg",
      StartPosition: { Row: 8, Column: 5 },
      Moves: [
        {
          UP: [1],
        },
        {
          DOWN: [1],
        },
        {
          LEFT: [1],
        },
        {
          RIGHT: [1],
        },
        {
          DIAGONAL: [1],
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 2,
      Name: "Bishop_P2_2",
      type: "Bishop",
      Layer: 1,
      Class: "tokenPlayer2",
      Image: "/images/game/red_bishop.svg",
      StartPosition: { Row: 8, Column: 6 },
      Moves: [
        {
          DIAGONAL: "Infinite",
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 2,
      Name: "Knight_P2_2",
      type: "Knight",
      Layer: 1,
      Class: "tokenPlayer2",
      Image: "/images/game/red_knight.svg",
      StartPosition: { Row: 8, Column: 7 },
      Moves: [
        {
          UP: [1],
          LEFT: [2],
        },
        {
          UP: [2],
          LEFT: [1],
        },
        {
          UP: [1],
          RIGHT: [2],
        },
        {
          UP: [2],
          RIGHT: [1],
        },
        {
          DOWN: [1],
          LEFT: [2],
        },
        {
          DOWN: [2],
          LEFT: [1],
        },
        {
          DOWN: [1],
          RIGHT: [2],
        },
        {
          DOWN: [2],
          RIGHT: [1],
        },
      ],
      can_jump: true,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
    {
      Player: 2,
      Name: "Rook_P2_2",
      type: "Rook",
      Layer: 1,
      Class: "tokenPlayer2",
      Image: "/images/game/red_rook.svg",
      StartPosition: { Row: 8, Column: 8 },
      Moves: [
        {
          UP: "Infinite",
        },
        {
          DOWN: "Infinite",
        },
        {
          LEFT: "Infinite",
        },
        {
          RIGHT: "Infinite",
        },
      ],
      can_jump: false,
      is_capturable: true,
      captureable_object_types: ["Rook", "Knight", "Bishop", "Queen", "King"],
    },
  ],
  ClassList: [
    {
      Name: "tokenPlayer1",
      AssetId: "id",
      Height: 90,
      Width: 90,
      Colour: "blue",
    },
    {
      Name: "tokenPlayer2",
      AssetId: "id",
      Height: 90,
      Width: 90,
      Colour: "red",
    },
  ],
  UiList: [
    {
      Name: "welcome",
      Justify: "center",
      Size: "100%",
      Text: {
        Content: "Welcome to Simple Board Game",
        RelativePosition: [50, 50],
      },
    },
    {
      Name: "gameTurn",
      Justify: "bottom",
      Size: "100%",
      Text: {
        Content: "Player's Turn",
        RelativePosition: [50, 95],
      },
    },
    {
      Name: "gameOver",
      Justify: "center",
      Size: "100%",
      Text: {
        Content: "Game Over",
        RelativePosition: [50, 50],
      },
    },
    {
      Name: "end",
      Justify: "center",
      Size: "100%",
      Text: {
        Content: "Thanks for playing",
        RelativePosition: [50, 50],
      },
    },
  ],
  AnimationList: [
    {
      Name: "move",
      Url: "move_animation_url",
    },
  ],
  TriggerList: [
    {
      Type: "Move",
      Run: {
        Animation: [1],
      },
    },
  ],
  WinList: [
    {
      condition: "CAPTURED_OBJECT",
      Player: 1,
      object_types: ["King"],
      Run: {
        UiList: [3],
        Events: ["END"],
      },
    },
    {
      condition: "CAPTURED_OBJECT",
      Player: 2,
      object_types: ["King"],
      Run: {
        UiList: [3],
        Events: ["END"],
      },
    },
  ],
};

export default initialGameScriptData;
