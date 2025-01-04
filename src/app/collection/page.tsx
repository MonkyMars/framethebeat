"use client"
import { NextPage } from "next";
import dynamic from "next/dynamic";

const page: NextPage = dynamic(() => import("./collectionPage"), { ssr: false });

export default page;