export const zodUtils = {
    extractErrors(result){
        const errors: Record<string, string[]> = {};

        for (const issue of result.error.issues) {
            const path = issue.path[0] as string;
            if(path){
                errors[path] = errors[path] ?? [];
                errors[path].push(issue.message);
            } 
        }

        return errors;
    }
}

export default zodUtils;