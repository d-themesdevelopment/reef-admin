import { useState } from "react";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Loading from "../common/Loading";
import { Button } from "antd";
import { userStore } from "../../store/UserStore";

const LoginButton = ({ isLoggedIn }) => {
  const [loading, setLoading] = useState(false);

  const handleLogout = (e) => {
    e.preventDefault();
    setLoading(true);

    Cookies.remove("reef_token");
    userStore.set("");

    toast.error("🤔 Logout!", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

    setTimeout(() => {
      setLoading(false);
      location.href = "/signin";
    }, 1500);
  };

  return (
    <>
      {loading && <Loading />}

      {isLoggedIn && (
        <Button
        type="primary"
          onClick={(e) => handleLogout(e)}
          className="btn-profile ml-4"
        >
          Sign Out
        </Button>
      )}
    </>
  );
};

export default LoginButton;
