import { createAuthClient } from "better-auth/react";
import HeaderAction from "./HeaderAction";
import HeaderProfil from "./HeaderProfil";
import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";

const { useSession } = createAuthClient();

export default function Header() {
	const { data } = useSession();

	console.log(data?.user);

	return (
		<header className="navbar bg-base-100 shadow-sm">
			<div className="navbar-start">
				<div className="dropdown">
					<button type="button" className="btn btn-ghost lg:hidden">
						<Menu />
					</button>
					<ul
						tabIndex={-1}
						className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
					>
						<li>
							<Link to="/">Projets</Link>
						</li>
						{/* <li>
							<a>Parent</a>
							<ul className="p-2">
								<li>
									<a>Submenu 1</a>
								</li>
								<li>
									<a>Submenu 2</a>
								</li>
							</ul>
						</li>
						<li>
							<a>Item 3</a>
						</li> */}
					</ul>
				</div>
				<Link to="/" className="btn btn-ghost text-xl">
					Pomotask
				</Link>
			</div>
			<div className="navbar-center hidden lg:flex">
				<ul className="menu menu-horizontal px-1">
					<li>
						<Link to="/">Projets</Link>
					</li>
					{/* <li>
						<details>
							<summary>Parent</summary>
							<ul className="p-2 bg-base-100 w-40 z-1">
								<li>
									<a>Submenu 1</a>
								</li>
								<li>
									<a>Submenu 2</a>
								</li>
							</ul>
						</details>
					</li>
					<li>
						<a>Item 3</a>
					</li> */}
				</ul>
			</div>

			<div className="navbar-end flex gap-x-4">
				<HeaderAction />

				<HeaderProfil />
			</div>
		</header>
	);
}
