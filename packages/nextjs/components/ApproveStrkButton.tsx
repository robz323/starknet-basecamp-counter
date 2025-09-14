import { useState } from "react";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-stark";
import { useAccount } from "@starknet-react/core";
import { useDeployedContractInfo } from "~~/hooks/scaffold-stark";

export function ApproveStrkButton() {
  const [isApproving, setIsApproving] = useState(false);
  const { address } = useAccount();
  
  const { data: strkContract } = useDeployedContractInfo("Strk");
  const { data: counterContract } = useDeployedContractInfo("CounterContract");

  const { sendAsync: approveStrkAsync, isPending } = useScaffoldWriteContract({
    contractName: "Strk",
    functionName: "approve",
    args: [
      counterContract?.address, // spender (el contrato CounterContract)
      BigInt("1000000000000000000") // amount (1 STRK en wei)
    ],
  });

  const handleApproveStrk = async () => {
    if (!address) {
      alert("Por favor conecta tu alcancía digital primero");
      return;
    }

    if (!strkContract || !counterContract) {
      alert("Error: No se pudieron cargar los contratos");
      return;
    }

    try {
      setIsApproving(true);
      await approveStrkAsync();
      alert("✅ Allowance aprobado exitosamente! Ahora puedes resetear el contador.");
    } catch (error) {
      console.error("Error al aprobar STRK:", error);
      alert("❌ Error al aprobar allowance. Verifica que tengas suficiente STRK.");
    } finally {
      setIsApproving(false);
    }
  };

  if (!address) {
    return null;
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        className={`btn ${
          isPending || isApproving ? "btn-disabled" : "btn-info"
        } btn-sm`}
        onClick={handleApproveStrk}
        disabled={isPending || isApproving}
      >
        {isPending || isApproving ? (
          <>
            <span className="loading loading-spinner loading-xs"></span>
            Aprobando...
          </>
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Aprobar STRK (1 STRK)
          </>
        )}
      </button>
      
      <div className="text-xs text-center text-base-content/60 max-w-xs">
        Necesario para resetear el contador. 
        <br />
        Aprobará 1 STRK para el contrato.
      </div>
    </div>
  );
}
