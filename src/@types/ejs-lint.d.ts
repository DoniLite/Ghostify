// ejs-lint.d.ts
declare module 'ejs-lint' {
  export interface LintOptions {
    filename?: string; // Nom du fichier EJS
    // Autres options que tu souhaites ajouter selon les besoins
  }

  function lint(content: string, options?: LintOptions): unknown;

  export default lint;
}
