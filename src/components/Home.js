import {Component} from 'react';
import {connect} from 'react-redux';
import {Navigate} from 'react-router-dom';


class Home extends Component {

    state = {
        tab_one:'block',
        formdata:{
            username:"",
            mobile:"",
            email:"",
            address:""
        },
        users:[]
    }

    handleClick = (e) => {
        fetch('/logout').then(res=>res.json()).then(data=>{
            if(data.isLogout){
                this.props.alertTimer(data.msg,data.isLogout);
                this.props.dispatch_action('RESET_USER');
            } else {
                this.props.alertTimer(data.msg,data.isLogout);
            }
        });
    }

    handleTab = (e,tab_no) => {
        if(tab_no===1) {
            this.setState(prev=>({
                ...prev,
                tab_one:'block'
            }));
        } else {
            this.setState(prev=>({
                ...prev,
                tab_one:'none'
            }));

            const reqOptions = {
                method: "GET",
                headers: new Headers(
                    {
                        'Content-Type': 'application/json',
                        'Authorization':this.props.userdata.user.email
                    }
                ),
            };

            fetch('/getAllUsers',reqOptions).then(response => response.json()).then(data=>{
                this.props.alertTimer(data.msg,data.isSuccess);
                this.setState(prev=>({
                    ...prev,
                    users:data.users
                }));
            });

        }
    }

    handleChange = (e) => {
        this.setState(prev=>({
            ...prev,
            formdata:{
                ...prev.formdata,
                [e.target.name]: e.target.value
            }
        }));
    }

    noSpace = (username) => {
        for(let i=0;i<username.length;i++) {
            if(username[i]===' ') {
                return false;
            }
        }
        return username.length>0;
    }

    validMobile = (mobile) => {
        if(mobile.length!==10) {
            return false;
        }
        let nums = [1,2,3,4,5,6,7,8,9,0];
        for(let i=0;i<nums.length;i++) {
            if(!(mobile[i] in nums)) {
                return false;
            }
        }
        return true;
    }

    validEmail = (email) => {
        const pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/; 
        return String(email).search(pattern) !== -1
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const nospacerule = this.noSpace(this.state.formdata.username);
        const mobilerule = this.validMobile(this.state.formdata.mobile);
        const emailrule = this.validEmail(this.state.formdata.email);
        const addressrule = this.state.formdata.address!=="";
        if(nospacerule && mobilerule && addressrule && emailrule) {
            const reqOptions = {
                method: "POST",
                headers: new Headers(
                    {
                        'Content-Type': 'application/json',
                        'Authorization':this.props.userdata.user.email
                    }
                ),
                body:JSON.stringify(this.state.formdata)
            };

            fetch('/addUser',reqOptions).then(res=>res.json()).then(data=>{
                this.props.alertTimer(data.msg,data.isAdded);
            });
        } else {
            this.props.alertTimer('Invalid Form Data',false);
        }

    }
    render() { 

        if(!this.props.userdata.isAuthenticated) {
            return <Navigate to="/login" />;
        }

        const users = this.state.users.length===0 ? 'No Users Added' : 
            this.state.users.map((user,index)=>(
                <div className="user" key={index}>
                    <table>
                        <tbody>
                            <tr>
                                <td>username &nbsp;&nbsp;&nbsp;&nbsp;</td>
                                <td>{user.username}</td>
                            </tr>
                            <tr>
                                <td>mobile &nbsp;&nbsp;&nbsp;&nbsp;</td>
                                <td>{user.mobile}</td>
                            </tr>
                            <tr>
                                <td>email &nbsp;&nbsp;&nbsp;&nbsp;</td>
                                <td>{user.email}</td>
                            </tr>
                            <tr>
                                <td>address &nbsp;&nbsp;&nbsp;&nbsp;</td>
                                <td>{user.address}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ));
        

        return ( 
            <div className="home">
                <nav>
                    <div>User : {this.props.userdata.user.email}</div>
                    <div>
                        <button onClick={(e)=>this.handleTab(e,1)}>Tab 1</button>
                        <button onClick={(e)=>this.handleTab(e,2)}>Tab 2</button>
                        <button onClick={this.handleClick}>Logout</button>
                    </div>
                </nav>
                <div className="tabs">
                    <div className="tab1" style={{display:this.state.tab_one}}>
                        <form onSubmit={this.handleSubmit}>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Username&nbsp;&nbsp;</td>
                                        <td><input name="username" value={this.state.formdata.username} placeholder="Enter Username...." required={true} onChange={this.handleChange}/></td>
                                    </tr>
                                    <tr>
                                        <td>Mobile&nbsp;&nbsp;</td>
                                        <td><input name="mobile" value={this.state.formdata.mobile} placeholder="Enter Mobile...." required={true} onChange={this.handleChange} /></td>
                                    </tr>
                                    <tr>
                                        <td>Email&nbsp;&nbsp;</td>
                                        <td><input name="email" value={this.state.formdata.email} placeholder="Enter Email...." required={true} onChange={this.handleChange} /></td>
                                    </tr>
                                    <tr>
                                        <td>Address&nbsp;&nbsp;</td>
                                        <td><input name="address" value={this.state.formdata.address} placeholder="Enter Address...." required={true} onChange={this.handleChange} /></td>
                                    </tr>
                                    <tr>
                                        <td></td>
                                        <td><input type="submit" value="add user"/></td>
                                        <td></td>
                                    </tr>
                                </tbody>
                            </table>
                        </form>
                    </div>
                    <div className="tab2">
                       {users}
                    </div>
                </div>
            </div>
        );
    }
}
 

const mapStateToProps = (state) => {
    return {
        userdata:state
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
      dispatch_action: (type) => dispatch({ type: type }),
    }
  }
export default connect(mapStateToProps,mapDispatchToProps)(Home);