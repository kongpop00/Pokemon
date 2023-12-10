import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "@/page/Home";
import Detail from "@/page/Detail";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/detail/:name",
      element: <Detail />,
    },
  ]);

  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
