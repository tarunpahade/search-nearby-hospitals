"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import axios from "axios";
import { sendMail } from "@/helpers/mailer";
export default function LoginPage() {
  const router = useRouter();
  const [user, setuser] = useState({
    password: "",
    username: "",
    email: ''
  });

  const [forgetPassword, setForgetPassword] = useState(false);
  const [buttonDisabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setisSuccess] = useState(false)
  const [error, seterror] = useState(false)
  useEffect(() => {
    return () => {
      if (user.email.length > 0 && user.password.length > 0) {
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
    


    } catch (error) {
      console.log("Login Failed", error);

      console.log('Invalid Password');
      seterror(true)


    } finally {
      setLoading(false);
    }
  };


  const sendEmail = async () => {
    try {
      console.log('Send email');
      const res = await axios.post('/api/users/forgotpassword', { email: user.email })
      console.log(res);

      if (res.data.message === 'Mail sent to Your email') {
        setisSuccess(true)
      } else if (res.data.error === 'User not found') {
        alert('User not found')
      }
    } catch (error: any) {
      console.log(error.response.data);
    }
  }
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}

    >

      {forgetPassword ? (
        //class to flex-direction:column
        <div className="col-auto block" style={{ flexDirection: 'column', marginTop: 12 }}>
          <label htmlFor="" className="block text-sm font-medium leading-6 ">Enter Email</label>
          <input
            type="email"
            className="mt-5 mb-5 block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Enter your email"
            value={user.email}
            onChange={(e) => setuser({ ...user, email: e.target.value })}
            required
          />
          <button onClick={sendEmail} style={{
            padding: 10,
            borderWidth: 1,
            paddingRight: 15,
            paddingLeft: 15,
            margin: 5,
            borderRadius: 12,
            alignContent: "center",
          }}>Send Mail</button>

          {isSuccess === true ? <label className="block text-sm font-medium leading-6 ">Mail sent to your email</label> : null}
        </div>

      ) : (
        <form style={{ width: "200px" }} className="text-center">
          <h1 className="text-center">{loading ? "Loading..." : "Login"}</h1>
          <div>
            <label style={{ padding: 10, paddingBottom: 15 }}>Email:</label>
            <input
              type="text"
              className="text-black"
              value={user.email}
              onChange={(e) => setuser({ ...user, email: e.target.value })}
              required
            />
          </div>
          <label style={{ padding: 10, paddingBottom: 15 }}>Password:</label>
          <div>
            <input
              type="password"
              className="text-black"
              value={user.password}
              onChange={(e) => setuser({ ...user, password: e.target.value })}
              required
            />
          </div>
          <div style={{ flexDirection: 'column', marginTop: 12 }}>
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
          </div>
          <button onClick={() => setForgetPassword(true)}>Forgot Password</button>
          {error && <p className="border border-red-500 p-2 mt-4">Invalid password try again</p>}
        </form>
      )}
    </div>
  );
}
