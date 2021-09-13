import type { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';

const Home: NextPage = () => {
  return (
    <div className="flex h-screen bg-green-700">
      <div className="m-auto text-center">
        <h1 className="text-xl font-bold text-white"> Welcome to weather forecast!</h1>
        <Link href="/login">
          <button id="loginBtn" className="rounded-full bg-red-900 text-white w-56 my-7 py-4 font-bold">
            Login
          </button>
        </Link>

      </div>
    </div>
  )
}

export default Home;
