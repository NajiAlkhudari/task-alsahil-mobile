import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; 
import clientsReducer from './clientSlice';
import tasksReducer from './taskSlice';
import meReducer from './meSlice';
import visitReducer from './visitSlice'
import reportReducer from './reportSlice'



const store = configureStore({
    reducer: {
        auth: authReducer, 
        clients:clientsReducer,
        tasks:tasksReducer,
        me:meReducer,
        visits : visitReducer,
        report : reportReducer,

    },
  });
  
  export default store;
  