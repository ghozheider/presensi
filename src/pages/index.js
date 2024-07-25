import Image from "next/image";
import { Inter } from "next/font/google";
import Login from "./admin/login";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div className="">
      <Login />
    </div>
  );
}
