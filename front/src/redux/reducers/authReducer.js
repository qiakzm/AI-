const initialState = {
  isLoggedIn: false,
  userId: null,
  username: null,
  password: '',
  loginError: '',
  registerError: '',
  foundId: '',
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoggedIn: true,
        userId: '',
        user: '',
        password: null,
        loginError: '',
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoggedIn: false,
        userId: null,
        user: null,
        password: '',
        loginError: action.payload,
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        registerError: '',
      };
    case 'REGISTER_FAILURE':
      return {
        ...state,
        registerError: action.payload,
      };
    case 'FIND_ID_SUCCESS':
      return {
        ...state,
        foundId: action.payload,
      };
    case 'FIND_ID_FAILURE':
      return {
        ...state,
        foundId: '',
      };
    case 'LOGOUT':
      return {
        ...state,
        isLoggedIn: false,
        userId: null,
        user: null,
        password: '',
      };
    case 'SET_USERNAME':
      return {
        ...state,
        username: action.payload,
      };  
      
    default:
      return state;
  }
};

export default authReducer;
