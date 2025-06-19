import { PaperProvider } from "react-native-paper";
import MainRoutes from "./routes/routes";

export default function App() {
  return (
    <PaperProvider>
      <MainRoutes />
    </PaperProvider>
  )
}