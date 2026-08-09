import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router"
import { AppLayout } from "@/components/layout/AppLayout"

const HomePage = lazy(() => import("@/pages/HomePage"))
const PredictorPage = lazy(() => import("@/pages/PredictorPage"))
const ModelPerformancePage = lazy(() => import("@/pages/ModelPerformancePage"))
const AboutPage = lazy(() => import("@/pages/AboutPage"))

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<Suspense><HomePage /></Suspense>} />
        <Route path="predictor" element={<Suspense><PredictorPage /></Suspense>} />
        <Route path="model-performance" element={<Suspense><ModelPerformancePage /></Suspense>} />
        <Route path="about" element={<Suspense><AboutPage /></Suspense>} />
      </Route>
    </Routes>
  )
}

export default App
