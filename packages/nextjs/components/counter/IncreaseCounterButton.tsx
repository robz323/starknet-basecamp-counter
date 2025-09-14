"use client";

import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark";

export const IncreaseCounterButton = () => {
  const { sendAsync: increaseCounterAsync, isPending } = useScaffoldWriteContract({
    contractName: "CounterContract",
    functionName: "increase_counter",
  });

  const handleIncreaseCounter = async () => {
    try {
      await increaseCounterAsync();
    } catch (error) {
      console.error("Error increasing counter:", error);
    }
  };

  const isDisabled = isPending;

  return (
    <div className="card bg-base-100 shadow-xl w-96 mt-4">
      <div className="card-body text-center">
        <h3 className="card-title justify-center text-xl font-bold text-base-content">
          Incrementar Contador
        </h3>
        <button
          className={`btn btn-lg ${isDisabled ? 'btn-disabled' : 'btn-primary'}`}
          onClick={handleIncreaseCounter}
          disabled={isDisabled}
        >
          {isPending ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Procesando...
            </>
          ) : (
            <>
              <span className="text-xl">+</span>
              Incrementar
            </>
          )}
        </button>
        <div className="text-xs text-base-content/70 mt-2">
          Cualquier usuario puede incrementar el contador
        </div>
      </div>
    </div>
  );
};
