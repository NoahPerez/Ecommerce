import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { connect } from 'react-redux'

import './App.css';

import HomePage from './pages/homepage/homepage.component';
import ShopPage from './pages/shop/shop.component';
import SignInAndSignUpPage from './pages/sign-in-and-sign-up/sign-in-and-sign-up.component';
import Header from './components/header/header.component';
import { auth, createUserProfileDocument } from './firebase/firebase.utils';
import { setCurrentUser } from './redux/user /user.actions';



class App extends React.Component {
  unsubscribeFromAuth = null

  componentDidMount() {
    const { setCurrentUser } = this.props; // deconstructing 

    this.unsubscribeFromAuth = auth.onAuthStateChanged(async userAuth => {  // this is connected to our firebase.utils.js // authenticated user 
      if (userAuth) {
        const userRef = await createUserProfileDocument(userAuth);  // we can back from our userReft

        userRef.onSnapshot(snapShot => {   // we going to get the snapShot data that is the object 
          setCurrentUser({  // this is form dispatch// with the value 
            id: snapShot.id, // we are still passing the object 
            ...snapShot.data() // whenever our snapShot comes in 
          });
        });
      }
      else {
        setCurrentUser(userAuth); // we just need what the object we want to update it with 
      }
    })
  }

  componentWillUnmount() {     /// this is stop component to continue mounting 
    this.unsubscribeFromAuth();
  }

  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path='/' component={HomePage} />
          <Route path='/shop' component={ShopPage} />
          <Route path='/signIn' component={SignInAndSignUpPage} />
        </Switch>
      </div>
    );
  }
}


//2nd argument will be mapDispatchToProps which is a function that gets this dispatch property that will return an object 
//where the property name will be whatever prop we want to pass in dispatches. the new action that we are trying to pass witch is setCurrentUser
// we need to import that action import { setCurrentUser } from './redux/user /user.actions';
const mapDispatchToProps = dispatch => ({
  setCurrentUser: user => dispatch(setCurrentUser(user))
  // user goes to a function that gets the user object and then calls dispatch and what is dispatches is whatever you are passing me whatever object you're passing me is going to be an action object that im going to pass to every reducer 
  // so our action is a function that // so user.action.js is a function that gets the user but returns an action abject.
  // are just dispatching the object 

  // after we don't need the constructor anymore 
})





// 1st argument we can do is pass in null as the first argument because we don't need any state so props from our reducer 

export default connect(null, mapDispatchToProps)(App);
