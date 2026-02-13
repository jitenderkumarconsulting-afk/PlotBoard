// import { LOGIN, REGISTER, LOGOUT } from "../actions/authentication";
// export const initialState = {
//   isAuthenticated: false,
//   user: {},
//   accessToken: "",
// };

// export const authReducer = (state=initialState, action) => {
//     switch(action.type){
//         case LOGIN:
//             return {
//                 ...state,
//                 isAuthenticated:action.payload
//             }
//         case REGISTER:
//             return {
//                 ...state
//                 // isAuthenticated: !action.payload.twoFactorEnabled,
//                 // user: {
//                 //     id:action.payload.id,
//                 //     email:action.payload.email,
//                 //     companyName:action.payload.companyName,
//                 //     userType: action.payload.userType,
//                 // },
//                 // accessToken: action.payload.token
//             }
//         case LOGOUT:
//             return {
//                 ...state,
//                 isAuthenticated: false
//             }
        
//         default:
//             return state
//     }
// }
