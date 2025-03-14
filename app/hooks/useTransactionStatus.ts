'use client';

import { useState, useEffect } from 'react';
import { TransactionStatusType, OperationType, transactionStatusTimeout } from '../components/ui/TransactionStatus';

interface UseTransactionStatusProps {
  isPending?: boolean;
  isLoading?: boolean;
  isSuccess?: boolean;
  error: Error | null;
  operation?: OperationType;
  onSuccess?: () => Promise<void>;
}

interface UseTransactionStatusResult {
  transactionStatus: TransactionStatusType;
  currentOperation: OperationType;
  isLoadingAfterTransaction: boolean;
}

/**
 * Hook to handle transaction status updates for blockchain operations
 * @param props Configuration object for the transaction status
 * @returns Current transaction status state and operation
 */
export function useTransactionStatus({
  isPending = false,
  isLoading = false,
  isSuccess = false,
  error,
  operation = 'default',
  onSuccess
}: UseTransactionStatusProps): UseTransactionStatusResult {
  const [transactionStatus, setTransactionStatus] = useState<TransactionStatusType>(null);
  const [currentOperation, setCurrentOperation] = useState<OperationType>(operation);
  const [isLoadingAfterTransaction, setIsLoadingAfterTransaction] = useState(false);

  // Update transaction status based on current state
  useEffect(() => {
    if (isPending) {
      setTransactionStatus('waiting_confirmation');
      setCurrentOperation(operation);
    } else if (isLoading) {
      setTransactionStatus('processing');
      setCurrentOperation(operation);
    } else if (isSuccess) {
      setTransactionStatus('success');
      setCurrentOperation(operation);

      // If there's a success callback, execute it and set loading state
      if (onSuccess) {
        setIsLoadingAfterTransaction(true);
        onSuccess().then(() => {
          setIsLoadingAfterTransaction(false);
        });
      }

      // Clear status after timeout
      const timer = setTimeout(() => {
        setTransactionStatus(null);
        setCurrentOperation('default');
      }, transactionStatusTimeout);
      return () => clearTimeout(timer);
    } else if (error) {
      setTransactionStatus('error');
      setCurrentOperation(operation);

      // Clear error status after timeout
      const timer = setTimeout(() => {
        setTransactionStatus(null);
        setCurrentOperation('default');
      }, transactionStatusTimeout);
      return () => clearTimeout(timer);
    }
  }, [isPending, isLoading, isSuccess, error, operation, onSuccess]);

  return {
    transactionStatus,
    currentOperation,
    isLoadingAfterTransaction
  };
} 