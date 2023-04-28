import { Routes, Route } from "react-router-dom";
import CRSLogin from "../../Pages/CRSLogin/login";
import ReqForm from "../../Pages/Requestor/reqForm";
import ReqDash from "../../Pages/Requestor/dash";
import HodDash from "../../Pages/HOD/dash";
import SsuDash from "../../Pages/SSU/dash";
import ViewReqAction from "../../Pages/ReqView/view";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<CRSLogin />}></Route>
      <Route path="/login" element={<CRSLogin />}></Route>
      <Route path="/reqDash" element={<ReqDash />}></Route>
      <Route path="/hodDash" element={<HodDash />}></Route>
      <Route path="/ssuDash" element={<SsuDash />}></Route>
      <Route path="/reqview/:stage/:id" element={<ViewReqAction />}></Route>
      <Route path="/req/:action/:id" element={<ReqForm />}></Route>
    </Routes>
  );
}
export default AppRoutes;