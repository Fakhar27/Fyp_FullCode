import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from './AuthContext';

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;



// import { Route, Redirect } from 'react-router-dom'
// import { useContext } from 'react'
// import AuthContext from './AuthContext'

// const PrivateRoute = ({children, ...rest}) => {
//     let {user} = useContext(AuthContext)
//     return(
//         <Route {...rest}>{!user ? <Redirect to="/login" /> :   children}</Route>
//     )
// }

// export default PrivateRoute;