import { ChatInterface } from "./components/ChatInterface";

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-primary px-8 py-4 shadow-md">
        <h1 className="text-3xl font-bold mb-2">Bible Chat</h1>
        <p className="text-sm opacity-80">
          Your AI-powered Bible study companion
        </p>
      </header>

      <main className="flex-1 p-8 max-w-7xl w-full mx-auto flex items-start overflow-hidden">
        <ChatInterface />
      </main>
    </div>
  );
}

export default App;
