import React from 'react';
import { useAuth } from '../lib/useAuth';
import { NextPage } from 'next/types';
import Link from 'next/link';

const Login: NextPage = () => {
  const auth = useAuth();
  const email = React.useRef<HTMLInputElement>(null);
  const password = React.useRef<HTMLInputElement>(null);
  const [wrongEmail, setWrongEmail] = React.useState<boolean>(false);
  const [emptyPassword, setEmptyPassword] = React.useState<boolean>(false);
  const [success, setSuccess] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (auth.isAuthenticated) {
      setSuccess(true);
    }
  }, [auth.isAuthenticated]);

  function onClick(): void {
    let failFlag: boolean = false;

    const inputEmail = email.current?.value || '';
    const inputPassword = password.current?.value || '';

    if (!inputPassword) {
      setEmptyPassword(true);
      failFlag = true;
    }
    else if (!auth.login(inputEmail, inputPassword)) {
      setWrongEmail(true);
      if (failFlag) return;
    }
    else {
      setSuccess(true);
    }
  }

  function logOut(): void {
    auth.logout();
    setSuccess(false);
  }

  return (
    <div className="h-screen flex justify-center items-center bg-green-700 text-black">
      {success ?
        (
          <div className="bg-teal-100 border-t-4 border-teal-500 rounded-b text-teal-900 px-4 py-3 shadow-md bg-white"
            role="alert">
            <div className="flex">
              <div className="py-1">
                <svg className="fill-current h-6 w-6 text-teal-500 mr-4" xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20">
                  <path
                    d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z" />
                </svg>
              </div>
              <div>
                <p className="font-bold">You are already logged in</p>
                <p className="text-sm">You can now access <Link href="/forecast"><a className="text-blue-300 hover:text-blue-500">forecast page</a></Link></p>
                <p className="text-sm">or go staight <Link href="/"><a className="text-blue-300 hover:text-blue-500">back home</a></Link></p>
                <button onClick={logOut}
                  className="rounded-full bg-red-900 text-white w-56 my-7 py-4 font-bold">
                  Log out
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form className="h-80 bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 flex flex-col">
            <div className="mb-4">
              <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="username">
                Email
              </label>
              <input className={`shadow appearance-none border ${wrongEmail ?
                'border-red-500' :
                ''} rounded w-full py-2 px-3 text-grey-darker mb-3`} id="username" type="email"
                placeholder="username@example.com" ref={email} onFocus={() => setWrongEmail(false)} />
              {wrongEmail && <p className="text-red-500 text-xs italic">Wrong email</p>}
            </div>
            <div className="mb-6">
              <label className="block text-grey-darker text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input className={`shadow appearance-none border ${emptyPassword ?
                'border-red-500' :
                ''} rounded w-full py-2 px-3 text-grey-darker mb-3`} id="password" type="password"
                placeholder="******************" ref={password} onFocus={() => setEmptyPassword(false)} />
              {emptyPassword && <p className="text-red-500 text-xs italic">Empty password</p>}
            </div>
            <div className="flex items-center justify-center">
              <button className="bg-blue-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                type="button" onClick={onClick}>
                Sign In
              </button>
            </div>
          </form>
        )
      }
    </div>
  );
}

export default Login;
