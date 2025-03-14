'use client';

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

export type OperationType =
  | 'default'
  | 'create_round'
  | 'finish_round'
  | 'approve'
  | 'buy_ticket'
  | 'mint'
  | 'claim_prize';

export type TransactionStatusType = 'waiting_confirmation' | 'processing' | 'success' | 'error' | null;

export interface TransactionStatusProps {
  status: string | null;
  hash?: string;
  error?: Error | unknown;
  operation?: OperationType;
}

export const transactionStatusTimeout = 5000;

const waitingMessage = 'Waiting for confirmation';
const processingMessage = 'Your transaction is being processed on the blockchain.';

const operationMessages = {
  default: {
    waiting: waitingMessage,
    processing: processingMessage,
    success: 'Transaction successfully completed! Updating information...',
    error: 'An error occurred while completing the transaction. Please try again.'
  },
  create_round: {
    waiting: waitingMessage,
    processing: processingMessage,
    success: 'Round successfully created! Updating information...',
    error: 'An error occurred while creating the round. Please try again.'
  },
  finish_round: {
    waiting: waitingMessage,
    processing: processingMessage,
    success: 'Round successfully finished! Updating information...',
    error: 'An error occurred while finishing the round. Please try again.'
  },
  approve: {
    waiting: 'Waiting for approval confirmation',
    processing: 'Your token approval is being processed on the blockchain.',
    success: 'Tokens successfully approved! Now you can buy a ticket.',
    error: 'An error occurred while approving tokens. Please try again.'
  },
  buy_ticket: {
    waiting: 'Waiting for ticket purchase confirmation',
    processing: 'Your ticket purchase is being processed on the blockchain.',
    success: 'Ticket successfully purchased! You can view your tickets on the "My Tickets" tab.',
    error: 'An error occurred while purchasing a ticket. Please try again.'
  },
  mint: {
    waiting: 'Waiting for token minting confirmation',
    processing: 'Your token minting request is being processed on the blockchain.',
    success: 'Tokens successfully minted to your wallet!',
    error: 'An error occurred while minting tokens. Please try again.'
  },
  claim_prize: {
    waiting: 'Waiting for prize claim confirmation',
    processing: 'Your prize claim is being processed on the blockchain.',
    success: 'Prize successfully claimed to your wallet!',
    error: 'An error occurred while claiming the prize. Please try again.'
  }
};

export function TransactionStatus({ status, hash, error, operation = 'default' }: TransactionStatusProps) {
  if (!status) return null;

  const messages = operationMessages[operation];

  switch (status) {
    case 'waiting_confirmation':
      return (
        <Alert className="mb-4 bg-yellow-100 border-yellow-500">
          <AlertTitle className="text-yellow-800 flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {messages.waiting}
          </AlertTitle>
          <AlertDescription className="text-yellow-700">
            Please confirm the transaction in your wallet.
          </AlertDescription>
        </Alert>
      );
    case 'processing':
      return (
        <Alert className="mb-4 bg-blue-100 border-blue-500">
          <AlertTitle className="text-blue-800 flex items-center">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Transaction in progress
          </AlertTitle>
          <AlertDescription className="text-blue-700">
            {messages.processing}
            {hash && (
              <div className="mt-2">
                <a
                  href={`https://sepolia.basescan.org/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View in explorer
                </a>
              </div>
            )}
          </AlertDescription>
        </Alert>
      );
    case 'success':
      return (
        <Alert className="mb-4 bg-green-100 border-green-500">
          <AlertTitle className="text-green-800">Success!</AlertTitle>
          <AlertDescription className="text-green-700">
            {messages.success}
            {hash && (
              <div className="mt-2">
                <a
                  href={`https://sepolia.basescan.org/tx/${hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:underline"
                >
                  View in explorer
                </a>
              </div>
            )}
          </AlertDescription>
        </Alert>
      );
    case 'error':
      // Extract shortMessage from error if available
      let errorMessage = messages.error;

      const errorObj = error as { shortMessage?: string; message?: string };
      if (errorObj?.shortMessage) {
        errorMessage = errorObj.shortMessage;
      } else if (errorObj?.message) {
        errorMessage = errorObj.message;
      }

      return (
        <Alert className="mb-4 bg-red-100 border-red-500">
          <AlertTitle className="text-red-800">Error!</AlertTitle>
          <AlertDescription className="text-red-700">
            {errorMessage}
          </AlertDescription>
        </Alert>
      );
    default:
      return null;
  }
} 