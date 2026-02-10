import { Link } from "@tanstack/react-router";
import { authClient } from "../../../libs/auth-client";

type User = typeof authClient.$Infer.Session.user;

type HeaderProfilProps = {
	user: User;
};

export default function HeaderProfil({ user }: HeaderProfilProps) {
	const handleLogout = async () => {
		await authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					window.location.href = "/";
				},
			},
		});
	};

	return (
		<div className="dropdown dropdown-end">
			<button
				type="button"
				tabIndex={0}
				className="btn btn-ghost btn-circle avatar"
			>
				<div className="w-10 rounded-full bg-gray-300 flex items-center">
					{user.name}
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
					<button type="button" onClick={handleLogout}>
						Logout
					</button>
				</li>
			</ul>
		</div>
	);
}
