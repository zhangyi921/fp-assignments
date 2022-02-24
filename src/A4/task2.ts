type FormError<FormDef> = {
    [K in keyof FormDef]?: {
        errorMsg: string;
    }
}

interface Form<T> {
    formValues: T;
    formErrors: FormError<T>
}

// example

interface UserRegistrationDto {
    name: string;
    age: number;
    password: string;
    confirmPassword: string
}

const validationResult: Form<UserRegistrationDto> = {
    formValues: {name: '', age: 26, password: '@', confirmPassword: '#'},
    formErrors: {
        name: {
            errorMsg: 'Name cannot be empty'
        },
        confirmPassword: {
            errorMsg: 'Password does not match'
        }
    }
}