"use client";

import Link from "next/link";
import Image from "next/image";
import { ConnectedAddress } from "~~/components/ConnectedAddress";
import { CounterDisplay, IncreaseCounterButton, DecreaseCounterButton, SetCounterForm } from "~~/components/counter";
import { ResetCounterButton } from "~~/components/ResetCounterButton";
import { ApproveStrkButton } from "~~/components/ApproveStrkButton";
// import { CounterEventsList } from "~~/components/CounterEventsList";

const Home = () => {
  return (
    <div className="flex items-center flex-col grow pt-10">
      <CounterDisplay />
      <IncreaseCounterButton />
      <DecreaseCounterButton />
      <SetCounterForm />
      
      {/* Sección de reset con aprobación */}
      <div className="flex flex-col items-center gap-4 mt-6">
        <ApproveStrkButton />
        <ResetCounterButton />
      </div>
      
      {/* Lista de eventos del contador - DESHABILITADO */}
      {/* <div className="w-full max-w-4xl mt-8 px-4">
        <CounterEventsList />
      </div> */}
    </div>
  );
};

export default Home;
