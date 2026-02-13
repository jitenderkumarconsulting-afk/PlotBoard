import { RouterProvider } from "react-router-dom";
import { routes } from "./routes";

export default function AppRoutes() {
	return (
		<div className="container-fluid">
			<div className="row">
				<RouterProvider router={routes} />
			</div>
		</div>
	);
}