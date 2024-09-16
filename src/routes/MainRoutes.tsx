import { Route, Routes } from "react-router-dom";
import { HomeView } from "../pages/HomeView.tsx";
import { About } from "../pages/About/About.tsx";

import { NotFoundView } from "../pages/NotFoundView.tsx";
import { SheetListView } from "../pages/SheetListView.tsx";
import { SheetRegisterView } from "../pages/SheetRegisterView.tsx";

export const MainRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/sheet-list" element={<SheetListView />} />
        <Route path="/edit/:id" element={<SheetRegisterView />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFoundView />} />
      </Routes>
    </div>
  );
};
