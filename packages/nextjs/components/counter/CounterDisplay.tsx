"use client";

import { useScaffoldReadContract } from "~~/hooks/scaffold-stark";

export const CounterDisplay = () => {
  const { data: counterValue, isLoading, error } = useScaffoldReadContract({
    contractName: "CounterContract",
    functionName: "get_counter",
  });

  if (isLoading) {
    return (
      <div className="card bg-base-100 shadow-xl w-96">
        <div className="card-body text-center">
          <span className="loading loading-spinner loading-lg"></span>
          <p>Cargando contador...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card bg-base-100 shadow-xl w-96">
        <div className="card-body text-center">
          <div className="alert alert-error">
            <span>Error al cargar el contador: {error.message}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl w-96">
      <div className="card-body text-center">
        <h2 className="card-title justify-center text-2xl font-bold text-base-content">
          Valor del Contador
        </h2>
        <div className="text-6xl font-bold text-accent bg-base-200 rounded-lg p-4 my-4">
          {counterValue?.toString() || "0"}
        </div>
        <div className="card-actions justify-center">
          <div className="badge badge-accent badge-lg">
            Valor actual
          </div>
        </div>
      </div>
    </div>
  );
};
