import Sidebar from "./components/Sidebar";

function App() {
  return (
    <div className="flex w-full min-h-screen bg-black text-white font-embed">
      <Sidebar />
      <div className="flex-grow flex justify-center items-center">
        <h1 className="text-4xl">hi shadys :)</h1>
      </div>
    </div>
  );
}

export default App;