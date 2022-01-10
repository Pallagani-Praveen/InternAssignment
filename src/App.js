import Login from './components/Login';
import Alert from './components/Alert';
import Home from './components/Home';
import {useState} from 'react';
import {Navigate, Route,Routes} from 'react-router-dom';
import './App.css';
import {useEffect} from 'react';
import {useDispatch} from 'react-redux';



function App() {

  const dispatch = useDispatch();
  // load the user from token 
  useEffect(function(){
    fetch('/getUser').then((response) => response.json()).then(data=>{
      if(data.isAuthenticated) {
        dispatch({type:'SET_USER',payload:{'user':data.user}});
        alertTimer('User Loaded',data.isAuthenticated);
      }
      else {
        dispatch({type:'RESET_USER'});
      }
    });
  },[dispatch]);

  const [errdata,setErrData] = useState({'msg':'','isAlert':false,'flag':false});

  const alertTimer = (msg,flag) => {

    setErrData(prev=>({
      ...prev,
      'msg':msg,
      'isAlert':true,
      'flag':flag
    }));

    setTimeout(() =>{
      setErrData(prev=>({
        ...prev,
        'msg':'',
        'isAlert':false,
        'flag':flag
      }));
    },5000);
  }

  return (
    <div className="App">
      {
        errdata.isAlert ? <Alert msg={errdata.msg} flag={errdata.flag} />: ''
      }
      <Routes>
        
          <Route path="/login" element={<Login setErrData={alertTimer}/>} />
          <Route path="/" element={<Home alertTimer={alertTimer}/>} />
          <Route path="*"  element={<Navigate to="/login" />} />
        
      </Routes>
    </div>
  );
}

export default App;
