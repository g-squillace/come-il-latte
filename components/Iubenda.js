import Script from "next/script";

export default function Iubenda({ siteId, policyId, locale }) {
  return (
    <>
      <Script
        src="//cdn.iubenda.com/cs/iubenda_cs.js"
        strategy="afterInteractive"
      />
      <Script
        id="iubenda"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `var _iub = _iub || [];
            _iub.csConfiguration = {
            "consentOnContinuedBrowsing": true,
            "lang":"${locale}",
            "siteId":${siteId},
            "cookiePolicyId":${policyId},
            "perPurposeConsent": true,
            "purposes": "1, 4, 5",
            "banner":{
              "acceptButtonDisplay":true,
              "customizeButtonDisplay":true,
              "position":"float-bottom-right",
              "closeButtonDisplay":false,
              "acceptButtonColor":"#424242",
              "acceptButtonCaptionColor":"white",
              "customizeButtonColor":"#424242",
              "customizeButtonCaptionColor":"white",
              "rejectButtonColor":"#424242",
              "rejectButtonCaptionColor":"white",
              "textColor":"#332e2d",
              "backgroundColor":"white",
              "rejectButtonDisplay":true,
              "closeButtonRejects":true
            },
            "callback":{
              onPreferenceExpressedOrNotNeeded: function(preference) {
                window.consentIsGiven = preference;
              }
            }};
            `,
        }}
      />
    </>
  )
}
