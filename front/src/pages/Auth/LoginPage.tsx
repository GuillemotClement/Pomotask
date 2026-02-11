import { useForm } from "@tanstack/react-form";
import { z } from "zod";
// import FieldInfo from "../../../components/form/FieldInfo";
import { useState } from "react";
// import { authClient } from "../../../libs/auth_client";
import { useNavigate } from "@tanstack/react-router";
import { authClient } from "../../libs/auth-client";

const schema = z.object({
	email: z.email().min(1, "Un email valide est attendu"),
	password: z.string().min(1, "Un mot de passe est attendu"),
});

type Form = z.infer<typeof schema>;

const defaultValues: z.input<typeof schema> = {
	email: "",
	password: "",
};

type LoginData = {
	email: string;
	password: string;
};

export default function LoginPage() {
	const [serverError, setServerError] = useState("");
	const navigate = useNavigate();

	const form = useForm({
		defaultValues,
		validators: {
			onChange: schema,
		},
		onSubmit: async ({ value }) => {
			const data: Form = schema.parse(value);

			const loginData: LoginData = {
				email: data.email,
				password: data.password,
			};

			await authClient.signIn.email(loginData, {
				onRequest: (ctx) => {
					console.log("send", ctx);
				},
				onSuccess: (ctx) => {
					console.log("on success", ctx);
					navigate({ to: "/" });
				},
				onError: (ctx) => {
					console.log("request failed", ctx);
					setServerError(ctx.error.message);
				},
			});
		},
	});

	return (
		<div>
			<form
				className="border"
				onSubmit={(e) => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
			>
				<form.Field
					name="email"
					children={(field) => (
						<div className="">
							<input
								className="input"
								placeholder="Email"
								type="email"
								name={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
							{/* <FieldInfo field={field} /> */}
						</div>
					)}
				/>

				<form.Field
					name="password"
					children={(field) => (
						<div className="">
							<input
								type="password"
								className="input"
								placeholder="Mot de passe"
								name={field.state.value}
								onBlur={field.handleBlur}
								onChange={(e) => field.handleChange(e.target.value)}
							/>
							{/* <FieldInfo field={field} /> */}
						</div>
					)}
				/>

				{serverError && <p>{serverError}</p>}

				<form.Subscribe
					selector={(state) => [state.canSubmit, state.isSubmitting]}
					children={([canSubmit, isSubmitting]) => (
						<div className="">
							<button
								type="button"
								className="btn"
								onClick={() => {
									form.reset();
								}}
							>
								Effacer
							</button>

							<button type="submit" disabled={!canSubmit} className="btn">
								{isSubmitting ? "..." : "Connexion"}
							</button>
						</div>
					)}
				/>
			</form>
		</div>
	);
}
