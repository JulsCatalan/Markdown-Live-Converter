
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import EditorPage from "./pages/EditorPage";
import SettingsPage from "./pages/SettingsPage";
import LegalPage from "./pages/LegalPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<EditorPage />} />
        <Route path="/editor" element={<Navigate to="/" replace />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/legal" element={<LegalPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}