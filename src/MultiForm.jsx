import React, { useState } from "react";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./MultiForm.css";

//delay
const sleep = (time) => new Promise((acc) => setTimeout(acc, time));

const MultiForm = () => {
  return (
    <FormikStepper
      initialValues={{
        firstname: "",
        lastname: "",
        email: "",
        password: "",
        acctype: "",
        profilepic: "",
        age: "",
        referrer: "",
        bio: "",
        terms: false,
      }}
      onSubmit={async (values) => {
        await sleep(1000);
        alert(JSON.stringify(values, null, 2));
        console.log('values', values);
      }}
      >

      <FormikStep validationSchema={Yup.object({
        firstname: Yup.string().required("Required"),
        lastname: Yup.string().required("Required"),
        email: Yup.string().email("Invalid email address").required("Required"),
       password: Yup.string()
          .matches(/[a-z0-5]{8,}/, "Password must be at least 8 characters")
          .required("Required")})} >
        <label>
          Enter Your First Name:
          <Field name="firstname" type="text" />
        </label>
        <ErrorMessage component="div" className="error-message" name="firstname" />

        <label>
          Enter Your Last Name:
          <Field name="lastname" type="text" />
        </label>
        <ErrorMessage component="div" className="error-message" name="lastname" />

        <label>
          Enter Your Email:
          <Field name="email" type="email" />
        </label>
        <ErrorMessage component="div" className="error-message" name="email" />

        <label>
          Create a New Password:
          <Field name="password" type="password" />
        </label>
        <ErrorMessage component="div" className="error-message" name="password" />
      </FormikStep>

      <FormikStep 
      validationSchema={
        Yup.object({
        acctype: Yup.string().required("Required")})}>
        <legend>Account type</legend>
        <label>
          <Field name="acctype" type="radio" value="personal" />
          Personal
        </label>
        <label>
          <Field name="acctype" type="radio" value="business" />
          Business
        </label>
        <ErrorMessage component="div" className="error-message" name="acctype" />
      </FormikStep>

      <FormikStep validationSchema={Yup.object({
        profilepic: Yup.mixed().optional(),
        age: Yup.number()
          .typeError("Please enter a valid number")
          .min(18, "Must be at least 18")
          .max(120, "Must be at most 120")
          .required("Required"),
      
        referrer: Yup.string().required("Required"),
      
        bio: Yup.string().required("Required"),
      
        terms: Yup.boolean()
          .oneOf([true], "You must accept the terms and conditions")
          .required("Required"),
      })}>
        <label>
          Upload a profile picture:
          <Field name="profilepic" type="file" />
        </label>
        <ErrorMessage component="div" className="error-message" name="profile-picture" />

        <label>
          Input your age (years):
          <Field name="age" type="number" min="0" max="100" />
        </label>
        <ErrorMessage component="div" className="error-message" name="age" />

        <label>
          How did you hear about us?
          <Field as="select" name="referrer">
            <option value="" label="(select one)" />
            <option value="1" label="Social Media" />
            <option value="2" label="News" />
            <option value="3" label="Friends" />
          </Field>
        </label>
        <ErrorMessage component="div" className="error-message" name="referrer" />

        <label>
          Provide a bio:
          <Field
            as="textarea"
            name="bio"
            rows="3"
            cols="30"
            placeholder="I like to play games..."
          />
          <ErrorMessage component="div" className="error-message" name="bio" />
        </label>

        <label>
          <Field name="terms" type="checkbox" />I accept the{" "}
          <a href="https://www.freecodecamp.org/news/terms-of-service/">
            terms and conditions
          </a>
          <ErrorMessage component="div" className="error-message" name="terms" />
        </label>
      </FormikStep>
    </FormikStepper>
  );
};

const FormikStep=({children})=>{
    return(
        <>{children}</>
    )

}
const FormikStepper = ({ children, ...props }) => {
  const childrenArray = React.Children.toArray(children);
  const [step, setStep] = useState(0);
  const currentChild = childrenArray[step];
  const isLastStep=()=>{
    return (step === childrenArray.length - 1)
}
  return (
    <>
      <Formik {...props}
      validationSchema={currentChild.props.validationSchema}
        onSubmit={async(values,helpers) => {
        if (isLastStep()) {
            await props.onSubmit(values,helpers);
        } else {
            setStep((s)=>s+1);
            helpers.setTouched({});

        }
        
      }}>
        {({isSubmitting})=>(

          <Form autoComplete="off">
            <div className="step">Step {step+1} of {childrenArray.length}</div>
          {currentChild}
          <div className="btn">
            {step>0?<button 
            type="button"
            disabled={isSubmitting} onClick={() => setStep(step - 1)}>
              Previous
            </button>:null}
            <button
            disabled={isSubmitting}
            type="submit"
           
            >
              {isSubmitting?'Submitting':isLastStep()?"Submit":"Next"}
            </button>
          </div>
        </Form>
              )}
      </Formik>
    </>
  );
};
export default MultiForm;
