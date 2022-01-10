import {useState} from 'react';
import {connect,useDispatch} from 'react-redux';
import { Navigate, } from 'react-router-dom';



function Login({setErrData,userdata}) {
    const [data,setData] = useState({'email':'', 'password':''});
    const dispatch = useDispatch();

    const hangleChange = (e) => {
        setData((prev)=>({
            ...prev,
            [e.target.name]:e.target.value
        }));
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        setData({'email':'', 'password':''});

        const reqOptions = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        };

        fetch('/login',reqOptions)
        .then((response) => response.json())
        .then(info=>{
            console.log(info);
            setErrData(info.msg,info.success);
            if(info.success) {
                fetch('/getUser').then((response) => response.json()).then(data=>{
                    dispatch({type:'SET_USER',payload:{'user':data.user}});
                });
            }
        });
    }
    if(userdata.isAuthenticated) {
        return <Navigate to="/"/>;
    } else  {
        return (
            <div>
                <form onSubmit={handleSubmit}  className="login-form">
                    <h3>Login Page</h3>
                    <table>
                        <tbody>
                            <tr>
                                <td>Enter Email &nbsp;</td>
                                <td><input type="email" placeholder="Enter Your Email" name="email" onChange={hangleChange} required={true} value={data.email}/></td>
                            </tr>
                            <tr>
                                <td>Enter Password &nbsp;</td>
                                <td> <input type="password" placeholder="Enter Your Password" name="password" onChange={hangleChange} required={true} value={data.password}/></td>
                            </tr>
                            <tr>
                                <td><input type="submit" value="submit"/></td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </form>
            </div>
        );
    }
}


function mapStateToProps(state) {
    return {
        userdata:state
    };
}



export default connect(mapStateToProps)(Login);