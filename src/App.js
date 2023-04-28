import { BrowserRouter } from "react-router-dom";
import "./App.css";
import PageContent from "./Components/PageContent";
import CRSHeader from "./Components/Header/crsheader";
import CRSFooter from "./Components/Footer/crsfooter";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <CRSHeader />
        <PageContent />
        <CRSFooter />
      </BrowserRouter>
    </div>
  );
}

export default App;
