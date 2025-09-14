"use client";

import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-stark";

export const DecreaseCounterButton = () => {
  const { data: counterValue } = useScaffoldReadContract({
    contractName: "CounterContract",
    functionName: "get_counter",
  });

  const { sendAsync: decreaseCounterAsync, isPending } = useScaffoldWriteContract({
    contractName: "CounterContract",
    functionName: "decrease_counter",
  });

  const handleDecreaseCounter = async () => {
    try {
      await decreaseCounterAsync();
    } catch (error) {
      console.error("Error decreasing counter:", error);
    }
  };

  const isDisabled = isPending;

  return (
    <div className="card bg-base-100 shadow-xl w-96 mt-4">
      <div className="card-body text-center">
        <h3 className="card-title justify-center text-xl font-bold text-base-content">
          Decrementar Contador
        </h3>
        <button
          className={`btn btn-lg ${isDisabled ? 'btn-disabled' : 'btn-secondary'}`}
          onClick={handleDecreaseCounter}
          disabled={isDisabled}
        >
          {isPending ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Procesando...
            </>
          ) : (
            <>
              <span className="text-xl">-</span>
              Decrementar
            </>
          )}
        </button>
        <div className="text-xs text-base-content/70 mt-2">
          Cualquier usuario puede decrementar el contador
        </div>
      </div>
    </div>
  );
};
