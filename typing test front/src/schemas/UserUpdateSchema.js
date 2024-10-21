import * as yup from 'yup'

const passwordUpdateSchema = yup.object({
    currentpassword : yup.string().required("Must Enter Your Current Passwsord"),
    newpassword : yup.string().required("Insert Your New Password"),
    repassword : yup.string().oneOf([yup.ref("newpassword")], "Password and Re-Password should be same").required("Insert Your Re-Password"),
})

export {passwordUpdateSchema}