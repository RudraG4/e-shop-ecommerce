import { Outlet } from "react-router";
import { Header, Footer } from "components";

export default function BaseLayout() {
  return (
    <>
      <Header />
      <main className="container-fluid p-0 flex-grow-1 mx-auto min-vh-100">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
