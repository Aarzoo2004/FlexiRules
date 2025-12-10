// src/App.tsx
import React from "react";
import MainLayout from "./layout/MainLayout";
import RulesListPage from "./pages/RulesListPage";

const App: React.FC = () => {
  return (
    <MainLayout>
      <RulesListPage />
    </MainLayout>
  );
};

export default App;
