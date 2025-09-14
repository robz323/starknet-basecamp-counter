"use client";

import { useState } from "react";
import { useScaffoldWriteContract, useIsOwner } from "~~/hooks/scaffold-stark";

export const SetCounterForm = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [isValid, setIsValid] = useState<boolean>(true);

  const { sendAsync: setCounterAsync, isPending } = useScaffoldWriteContract({
    contractName: "CounterContract",
    functionName: "set_counter",
    args: [inputValue ? BigInt(inputValue) : undefined],
  });

  const { isOwner, isLoading: isOwnerLoading } = useIsOwner();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    
    // Validar que sea un número entero no negativo
    const numValue = parseInt(value);
    setIsValid(value === "" || (!isNaN(numValue) && numValue >= 0 && Number.isInteger(numValue)));
  };

  const handleSetCounter = async () => {
    if (!isValid || !inputValue) return;
    
    try {
      await setCounterAsync();
      setInputValue(""); // Limpiar el input después de éxito
    } catch (error) {
      console.error("Error setting counter:", error);
    }
  };

  const isDisabled = isPending || !isValid || !inputValue || !isOwner;

  return (
    <div className="card bg-base-100 shadow-xl w-96 mt-4">
      <div className="card-body text-center">
        <h3 className="card-title justify-center text-xl font-bold text-base-content">
          Establecer Contador
        </h3>
        
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Nuevo valor del contador</span>
          </label>
          <input
            type="number"
            placeholder="Ingresa un número"
            className={`input input-bordered w-full ${!isValid ? 'input-error' : ''}`}
            value={inputValue}
            onChange={handleInputChange}
            min="0"
            step="1"
            disabled={!isOwner}
          />
          {!isValid && (
            <label className="label">
              <span className="label-text-alt text-error">
                Ingresa un número entero no negativo
              </span>
            </label>
          )}
        </div>

        <button
          className={`btn btn-lg w-full ${isDisabled ? 'btn-disabled' : 'btn-warning'}`}
          onClick={handleSetCounter}
          disabled={isDisabled}
        >
          {isPending ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Estableciendo...
            </>
          ) : (
            <>
              <span className="text-xl">⚙️</span>
              Establecer Valor
            </>
          )}
        </button>
        
        {!isOwner && !isOwnerLoading && (
          <div className="text-sm text-warning mt-2">
            Solo el propietario puede establecer el valor del contador
          </div>
        )}
        
        <div className="text-xs text-base-content/70 mt-2">
          Establece el contador a cualquier valor específico
        </div>
      </div>
    </div>
  );
};
