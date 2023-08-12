"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
export default function LoginPage() {
  const router = useRouter();
  const [user, setuser] = useState({
    password: "",
    username: "",
  });
  const [buttonDisabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    return () => {
      if (user.username.length > 0 && user.password.length > 0) {
        setDisabled(false);
      } else {
        setDisabled(true);
      }
    };
  }, [user]);
  const onLogin = async (e: any) => {
    console.log("hello");

    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post("api/users/login", user);
      console.log(res);
      router.push("/profile");
      if (res.data.error === "User Not Found") {
        alert("User Not Found PLEASE SIGNUP");
      }
    } catch (error) {
      console.log("Login Failed", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <form style={{ width: "200px" }}>
        <h1>{loading ? "Loading..." : "Login"}</h1>
        <div>
          <label style={{ padding: 10 }}>Username:</label>
          <input
            type="text"
            className="text-black"
            value={user.username}
            onChange={(e) => setuser({ ...user, username: e.target.value })}
            required
          />
        </div>
        <label style={{ padding: 10 }}>Password:</label>
        <div>
          <input
            type="password"
            className="text-black"
            value={user.password}
            onChange={(e) => setuser({ ...user, password: e.target.value })}
            required
          />
        </div>
        <button
          onClick={onLogin}
          type="submit"
          style={{
            padding: 10,
            borderWidth: 1,
            paddingRight: 15,
            paddingLeft: 15,
            margin: 5,
            borderRadius: 12,
            alignContent: "center",
          }}
        >
          {buttonDisabled ? "No login" : "Login"}
        </button>
        <Link href="/signup">Visit Signup</Link>
      </form>
    </div>
  );
}
