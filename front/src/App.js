import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { MyProSidebarProvider } from "./pages/global/sidebar/sidebarContext";
import Topbar from "./pages/global/Topbar";

import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Dashboard from "./pages/dashboard";
import Stock from "./pages/stock";
import Facture from "./pages/facture";
import BonDeLivraison from "./pages/bon";
import Devis from "./pages/devis";
import Fournisseur from "./pages/fournisseur";
import Client from "./pages/client";
import Settings from "./pages/settings";

const App = () => {
  const [theme, colorMode] = useMode();
  const location = useLocation();

  const shouldShowSidebarAndTopbar = !["/"].includes(location.pathname);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {shouldShowSidebarAndTopbar ? (
          <MyProSidebarProvider>
            <div style={{ height: "100%", width: "100%" }}>
              <main>
                <Topbar />
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/stock" element={<Stock />} />
                  <Route path="/facture" element={<Facture />} />
                  <Route path="/bon" element={<BonDeLivraison />} />
                  <Route path="/fournisseur" element={<Fournisseur />} />
                  <Route path="/client" element={<Client />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/devis" element={<Devis />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </main>
            </div>
          </MyProSidebarProvider>
        ) : (
          <div style={{ height: "100%", width: "100%" }}>
            <main>
              {shouldShowSidebarAndTopbar && <Topbar />}
              <Routes>
                <Route path="/" element={<Login />} />
              </Routes>
            </main>
          </div>
        )}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default App;
