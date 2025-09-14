"use client";

import { useScaffoldReadContract } from "~~/hooks/scaffold-stark";
import { useAccount } from "@starknet-react/core";

export const useIsOwner = () => {
  const { address: connectedAddress } = useAccount();
  
  const { data: ownerAddress } = useScaffoldReadContract({
    contractName: "CounterContract",
    functionName: "owner",
  });

  // Función para normalizar direcciones
  const normalizeAddress = (addr: string) => {
    return addr.toLowerCase().replace(/^0x/, '');
  };

  // Función para convertir bigint a dirección hexadecimal
  const bigintToHexAddress = (bigintValue: bigint) => {
    return '0x' + bigintValue.toString(16).padStart(64, '0');
  };

  // El ownerAddress viene como bigint, necesitamos convertirlo a dirección hex
  const ownerAddressHex = ownerAddress ? bigintToHexAddress(ownerAddress) : '';
  
  const normalizedConnected = connectedAddress ? normalizeAddress(connectedAddress) : '';
  const normalizedOwner = ownerAddressHex ? normalizeAddress(ownerAddressHex) : '';
  
  const isOwner = connectedAddress && ownerAddressHex && 
    normalizedConnected === normalizedOwner;

  // Debug logs
  console.log('🔍 Debug useIsOwner:');
  console.log('Connected Address:', connectedAddress);
  console.log('Owner Address Raw (bigint):', ownerAddress);
  console.log('Owner Address Hex:', ownerAddressHex);
  console.log('Normalized Connected:', normalizedConnected);
  console.log('Normalized Owner:', normalizedOwner);
  console.log('Is Owner:', isOwner);

  return {
    isOwner: !!isOwner,
    ownerAddress: ownerAddressHex,
    connectedAddress,
    isLoading: !ownerAddress,
  };
};
