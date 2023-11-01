import { Route, Routes } from "react-router-dom";
import { HomeView } from "../pages/HomeView.tsx";
import { About } from "../pages/About/About.tsx";
import { ExemplosComponent } from "../pages/ExemplesComponentView.tsx";
import { NotFoundView } from "../pages/NotFoundView.tsx";
import { ListaFolhaView } from "../pages/ListaFolhaView.tsx";

export const MainRoutes = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<HomeView />} />
        <Route path="/lista-folha" element={<ListaFolhaView />} />
        <Route path="/about" element={<About />} />
        <Route path="/exemple" element={<ExemplosComponent />} />
        <Route path="*" element={<NotFoundView />} />
      </Routes>
    </div>
  );
};
