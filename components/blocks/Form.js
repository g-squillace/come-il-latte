import { anchorId } from "lib/anchors";
import { uppercaseClass } from "lib/visual";
import i18n from "lib/i18n";

export default function Form({ block, visual, org, locale }) {
  return (
    <section
      id={anchorId(block)}
      className="container scroll-mt-20 lg:scroll-mt-30 xl:scroll-mt-40 my-12 lg:my-24 xl:my-36 lg:max-w-3xl lg:mx-auto"
    >
      <h2
        className={`text-center mx-auto ${uppercaseClass(
          visual
        )} font-heading font-medium text-accent text-xl mb-6 xl:text-2xl xl:mb-12`}
      >
        {block.title}
      </h2>
      <form
        action="https://formspree.io/f/xwkgjywo"
        method="POST"
        encType="multipart/form-data"
        className=""
      >
        <div className="grid md:grid-cols-2 gap-4">
          <div className="">
            <label
              htmlFor="first_name"
              className="form-label"
            >
              {i18n.jobsForm.firstName[locale]}
            </label>
            <input
              type="text"
              name="first_name"
              id="first_name"
              required={true}
              className="form-input"
            />
          </div>
          <div className="">
            <label
              htmlFor="last_name"
              className="form-label"
            >
              {i18n.jobsForm.lastName[locale]}
            </label>
            <input
              type="text"
              name="last_name"
              id="last_name"
              required={true}
              className="form-input"
            />
          </div>
          <div className="">
            <label
              htmlFor="email"
              className="form-label"
            >
              {i18n.jobsForm.emailAddress[locale]}
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required={true}
              className="form-input"
            />
          </div>
          <div className="">
            <label
              htmlFor="phone"
              className="form-label"
            >
              {i18n.jobsForm.phoneNumber[locale]}
            </label>
            <input
              type="text"
              name="phone"
              id="phone"
              required={true}
              className="form-input"
            />
          </div>
          <div className="col-span-full">
            <label
              htmlFor="cv"
              className="form-label"
            >
              {i18n.jobsForm.cv[locale]}
            </label>
            <input
              type="file"
              name="cv"
              id="cv"
                accept=".pdf"
              required={true}
              className="form-input"
            />
              <div>{i18n.jobsForm.cvHint[locale]}</div>
          </div>
          <div className="col-span-full">
            <label
              htmlFor="text"
              className="form-label"
            >
              {i18n.jobsForm.text[locale]}
            </label>
            <textarea
              name="text"
              id="text"
              className="form-input"
              required={true} />
          </div>
          <div className="col-span-full flex items-center gap-1">
            <input
              id="privacy"
              aria-describedby="privacy-description"
              name="privacy"
              type="checkbox"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
              required={true}
            />
            <label
              htmlFor="privacy"
              id="privacy-description"
              className="form-label"
            >
              {i18n.jobsForm.privacy[locale]}
              <a
                href={`https://www.iubenda.com/privacy-policy/${org.iubendaPolicyId}`}
                className="iubenda-nostyle no-brand iubenda-noiframe iubenda-embed"
                title="Privacy Policy"
              >
                Privacy Policy
              </a>
            </label>
          </div>
        </div>
        <div className="my-2">
          <button
            className="button-arrow"
            type="submit">
            {i18n.jobsForm.submit[locale]}
          </button>
        </div>
      </form>
    </section>
  )
}