type FormError<FormDef> = {
    [K in keyof FormDef]?: {
        errorMsg: string;
        resolveHint: string
    }
}

interface Form<T> {
    formValues: T;
    formErrors: FormError<T>
}