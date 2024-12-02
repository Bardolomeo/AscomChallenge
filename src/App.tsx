
import PatientGrid from "./components/PatientGrid";

function App() {

  return (
    <>
      <div className="w-full h-full bg-[#FBFAFA]">
        <div className="pt-12 pl-8">
          <h1 className="text-[#ec272f] font-semibold text-4xl pb-6">Patients Table</h1>
          <PatientGrid></PatientGrid>
        </div>
      </div>
    </>
  )
}

export default App
