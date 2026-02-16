import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { authClient } from "../../libs/auth-client";

const schema = z
  .object({
    email: z.email("Une email valide est attendu").trim(),
    name: z.string().min(2, "Un nom valide est attendu").trim(),
    password: z.string().min(8, "Un mot de passe de 8 caractères est attendus"),
    confirmPassword: z
      .string()
      .min(8, "Une confirmation de mot de passe est attendu")
      .trim(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Confirmation du mot de passe invalide",
    path: ["confirmPassword"],
  });

type RegisterFormData = z.infer<typeof schema>;
type RegisterApiPayload = Omit<RegisterFormData, "confirmPassword">;

const defaultValues: z.input<typeof schema> = {
  email: "",
  name: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterPage() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (formData: RegisterApiPayload) => {
      const { data, error } = await authClient.signUp.email(formData);

      if (error) {
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      navigate({ to: "/" });
    },
    onError: (ctx) => {
      console.error("Erreur serveur: ", ctx.message);
    },
  });

  const form = useForm({
    defaultValues,
    validators: {
      onChange: schema,
    },
    onSubmit: ({ value }) => {
      const { confirmPassword, ...credentials } = value;
      mutation.mutate(credentials);
      navigate({
        to: "/",
      });
    },
  });

  return (
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
            <label htmlFor={field.name}>Email :</label>
            <input
              type="email"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      />

      <form.Field
        name="name"
        children={(field) => (
          <div className="flex items-center input w-full">
            <label htmlFor={field.name}>Nom d'utilisateur :</label>
            <input
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      />

      <form.Field
        name="password"
        children={(field) => (
          <div className="flex items-center input w-full">
            <label htmlFor={field.name}>Mot de passe :</label>
            <input
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      />

      <form.Field
        name="confirmPassword"
        children={(field) => (
          <div className="flex items-center input w-full">
            <label htmlFor={field.name}>Confirmation du mot de passe :</label>
            <input
              type="text"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(e) => field.handleChange(e.target.value)}
            />
          </div>
        )}
      />

      <form.Subscribe
        selector={(state) => [state.canSubmit, state.isSubmitting]}
        children={([canSubmit, isSubmitting]) => (
          <div className="flex justify-center gap-x-5">
            <button
              type="reset"
              className="btn btn-neutral"
              onClick={(event) => {
                event.preventDefault();
                form.reset();
              }}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={!canSubmit}
              className="btn btn-primary"
            >
              {isSubmitting ? "..." : "Submit"}
            </button>
          </div>
        )}
      />
    </form>
  );
}
