import { Link } from "@tanstack/react-router";

export default function HeaderAction() {
	return (
		<div className="flex gap-x-3">
			<Link to="/" className="btn">
				Connection{" "}
			</Link>
			<Link to="/" className="btn">
				Inscription
			</Link>
		</div>
	);
}
