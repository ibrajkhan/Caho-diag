import "./Rsvp.css";
import { Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import * as formik from "formik";
import * as yup from "yup";
import Button from "react-bootstrap/Button";
import { useFormik } from "formik";
import emailjs from "@emailjs/browser";
import { useState, useRef } from "react";
import Spinner from "react-bootstrap/Spinner";

import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import CahoIcon from "../src/assets/Img/diagnosticon-logo-black.png";

const Forms = () => {
  // const { Formik } = formik;
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const MySwal = withReactContent(Swal);

  const schema = yup.object().shape({
    firstName: yup.string().required("First Name Required"),
    lastName: yup.string().required("Last Name Required"),
    email: yup
      .string()
      .required("Email Required")
      .matches(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$/i,
        "Invalid email address"
      ),
    phone: yup
      .string()
      .required("Phone number is required")
      .matches(
        /^(\+?\d{1,4}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}$/,
        "Invalid phone number"
      ),
    institute: yup.string().required("Institute Required"),
    designation: yup.string().required("Designation Required"),
    speciality: yup.string().required("Speciality is required"),
    areYou: yup
      .string()
      .required("Required Field")
      .notOneOf(["-Select-"], "Please select option"),
    consent: yup.bool(),
    consentSecond: yup.bool(),
  });

  const allowedEmails = [
    "ibraj.grd@gmail.com",
    "ibraj.senocare@gmail.com",
    "ibrajkhan.grd@gmail.com",
  ];
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      institute: "",
      designation: "",
      speciality: "",
      consent: false,
      consentSecond: false,
    },
    validationSchema: schema,
    // onSubmit: (values, { resetForm }) => {
    //   console.log(values);
    //   setLoading(true);
    //   const googleSheetData = {
    //     FirstName: values.firstName,
    //     LastName: values.lastName,
    //     Email: values.email,
    //     NumberOfGuests: values.numberOfGuests,
    //   };
    //   // MySwal.fire({
    //   //   icon: "success",
    //   //   title: "You are welcome",
    //   // });
    //   // setLoading(false);

    //   emailjs
    //     .sendForm(
    //       import.meta.env.VITE_SERVICE_ID,
    //       import.meta.env.VITE_HOTEL_TEMPLATE,
    //       formRef.current,
    //       import.meta.env.VITE_PUBLIC_KEY
    //     )
    //     .then((res) => {
    //       console.log("Email sent successfully:", res);
    //       // Proceed to submit to Google Sheets
    //       return fetch(import.meta.env.VITE_BOOKING_REQUESTDB, {
    //         method: "POST",
    //         headers: {
    //           Accept: "application/json",
    //           "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify({
    //           data: [googleSheetData],
    //         }),
    //       });
    //     })
    //     .then((response) => response.json())
    //     .then((data) => {
    //       console.log("Data submitted to sucessful:", data);
    //       MySwal.fire({
    //         icon: "success",
    //         title: "You are welcome",
    //       });
    //       setTimeout(() => {
    //         setLoading(false);
    //         resetForm();
    //       }, 1000);
    //     })
    //     .catch((error) => {
    //       console.error("Error:", error);
    //       MySwal.fire({
    //         icon: "error",
    //         title: "Oops...",
    //         text: "Pls Enter correct Email id or Try after some time",
    //       });
    //       setTimeout(() => {
    //         setLoading(false);
    //         resetForm();
    //       }, 2000);
    //     });

    //   //   emailjs
    //   //     .sendForm(
    //   //       import.meta.env.VITE_SERVICE_ID,
    //   //       import.meta.env.VITE_TEMPLATE,
    //   //       formRef.current,
    //   //       import.meta.env.VITE_PUBLIC_KEY
    //   //     )
    //   //     .then((res) => {
    //   //       MySwal.fire({
    //   //         icon: "success",
    //   //         title: "Form Submitted Sucessfully",
    //   //         time: 1000,
    //   //       });
    //   //       console.log(res);
    //   //     })
    //   //     .catch((err) => {
    //   //       MySwal.fire({
    //   //         icon: "error",
    //   //         title: "Failed to Submit",
    //   //         time: 1000,
    //   //       });
    //   //       console.log(err, "hello");
    //   //     });
    //   //   setTimeout(() => {
    //   //     setLoading(false);
    //   //     resetForm();
    //   //   }, 1000 * 2);
    // },
    onSubmit: async (values, { resetForm }) => {
      console.log(values);

      // Check if the email is in the allowed list
      // if (!allowedEmails.includes(values.email)) {
      //   MySwal.fire({
      //     icon: "error",
      //     title: "Not Allowed",
      //     text: "You are not allowed to fill this form.",
      //   });
      //   return;
      // }
      setLoading(true);
      // Fetch data from the Google Sheet to check if the phone has already been submitted
      const response = await fetch(import.meta.env.VITE_BOOKING_REQUESTDB);
      const data = await response.json();

      const emailAlreadySubmitted = data.some(
        (entry) => entry.Phone === values.phone
      );

      if (emailAlreadySubmitted) {
        MySwal.fire({
          icon: "warning",
          title: "Already Submitted",
          text: "You have already submitted the form. Please contact the Help Desk, in case you need any further assistance.",
          imageUrl: CahoIcon, // Use the imported logo
          imageWidth: 200, // Adjust the size as needed
          // imageHeight: 100,
          imageAlt: "Custom logo",
          customClass: {
            title: "swal-title",
            text: "swal-text",
          },
        });
        setLoading(false);
        // resetForm();

        return;
      }

      // setLoading(true);
      const googleSheetData = {
        FirstName: values.firstName,
        LastName: values.lastName,
        Email: values.email,
        Phone: values.phone,
        Institute: values.institute,
        Designation: values.designation,
        Speciality: values.speciality,
        AreYou: values.areYou,
        Consent: values.consent,
        ConsentEticket: values.consentSecond,
      };

      // Playing Only with google sheet

      fetch(import.meta.env.VITE_BOOKING_REQUESTDB, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: [googleSheetData],
        }),
      })
        .then((response) => {
          response.json();
        })
        .then((data) => {
          console.log(data);
          MySwal.fire({
            icon: "success",
            title:
              "Thank you for registering for CAHO DIAGNOSTICON 2025. We wish you an enriching learning and networking experience.",
            imageUrl: CahoIcon, // Use the imported logo
            imageWidth: 200, // Adjust the size as needed
            // imageHeight: 100,
            imageAlt: "Custom logo",
            customClass: {
              title: "swal-title",
              text: "swal-text",
            },
          });
          setTimeout(() => {
            setLoading(false);
            resetForm();
          }, 1000);
        })
        .catch((error) => {
          MySwal.fire({
            icon: "error",
            title: "Oops...",
            text: "Try after some time",
          });
          console.error("Error fetching data:", error);
          setTimeout(() => {
            setLoading(false);
          }, 1000 * 2);
          console.error("Error:", error);
        });

      // Playing with Google sheet and email js

      // emailjs
      //   .sendForm(
      //     import.meta.env.VITE_SERVICE_ID,
      //     import.meta.env.VITE_HOTEL_TEMPLATE,
      //     formRef.current,
      //     import.meta.env.VITE_PUBLIC_KEY
      //   )
      //   .then((res) => {
      //     console.log("Email sent successfully:", res);
      //     // Proceed to submit to Google Sheets
      //     return fetch(import.meta.env.VITE_BOOKING_REQUESTDB, {
      //       method: "POST",
      //       headers: {
      //         Accept: "application/json",
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify({
      //         data: [googleSheetData],
      //       }),
      //     });
      //   })
      //   .then((response) => response.json())
      //   .then((data) => {
      //     console.log("Data submitted to Google Sheets successfully:", data);
      // MySwal.fire({
      //   icon: "success",
      //   title:
      //     "Thank you for registering for CAHO DIAGNOSTICON 2025. We wish you an enriching learning and networking experience.",
      //   imageUrl: CahoIcon, // Use the imported logo
      //   imageWidth: 200, // Adjust the size as needed
      //   // imageHeight: 100,
      //   imageAlt: "Custom logo",
      //   customClass: {
      //     title: "swal-title",
      //     text: "swal-text",
      //   },
      //      });
      //     setTimeout(() => {
      //       setLoading(false);
      //       resetForm();
      //     }, 1000);
      //   })
      //   .catch((error) => {
      //     console.error("Error:", error);
      //     MySwal.fire({
      //       icon: "error",
      //       title: "Oops...",
      //       text: "Please enter a correct Email ID or try again later.",
      //     });
      //     setTimeout(() => {
      //       setLoading(false);
      //       resetForm();
      //     }, 2000);
      //   });
    },
  });

  return (
    <div id="rsvp">
      <div className="rsvp">
        <div className="rsvp__content">
          <h3 className="montaga-regulars header_text pt-3">
            Delegate Registration
          </h3>
          <h4 className="montaga-regulars text-center py-2 empin">
            Empowering Healthcare through Diagnostic Excellence
          </h4>
          <p className="montaga-regulars text-center kdi pb-3">
            8th & 9th February 2025, Eros Hotel, New Delhi
          </p>
        </div>
      </div>

      <Form
        name="contact"
        onSubmit={formik.handleSubmit}
        noValidate
        className="form__content"
        // onSubmit={() => handleSubmit(submitFormData())}
        ref={formRef}>
        <div className="rsvp__content">
          <Row className="mb-3">
            <Form.Group
              as={Col}
              md="4"
              xs="12"
              controlId="validationFormik101"
              className="position-relative text_field ">
              <Form.Label className="montaga-regulars label_">
                First name
              </Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                className="custom-input"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                placeholder="First name"
                isInvalid={!!formik.errors.firstName}
                isValid={formik.touched.firstName && !formik.errors.firstName}
              />
              <Form.Control.Feedback className="montaga-regulars">
                Looks Good!
              </Form.Control.Feedback>
              <Form.Control.Feedback
                type="invalid"
                className="montaga-regulars">
                {formik.errors.firstName}
              </Form.Control.Feedback>{" "}
              g
            </Form.Group>
            <Form.Group
              as={Col}
              md="4"
              xs="12"
              controlId="validationCustom02 "
              className="position-relative text_field ">
              <Form.Label className="montaga-regulars label_">
                Last name
              </Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                className="custom-input"
                onChange={formik.handleChange}
                value={formik.values.lastName}
                placeholder="Last name"
                isValid={formik.touched.lastName && !formik.errors.lastName}
                isInvalid={!!formik.errors.lastName}
              />
              <Form.Control.Feedback className="montaga-regulars">
                Looks Good!
              </Form.Control.Feedback>

              <Form.Control.Feedback
                type="invalid"
                className="montaga-regulars">
                {formik.errors.lastName}
              </Form.Control.Feedback>
            </Form.Group>

            {/* <Form.Group
              as={Col}
              md="4"
              xs="12"
              controlId="validationCustom02 "
              className="text_field">
              <Form.Label className="montaga-regulars label_">Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                className="custom-input"
                onChange={formik.handleChange}
                value={formik.values.phone}
                placeholder="Phone Number"
                isValid={formik.touched.phone && !formik.errors.phone}
                isInvalid={!!formik.errors.phone}
              />
              <Form.Control.Feedback
                type="invalid"
                className="montaga-regulars">
                {formik.errors.phone}
              </Form.Control.Feedback>
              <Form.Control.Feedback className="montaga-regulars">
                Looks Good!
              </Form.Control.Feedback>
            </Form.Group> */}

            {/* <PhoneInput
              country={"us"} // Default country
              value={formik.values.phone}
              onChange={(phone) => formik.setFieldValue("phone", phone)}
              inputProps={{
                name: "phone",
                required: true,
                autoFocus: true,
              }}
              inputClass={`form-control ${
                formik.errors.phone && formik.touched.phone ? "is-invalid" : ""
              }`}
            />
            {formik.errors.phone && formik.touched.phone && (
              <div className="invalid-feedback">{formik.errors.phone}</div>
            )} */}

            <Form.Group
              as={Col}
              md="4"
              xs="12"
              controlId="validationCustom02 "
              className="text_field ">
              <Form.Label className="montaga-regulars label_">
                Organization / Institute Name
              </Form.Label>
              <Form.Control
                type="text"
                name="institute"
                className="custom-input"
                onChange={formik.handleChange}
                value={formik.values.institute}
                placeholder="Organization / Institute"
                isValid={formik.touched.institute && !formik.errors.institute}
                isInvalid={!!formik.errors.institute}
              />
              <Form.Control.Feedback
                type="invalid"
                className="montaga-regulars">
                {formik.errors.institute}
              </Form.Control.Feedback>

              <Form.Control.Feedback className="montaga-regulars">
                Looks Good!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              as={Col}
              md="4"
              xs="12"
              controlId="validationCustom02 "
              className="text_field">
              <Form.Label className="montaga-regulars label_">
                Designation
              </Form.Label>
              <Form.Control
                type="text"
                name="designation"
                className="custom-input"
                onChange={formik.handleChange}
                value={formik.values.designation}
                placeholder="Designation"
                isValid={
                  formik.touched.designation && !formik.errors.designation
                }
                isInvalid={!!formik.errors.designation}
              />
              <Form.Control.Feedback
                type="invalid"
                className="montaga-regulars">
                {formik.errors.designation}
              </Form.Control.Feedback>

              <Form.Control.Feedback className="montaga-regulars">
                Looks Good!
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group
              as={Col}
              md="4"
              xs="12"
              controlId="validationCustom02 "
              className="text_field">
              <Form.Label className="montaga-regulars label_">
                Speciality
              </Form.Label>
              <Form.Control
                type="text"
                name="speciality"
                className="custom-input"
                onChange={formik.handleChange}
                value={formik.values.speciality}
                placeholder="Speciality"
                isValid={formik.touched.speciality && !formik.errors.speciality}
                isInvalid={!!formik.errors.speciality}
              />
              <Form.Control.Feedback
                type="invalid"
                className="montaga-regulars">
                {formik.errors.speciality}
              </Form.Control.Feedback>

              <Form.Control.Feedback className="montaga-regulars">
                Looks Good!
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group
              as={Col}
              md="4"
              xs="12"
              className="text_field"
              controlId="validationFormikUsername2">
              <Form.Label className="montaga-regulars label_">
                Are You
              </Form.Label>
              <Form.Select
                aria-label="Default select example"
                className="custom-input"
                name="areYou"
                placeholder="Are You"
                value={formik.values.areYou}
                onChange={formik.handleChange}
                isValid={formik.touched.areYou && !formik.errors.areYou}
                isInvalid={!!formik.errors.areYou}>
                <option>-Select-</option>
                <option value="Delegate">Delegate</option>
                <option value="Delegate">Student</option>
                <option value="Volunteer">Volunteer</option>
                <option value="Sponsor/Partner/Exhibitor">
                  Sponsor/Partner/Exhibitor
                </option>
                {/* <option value="Partner">Partner</option> */}

                {/* <option value="Exhibitor">Exhibitor</option> */}
              </Form.Select>
              <Form.Control.Feedback
                type="invalid"
                className="montaga-regulars">
                {formik.errors.areYou}
              </Form.Control.Feedback>
              <Form.Control.Feedback className="montaga-regulars">
                Looks Good!
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group
              as={Col}
              md="4"
              xs="12"
              controlId="validationCustomUsername"
              className="text_field ">
              <Form.Label className="montaga-regulars label_">Email</Form.Label>
              <InputGroup hasValidation>
                {/* <InputGroup.Text id="inputGroupPrepend">@</InputGroup.Text> */}
                <Form.Control
                  type="text"
                  placeholder="Email"
                  className="custom-input"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  aria-describedby="inputGroupPrepend"
                  isValid={formik.touched.email && !formik.errors.email}
                  isInvalid={!!formik.errors.email}
                />
                <Form.Control.Feedback
                  type="invalid"
                  className="montaga-regulars">
                  {formik.errors.email}
                </Form.Control.Feedback>
                <Form.Control.Feedback className="montaga-regulars">
                  Looks Good!
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group
              as={Col}
              md="4"
              xs="12"
              controlId="validationCustom02"
              className="text_field">
              <Form.Label className="montaga-regulars label_">Phone</Form.Label>
              <PhoneInput
                country={"in"} // Default country code
                value={formik.values.phone}
                className="custom-input ins"
                onChange={(phone) => formik.setFieldValue("phone", phone)}
                inputProps={{
                  name: "phone",
                  // className: "phonew",

                  // className: `custom-input ${
                  //   formik.touched.phone && formik.errors.phone
                  //     ? "is-invalid"
                  //     : ""
                  // }`,
                  placeholder: "Phone Number",
                }}
              />
              {formik.errors.phone && formik.touched.phone && (
                <Form.Control.Feedback
                  type="invalid"
                  className="montaga-regulars d-block">
                  {formik.errors.phone}
                </Form.Control.Feedback>
              )}
              {!formik.errors.phone && formik.touched.phone && (
                <Form.Control.Feedback className="montaga-regulars">
                  Looks Good!
                </Form.Control.Feedback>
              )}
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                name="consent"
                label="By ticking this box, you consent to share your personal details filled in this form with the exhibitors of this conference."
                value={formik.values.consent}
                onChange={formik.handleChange}
                // isInvalid={!!formik.errors.consent}
                // feedback={formik.errors.consent}
                // feedbackType="invalid"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicCheckboxx">
              <Form.Check
                type="checkbox"
                name="consentSecond"
                label="To promote sustainability, we will be issuing an e-certificate. Please provide your consent to receive it."
                value={formik.values.consentSecond}
                onChange={formik.handleChange}
                // isInvalid={!!formik.errors.consentSecond}
                // feedback={formik.errors.consentSecond}
                // feedbackType="invalid"
              />
            </Form.Group>
          </Row>

          <Button
            type="submit"
            className="button-sub montaga-regulars mt-1 mb-5">
            {loading && (
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
            {loading ? "Processing..." : "Submit"}
          </Button>
        </div>
      </Form>
      {/* Whats App */}
      {/* <a
        href="https://wa.me/9665080749"
        className="whatsapp-link"
        target="_blank">
        Chat with us on WhatsApp
      </a> */}

      {/* Live Streaming */}

      {/* <iframe
        width="100%"
        height="500"
        src="YOUR_LIVE_STREAM_LINK"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        title="Live Stream"></iframe> */}
    </div>
  );
};

export default Forms;
