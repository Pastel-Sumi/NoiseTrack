import * as Yup from "yup";

export function initialValues(){
    return {
        username:"",
        enterprise: "",
        email: "",
        password: "",
    }
}

export function validationSchema() {
    return Yup.object({
        enterprise: Yup.string().required(true),
        username: Yup.string().required(true),
        email: Yup.string().email(true).required(true),
        password: Yup.string().required(true).min(6),
    })
}