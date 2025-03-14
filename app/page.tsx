'use client';

import { ConnectButton } from './components/ConnectButton';
import { LotteryInfo } from './components/LotteryInfo';
import { BuyTicket } from './components/BuyTicket';
import { MintTokens } from './components/MintTokens';
import { UserTickets } from './components/UserTickets';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-muted shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Lottery DApp</h1>
          <ConnectButton />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-center">
          <Tabs defaultValue="info" className="w-full max-w-2xl">
            <TabsList className="grid grid-cols-4 w-full">
              <TabsTrigger value="info">Information</TabsTrigger>
              <TabsTrigger value="buy">Buy ticket</TabsTrigger>
              <TabsTrigger value="mint">Get USDT</TabsTrigger>
              <TabsTrigger value="tickets">My tickets</TabsTrigger>
            </TabsList>
            <TabsContent value="info">
              <LotteryInfo />
            </TabsContent>
            <TabsContent value="buy">
              <BuyTicket />
            </TabsContent>
            <TabsContent value="mint">
              <MintTokens />
            </TabsContent>
            <TabsContent value="tickets">
              <UserTickets />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="py-6 mt-12 footer">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <div className="mt-2 flex justify-center space-x-4">
            <a
              href={`https://sepolia.basescan.org/address/${process.env.NEXT_PUBLIC_LOTTERY_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-primary/80"
            >
              Lottery contract
            </a>
            <a
              href={`https://sepolia.basescan.org/address/${process.env.NEXT_PUBLIC_TOKEN_CONTRACT_ADDRESS}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted hover:text-primary/80"
            >
              Token contract
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
