import { ZodIssue } from 'zod';

export function buildValidationErroMessagen(issues: ZodIssue[]): string[] {
    const errors = issues.map((item) => `${item.path.join('.')}:${item.message}`);

    return errors;
}
