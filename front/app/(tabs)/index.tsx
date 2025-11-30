import { MainPage } from "@/pages/MainPage/MainPage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";

export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <MainPage />
    </QueryClientProvider>
  );
}
