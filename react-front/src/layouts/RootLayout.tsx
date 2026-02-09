import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import Footer from "../components/partials/Footer/Footer";
import Header from "../components/partials/Header/Header";

export default function RootLayout() {
	return (
		<div className="flex min-h-screen flex-col">
			<Header />
			Root Layout
			<div className="flex-1">
				<Outlet />
				<TanStackRouterDevtools position="bottom-right" />
			</div>
			<Footer />
		</div>
	);
}
