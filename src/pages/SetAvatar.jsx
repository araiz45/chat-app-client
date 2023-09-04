import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Loader from "../assets/loader.gif";
import { Buffer } from "buffer";
import { ToastContainer, toast } from "react-toastify";
import generateName from 'sillyname';
import "react-toastify/dist/ReactToastify.css";
import { setAvatarRoute } from "../utils/APIRoutes";

export default function SetAvatar() {
  const api = "https://api.multiavatar.com";
  const navigate = useNavigate("/");
  const [avatar, setAvatar] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const toastOption = {
    position: "bottom-right",
    autoClose: 8000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };
  useEffect(() => {
    const checkingUser = () =>{
      if (!localStorage.getItem("chat-app-user")) {
        navigate("/login");
      }
    }

    checkingUser();
  }, [])
  
  const setProfilePicture = async () => {
    if(selectedAvatar === undefined){
        toast.error("Please select an avatar", toastOption);
    }else{
        console.log(selectedAvatar, avatar)
        const user = await JSON.parse(localStorage.getItem('chat-app-user'))
        const { data } = await axios.post(`${setAvatarRoute}/${user._id}`, {
            image: avatar[selectedAvatar]
        })
        if(data.isSet){
            user.isAvatarImageSet = true;
            user.avatarImage = data.image;
            localStorage.setItem('chat-app-user', JSON.stringify(user))
            return navigate('/')
        }else{
            toast.error('Error in Setting avatar. Please tryagain', toastOption)
        }
    }
  };
  useEffect( () => {
    const fetchingData = async () =>{
        const data = [];
    for (let i = 0; i < 4; i++) {
      const image = await axios.get(
        // `${api}/${Math.round(Math.random() * 10000000)}`
        // `${api}/${Math.round(Math.random() * 10000000)}.svg`
        `${api}/${generateName()}.svg`
      );
      const buffer = new Buffer(image.data);
      data.push(buffer.toString("base64"));
    }
    setAvatar(data);
    setIsLoading(false);
    }
    fetchingData();
  }, []);

  return (
    <>
    {isLoading? <Container><img src={Loader} alt="loading" className="loader"/></Container>:<>
      <Container>
        <div className="title-container">
          <h1>Pick an avatar as your profile image</h1>
        </div>
        <div className="avatars">
          {avatar.map((avatar, index) => {
            return (
              <div
                className={`avatar ${
                  selectedAvatar === index ? "selected" : ""
                }`}
                key={index}
              >
                <img
                  src={`data:image/svg+xml;base64,${avatar}`}
                  alt="avatar"
                  onClick={() => setSelectedAvatar(index)}
                />
              </div>
            );
          })}
        </div>
        <button className="submit-btn" onClick={setProfilePicture}>Set as Profile</button>
      </Container>
      <ToastContainer />
      </>
        }
    </>
  );
}

const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
flex-direction: column;
gap: 3rem;
background-color: #131324;
height: 100vh;
width: 100vw;
.loader{
    max-line-size: 100%;

}
.title-container{
    h1{
        color: white;
    }

  
}
.avatars{
    display: flex;
    gap: 2rem;
}
.avatar{
    border: 0.4rem solid transperent;
    padding: 0.4rem;
    border-radius: 5rem;
    display:flex;
    justify-content: center;
    align-items: center;
    transition: 0.5s ease-in-out;
    img{
        height: 6rem;
    }
}
.selected{
    border: 0.4rem solid #4e0eff;
}
.submit-btn{
    background-color: #997af0;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    transition: 0.5s ease-in-out;
    &:hover{
        background-color: #4e0eff;
    }
`;
