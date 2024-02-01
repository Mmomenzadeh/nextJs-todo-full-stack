import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

import axios from "axios";

function Index() {
  const router = useRouter();

  useEffect(() => {
    const getUserInfo = async () => {
      axios
        .get("/api/auth/me")
        .then((res) => {
          router.push("/");
        })
        .catch((err) => console.log(err.message));
    };

    getUserInfo();
  }, []);


  const [userData, setUserData] = useState({
    identifier: "",
    password: "",
  });

  const userSignInHandler = (event) => {
    event.preventDefault();
    axios
      .post("/api/auth/signin", userData)
      .then((res) => {
        if (res.status === 200) {
          setUserData({ identifier: "", password: "" });
          alert("user successfully login ...");
          router.replace("/");
        } else if (res.status === 422) {
          alert("");
        }
      })
      .catch((err) => {
        alert(err.message);
        console.log(err);
      });
  };

  return (
    <div className="box">
      <h1 align="center">Login Form</h1>
      <form role="form" method="post">
        <div className="inputBox">
          <input
            type="text"
            autoComplete="off"
            required
            value={userData.identifier}
            onChange={(e) =>
              setUserData({ ...userData, identifier: e.target.value })
            }
          />
          <label>Username | Email</label>
        </div>
        <div className="inputBox">
          <input
            type="password"
            autoComplete="off"
            required
            value={userData.password}
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
          />
          <label>Password</label>
        </div>

        <input
          type="submit"
          className="register-btn"
          value="Sign In"
          onClick={userSignInHandler}
        />
      </form>
      {/* <h5 className="center ">You do not have an account ?</h5> */}
    </div>
  );
}

export default Index;



export async function getServerSideProps(context){
  
}