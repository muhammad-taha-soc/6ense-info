import { useState } from "react";
import axios from "axios";

const ContactForm = () => {
  const [userinput, setUserinput] = useState({
    firstname: "",
    lastname: "",
    email: "",
    country: "",
    number: "",
    message: "",
  });

  // eslint-disable-next-line no-unused-vars
  const submitForm = async (e) => {
    e.preventDefault();

    // eslint-disable-next-line no-unused-vars
    const emailText = `
  Hello,

  Here are the details provided by the user:

  First Name: ${userinput.firstname}
  Last Name: ${userinput.lastname}
  Email: ${userinput.email}
  Country: ${userinput.country}
  Phone Number: ${userinput.number}

  Message:
  ${userinput.message}

  Best regards,
`;
    let res = axios
      // eslint-disable-next-line no-undef
      .post(`${process.env.NEXT_PUBLIC_SERVER_URL}/send-mail`, {
        emailText,
      })
      .then((data) => {
        console.log(data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    console.log("Email Sent: ", res);
  };

  const handleUserInput = (e) => {
    setUserinput({
      ...userinput,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className=" px-6 py-5 lg:px-12">
      <div className="pb-10">
        <h1 className=" text-2xl text-[#4c4c4c] text-center md:text-start font-bold uppercase py-1">
          Contact ICO 6ENSE
        </h1>
        <h3 className="  font-medium text-sm text-center md:text-start textBlack py-1 max-w-[800px] mx-auto">
          CONTACT WITH US
        </h3>
      </div>
      <form className="mx-auto max-w-xl ">
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="first-name"
              className="block text-sm font-semibold leading-6 text-[#101013]"
            >
              First name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="firstname"
                id="first-name"
                autoComplete="given-name"
                className="block w-full rounded-md border-0 px-3.5 outline-none py-2 text-[#101013] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#6254ff] sm:text-sm sm:leading-6"
                onChange={handleUserInput}
                value={userinput.firstname}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="last-name"
              className="block text-sm font-semibold leading-6 text-[#101013]"
            >
              Last name
            </label>
            <div className="mt-2.5">
              <input
                type="text"
                name="lastname"
                id="lastname"
                autoComplete="family-name"
                className="block w-full rounded-md border-0 px-3.5 outline-none py-2 text-[#101013] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset  focus:ring-[#6254ff] sm:text-sm sm:leading-6"
                onChange={handleUserInput}
                value={userinput.lastname}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm font-semibold leading-6 text-[#101013]"
            >
              Email
            </label>
            <div className="mt-2.5">
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                className="block w-full rounded-md border-0 px-3.5 outline-none py-2 text-[#101013] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#6254ff] sm:text-sm sm:leading-6"
                onChange={handleUserInput}
                value={userinput.email}
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="phone-number"
              className="block text-sm font-semibold leading-6 text-[#101013]"
            >
              Phone number
            </label>
            <div className="relative mt-2.5">
              <div className="absolute inset-y-0 left-0 flex items-center">
                <label htmlFor="country" className="sr-only">
                  Country
                </label>
                <select
                  id="country"
                  name="country"
                  className="h-full rounded-md border-0 bg-transparent bg-none py-0 pl-4 pr-9 text-gray-400 focus:ring-2 focus:ring-inset focus:none sm:text-sm"
                  onChange={handleUserInput}
                  value={userinput.country}
                >
                  <option>IN</option>
                  <option>US</option>
                  <option>CA</option>
                  <option>EU</option>
                </select>
              </div>
              <input
                type="tel"
                name="number"
                id="phone-number"
                autoComplete="tel"
                className="block w-full rounded-md border-0  px-3.5 outline-none py-2 pl-24 text-[#101013] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#6254ff] sm:text-sm sm:leading-6"
                onChange={handleUserInput}
                value={userinput.number}
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="message"
              className="block text-sm font-semibold leading-6 text-[#101013]"
            >
              Message
            </label>
            <div className="mt-2.5">
              <textarea
                name="message"
                id="message"
                rows={4}
                className="block w-full rounded-md border-0 px-3.5 outline-none py-2 text-[#101013] shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#6254ff] sm:text-sm sm:leading-6"
                defaultValue={""}
                onChange={handleUserInput}
                value={userinput.message}
              />
            </div>
          </div>
        </div>
        <div className="mt-10 flex justify-center">
          <button
            className=""
            style={{
              border: "1px solid",
              borderRadius: "10px",
              padding: "10px",
            }}
            onClick={submitForm}
          >
            Send Message
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
