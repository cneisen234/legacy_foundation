import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import logo from "../../images/image.png";
import HomeIcon from '@material-ui/icons/Home';
import CreateIcon from '@material-ui/icons/Create';
import FormatListBulletedIcon from '@material-ui/icons/FormatListBulleted';
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';

const Nav = (props) => (
  <div className="nav">
    <Link to="/home">
      <img
        className="logo"
        src={logo}
        alit="logo"
        style={{ float: "left", width: 1100 }}
      />
      {props.user.id && props.user.role === "admin"&& (
        <>
          <h2 className="nav-title">Admin Dashboard</h2>
        </>
      )}
      
    </Link>
    <div className="nav-right">
      <Link className="nav-link" to="/home">
        {/* Show this link if they are logged in or not,
        but call this link 'Home' if they are logged in,
        and call this link 'Login / Register' if they are not */}
        {props.user.id ? <><HomeIcon></HomeIcon> Home</> : <><ExitToAppIcon></ExitToAppIcon> Login</>}
      </Link>
      {/* Show the link to the info page and the logout button if the user is logged in */}
      {props.user.id && props.user.role === "admin" && (
        <>
        <Link className="nav-link" to="/totalstudententries">
          <FormatListBulletedIcon></FormatListBulletedIcon>
            Student Entries
          </Link>
        
          <Link className="nav-link" to="/pastadminreports">
            <PlaylistAddCheckIcon></PlaylistAddCheckIcon>
            Past Reports
          </Link>

           <Link className="nav-link" to="/adminusers">
            Admin Users
          </Link>
          <Link className="nav-link" to="/resetadminpassword">
            <RotateLeftIcon></RotateLeftIcon>
          Reset Password
          </Link>
          <LogOutButton className="nav-link" />
        </>
      )}




      {props.user.id && props.user.role === "student" && (
        <>
          <Link className="nav-link" to="/makeentry">
            <CreateIcon></CreateIcon>
            Make an Entry
          </Link>
          <Link className="nav-link" to="/paststudententries">
          <FormatListBulletedIcon></FormatListBulletedIcon>
            Past Entries
          </Link>
        <Link className="nav-link" to="/resetstudentpassword">
          <RotateLeftIcon></RotateLeftIcon>
           Reset Password
          </Link>
          
          <LogOutButton className="nav-link" />
        </>
      )}
      {/* Always show this link since the about page is not protected */}
      <Link className="nav-link" to="/about">
        About
      </Link>
    </div>
  </div>
);

// Instead of taking everything from state, we just want the user
// object to determine if they are logged in
// if they are logged in, we show them a few more links 
// if you wanted you could write this code like this:
// const mapStateToProps = ({ user }) => ({ user });
const mapStateToProps = state => ({
  user: state.user,
});

export default connect(mapStateToProps)(Nav);
