import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router";
import './index.css'
import App from './App.jsx'
import { QueryClient, QueryClientProvider} from '@tanstack/react-query'
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster} from "@/components/ui/toast";
const queryClient= new QueryClient({
  defaultOptions:{
    queries:{
      staletime: 60*1000
    }
  }
})
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster position={"top-center"} />
       <App />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
 
  </StrictMode>,
)
