import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../../libs/axios";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import type { Project } from "../../types/project";

const schema = z.object({
  title: z.string().min(1, "Un nom de tâche est attendu"),
  description: z.string().min(1, "Une description est attendu"),
  branche: z.string().optional(),
  projectId: z.coerce.number().optional().or(z.literal("")),
});

type FormValues = z.infer<typeof schema>;

type ProjectsResponse = {
  projects: Project[];
};

export default function TaskForm() {
  const queryClient = useQueryClient();

  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await api.get<ProjectsResponse>("/projects");
      return res.data.projects;
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (task: FormValues) => {
      return await api.post("/tasks", task);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task"] });
    },
    onError: (err) => {
      console.error("Erreur lors de la création : ", err);
    },
  });

  const form = useForm({
    defaultValues: {
      title: "",
      branche: "",
      description: "",
      projectId: "",
    },
    validators: {
      onChange: schema,
    },
    onSubmit: async ({ value }) => {
      mutate(value);
    },
  });

  return (
    <div className="flex flex-col container mx-auto p-5 mt-5">
      <form
        className="w-200 mx-auto flex flex-col gap-y-5 py-6"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.Field
          name="title"
          children={(field) => (
            <div className="flex items-center input w-full">
              <label htmlFor={field.name}>Nom :</label>
              <input
                type="text"
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />

        <form.Field
          name="branche"
          children={(field) => (
            <div className="flex items-center input w-full">
              <label htmlFor={field.name}>Branche :</label>
              <input
                type="text"
                id={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />

        <form.Field
          name="projectId"
          children={(field) => (
            <div className="select w-full">
              <label htmlFor={field.name}>Projet</label>
              <select
                value={field.state.value}
                id={field.name}
                onChange={(e) => field.handleChange(e.target.value)}
              >
                <option value="">Choisir un projet</option>
                {projects.map((project) => {
                  return (
                    <option value={project.id} key={project.id}>
                      {project.title}
                    </option>
                  );
                })}
              </select>
            </div>
          )}
        />

        <form.Field
          name="description"
          children={(field) => (
            <div className="flex flex-col gap-1 w-full p-2 textarea">
              <label htmlFor={field.name}>Description :</label>
              <textarea
                className="w-full"
                name={field.name}
                value={field.state.value}
                onBlur={field.handleBlur}
                onChange={(e) => field.handleChange(e.target.value)}
              ></textarea>
            </div>
          )}
        />

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
                {isPending || isSubmitting ? "Envoie ..." : "Créer"}
              </button>
            </div>
          )}
        />
      </form>
    </div>
  );
}
