import { Route, Routes } from "react-router-dom";
import { HomeView } from "../pages/HomeView.tsx";
import { About } from "../pages/About/About.tsx";

import { NotFoundView } from "../pages/NotFoundView.tsx";
import { SheetListView } from "../pages/SheetListView.tsx";
import { SheetRegisterView } from "../pages/SheetRegisterView.tsx";
import Login from "../pages/Login/Login.tsx";
import PrivateRoute from "../contexto/PrivateRoute.tsx";

export const MainRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<HomeView />} />
          <Route path="/sheet-list" element={<SheetListView />} />
          <Route path="/sheet/register" element={<SheetRegisterView />} />
          <Route path="/sheet/edit/:id" element={<SheetRegisterView />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFoundView />} />
        </Route>
      </Routes>
    </div>
  );
};
