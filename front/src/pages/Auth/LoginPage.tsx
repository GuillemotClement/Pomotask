import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
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
        className="w-200 mx-auto flex flex-col gap-y-5 py-6 container"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="email"
          children={(field) => (
            <div className="flex items-center input w-full">
              <label htmlFor={field.name} className="text-gray-400">
                Email
              </label>
              <input
                type="email"
                name={field.name}
                value={field.state.value}
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
            <div className="flex items-center input w-full">
              <label htmlFor={field.name} className="text-gray-400">
                Mot de passe :
              </label>
              <input
                type="password"
                name={field.name}
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
            <div className="flex justify-center gap-x-5">
              <button
                type="button"
                className="btn btn-neutral"
                onClick={() => {
                  form.reset();
                }}
              >
                Effacer
              </button>

              <button
                type="submit"
                disabled={!canSubmit}
                className="btn btn-primary"
              >
                {isSubmitting ? "..." : "Connexion"}
              </button>
            </div>
          )}
        />
      </form>
    </div>
  );
}
