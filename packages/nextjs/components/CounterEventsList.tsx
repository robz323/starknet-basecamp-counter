import { useScaffoldEventHistory } from "~~/hooks/scaffold-stark";
import { Address } from "~~/components/scaffold-stark";

interface CounterChangedParsedArgs {
  caller: string;
  old_value: number;
  new_value: number;
  reason: {
    variant: Record<string, {}>;
  };
}

interface EventData {
  args: CounterChangedParsedArgs;
  parsedArgs: CounterChangedParsedArgs | null;
  log: {
    block_hash: string;
    transaction_hash: string;
    event_index: number;
  };
}

export function CounterEventsList() {
  const {
    data: events,
    isLoading,
    error,
  } = useScaffoldEventHistory({
    contractName: "CounterContract",
    eventName: "CounterChanged",
    fromBlock: 0n,
    watch: true,
    format: true,
    blockData: false,
    transactionData: false,
    receiptData: false,
  });

  // Función helper para validar y limpiar direcciones de Starknet
  const validateStarknetAddress = (address: any): string => {
    if (!address) return '0x0';
    
    let cleanAddress = typeof address === 'string' ? address : String(address);
    cleanAddress = cleanAddress.trim().toLowerCase();
    
    // Asegurar que empiece con 0x
    if (!cleanAddress.startsWith('0x')) {
      cleanAddress = '0x' + cleanAddress;
    }
    
    // Remover el 0x para trabajar solo con los caracteres hex
    let hexPart = cleanAddress.slice(2);
    
    // Remover cualquier carácter que no sea hex
    hexPart = hexPart.replace(/[^0-9a-f]/g, '');
    
    // Starknet addresses deben tener exactamente 64 caracteres hex
    if (hexPart.length === 0) {
      // Si no hay caracteres hex válidos, usar dirección por defecto
      return '0x0000000000000000000000000000000000000000000000000000000000000000';
    } else if (hexPart.length < 64) {
      // Rellenar con ceros al inicio hasta 64 caracteres
      const padding = '0'.repeat(64 - hexPart.length);
      hexPart = padding + hexPart;
    } else if (hexPart.length > 64) {
      // Truncar a 64 caracteres desde el final
      hexPart = hexPart.slice(-64);
    }
    
    return '0x' + hexPart;
  };

  const getReasonText = (reason: { variant: Record<string, {}> }) => {
    const reasonKey = Object.keys(reason.variant)[0];
    switch (reasonKey) {
      case "Increase":
        return "Incremento";
      case "Decrease":
        return "Decremento";
      case "Reset":
        return "Reinicio";
      case "Set":
        return "Establecido";
      default:
        return reasonKey || "Desconocido";
    }
  };

  const getReasonColor = (reason: { variant: Record<string, {}> }) => {
    const reasonKey = Object.keys(reason.variant)[0];
    switch (reasonKey) {
      case "Increase":
        return "badge-success";
      case "Decrease":
        return "badge-error";
      case "Reset":
        return "badge-warning";
      case "Set":
        return "badge-info";
      default:
        return "badge-neutral";
    }
  };

  if (isLoading) {
    return (
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Eventos del Contador</h2>
          <div className="flex justify-center items-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
            <span className="ml-4">Cargando eventos...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Eventos del Contador</h2>
          <div className="alert alert-error">
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
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>Error al cargar eventos: {error}</span>
          </div>
        </div>
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="card w-full bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Eventos del Contador</h2>
          <div className="text-center py-8">
            <div className="text-base-content/60">
              <svg
                className="mx-auto h-12 w-12 mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p>No se han encontrado eventos aún</p>
              <p className="text-sm mt-2">
                Los eventos aparecerán aquí cuando se modifique el contador
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card w-full bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title">Eventos del Contador</h2>
          <div className="badge badge-primary">
            {events.length} evento{events.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="space-y-4 max-h-96 overflow-y-auto">
          {events.map((event: EventData, index: number) => {
            const { args, log } = event;
            
            // Validar dirección usando la función helper
            console.log('Original caller:', args.caller, 'Type:', typeof args.caller);
            const callerAddress = validateStarknetAddress(args.caller);
            console.log('Validated address:', callerAddress, 'Length:', callerAddress.length);
            
            return (
              <div
                key={`${log.transaction_hash}-${log.event_index}`}
                className="border border-base-300 rounded-lg p-4 hover:bg-base-200 transition-colors"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-base-content/70">
                      #{events.length - index}
                    </span>
                    <div
                      className={`badge ${getReasonColor(args.reason)} badge-sm`}
                    >
                      {getReasonText(args.reason)}
                    </div>
                  </div>
                  <div className="text-xs text-base-content/50">
                    Bloque: {log.block_hash?.slice(0, 8) || 'N/A'}...
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm font-medium text-base-content/70 mb-1">
                      Dirección del llamador:
                    </div>
                    {callerAddress.length === 66 ? (
                      <Address
                        address={callerAddress as `0x${string}`}
                        format="short"
                        size="sm"
                      />
                    ) : (
                      <div className="text-sm font-mono text-base-content/60">
                        {callerAddress.slice(0, 10)}...{callerAddress.slice(-8)}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="text-sm font-medium text-base-content/70 mb-1">
                      Cambio de valor:
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-mono">
                        {args.old_value}
                      </span>
                      <svg
                        className="w-4 h-4 text-base-content/50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                      <span className="text-lg font-mono font-bold">
                        {args.new_value}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-base-300">
                  <div className="flex justify-between items-center text-xs text-base-content/50">
                    <span>
                      TX: {log.transaction_hash?.slice(0, 8) || 'N/A'}...
                      {log.transaction_hash?.slice(-8) || 'N/A'}
                    </span>
                    <span>Índice: {log.event_index}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}