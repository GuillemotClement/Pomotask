import { Link } from "@tanstack/react-router";

export default function HeaderProfil() {
	return (
		<div className="dropdown dropdown-end">
			<button
				type="button"
				tabIndex={0}
				className="btn btn-ghost btn-circle avatar"
			>
				<div className="w-10 rounded-full">
					<img
						alt="Tailwind CSS Navbar component"
						src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
					/>
				</div>
			</button>
			<ul
				tabIndex={-1}
				className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
			>
				<li>
					<Link to={"/"} className="justify-between">
						Profil
					</Link>
				</li>
				<li>
					<button type="button">Logout</button>
				</li>
			</ul>
		</div>
	);
}
