import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark";
import { useAccount } from "@starknet-react/core";

export function ResetCounterButton() {
  const [isConfirming, setIsConfirming] = useState(false);
  const { address } = useAccount();

  const { sendAsync: resetCounterAsync, isPending } = useScaffoldWriteContract({
    contractName: "CounterContract",
    functionName: "reset_counter",
    args: [], // reset_counter no requiere argumentos
  });

  const handleResetCounter = async () => {
    if (!address) {
      alert("Por favor conecta tu alcancía digital primero");
      return;
    }

    if (isConfirming) {
      // Segunda confirmación - ejecutar reset
      try {
        await resetCounterAsync();
        setIsConfirming(false);
      } catch (error) {
        console.error("Error al resetear contador:", error);
        alert("Error al resetear contador. Verifica que tengas suficiente STRK y allowance aprobado.");
        setIsConfirming(false);
      }
    } else {
      // Primera confirmación
      setIsConfirming(true);
      // Auto-cancelar después de 5 segundos (más tiempo para leer el mensaje)
      setTimeout(() => {
        setIsConfirming(false);
      }, 5000);
    }
  };

  const handleCancel = () => {
    setIsConfirming(false);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {!isConfirming ? (
        <button
          className={`btn ${
            isPending ? "btn-disabled" : "btn-warning"
          } btn-lg`}
          onClick={handleResetCounter}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Reseteando...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Resetear Contador (1 STRK)
            </>
          )}
        </button>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <div className="alert alert-warning max-w-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <div>
              <h3 className="font-bold">¿Confirmar Reset?</h3>
              <div className="text-xs">
                Esta acción reseteará el contador a 0 y requiere un pago de <strong>1 STRK</strong>.
                <br />
                Asegúrate de tener suficiente balance y allowance aprobado.
                <br />
                <span className="text-error">No se puede deshacer.</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              className="btn btn-error btn-sm"
              onClick={handleResetCounter}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Reseteando...
                </>
              ) : (
                "Sí, Resetear"
              )}
            </button>
            
            <button
              className="btn btn-outline btn-sm"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}