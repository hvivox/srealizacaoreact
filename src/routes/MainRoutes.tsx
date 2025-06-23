import { Route, Routes } from "react-router";
import { HomeView } from "../pages/HomeView.tsx";
import { About } from "../pages/About/About.tsx";

import { NotFoundView } from "../pages/NotFoundView.tsx";
import { SheetListView } from "../pages/SheetListView.tsx";
import { SheetRegisterView } from "../pages/SheetRegisterView.tsx";
import Layout from "../components/LayoutForm/Layout.tsx";
export const MainRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />} >
          <Route path="/" index element={<HomeView />} />
          <Route path="/sheet-list" element={<SheetListView />} />
          
          <Route path="/sheet" element={<SheetRegisterView />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<NotFoundView />} />
        </Route>
      </Routes>
    </div>
  );
};
