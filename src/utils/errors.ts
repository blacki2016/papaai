export class RecipeParseError extends Error {
    name = 'RecipeParseError' as const;

    constructor(message = 'Antwort konnte nicht als Rezept-JSON geparst werden.') {
        super(message);
    }
}

export const isRecipeParseError = (err: unknown): err is RecipeParseError => {
    return err instanceof RecipeParseError;
};
