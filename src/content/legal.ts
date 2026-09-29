/**
 * The legal pages, as data: the privacy policy and the legal information page.
 *
 * LEGAL TEXT IS VERBATIM from the live flashweather.ai pages: same headings,
 * same order, same wording, same dates. Only the structure is new (headings,
 * paragraphs and lists held as data so one template renders both documents).
 * Do not edit the wording here without the client's legal sign-off.
 *
 * Editorial changes from the live HTML, none of which alter the wording:
 * - Non-breaking spaces and doubled spaces are normalised.
 * - Privacy §10: one paragraph the live page split mid-sentence
 *   ("…in the section “HOW" / "CAN YOU CONTACT US…”) is rejoined.
 * - Privacy: the "Learn more…" sentences in the summary link to their
 *   sections, and email addresses are mailto links.
 * - Privacy: the "Last updated" line moves from the foot of the page to the
 *   top; the live page's table-of-contents entries label the anchors.
 * - Legal information: its "Privacy Policy" link pointed at /privacy/, which
 *   does not exist; it now points at /privacy-policy/.
 */

import { site } from '@/lib/seo/site';

/** A run of text: plain, bold, or a link (internal path, #anchor, mailto: or https:). */
export type LegalRun = string | { text: string; strong: true } | { text: string; href: string };

export type LegalBlock =
  | { type: 'paragraph'; text: LegalRun[] }
  /** The "In Short:" summary line that opens a privacy section. */
  | { type: 'inShort'; text: string }
  /** An <h3> inside a section. */
  | { type: 'subheading'; text: string }
  /** An <h4> inside a section. */
  | { type: 'minorHeading'; text: string }
  | { type: 'list'; items: LegalRun[][] }
  | { type: 'table'; caption: string; columns: string[]; rows: string[][] }
  | { type: 'address'; lines: string[] };

export type LegalSection = {
  /** The fragment id; permanent once linked. */
  id: string;
  /** The <h2>, verbatim. */
  heading: string;
  /** The table-of-contents label, verbatim from the live page's own contents list. */
  tocLabel?: string;
  blocks: LegalBlock[];
};

export type LegalDocument = {
  path: string;
  /** The <title>, 40 characters or fewer (the layout appends the brand). */
  title: string;
  /** Meta description, 140–158 characters. */
  description: string;
  /** Breadcrumb label. */
  label: string;
  /** The <h1>, as the live page has it. */
  headline: string;
  /** The live page's "Last updated" line, verbatim, and its date. */
  lastUpdated?: { label: string; iso: string };
  /** Blocks before the first heading. */
  intro: LegalBlock[];
  /** Sections before the table of contents (not listed in it). */
  preamble: LegalSection[];
  /** Heading of the table of contents, when the document has one. */
  tocHeading?: string;
  sections: LegalSection[];
};

export const privacyPolicy: LegalDocument = {
  path: '/privacy-policy/',
  title: 'Privacy policy',
  description:
    'How Flash Weather AI collects, uses, shares and protects personal information from its app and services, and the privacy rights available to you by region.',
  label: 'Privacy policy',
  headline: 'Privacy Policy',
  lastUpdated: { label: "Last updated September 01, 2023", iso: '2023-09-01' },
  intro: [
    { type: 'paragraph', text: ["This privacy notice for FLASH Weather AI (“we,” “us,” or “our”), describes how and why we might collect, store, use, and/or share (“process”) your information when you use our services (“Services”), such as when you:"] },
    { type: 'list', items: [["Download and use our mobile application (FLASH Lightning Detection), or any other application that links to this privacy notice."], ["Engage with us in other related ways, including any sales, marketing, or events."]] },
    { type: 'paragraph', text: ["Questions or concerns? Reading this privacy notice will help you understand your privacy rights and choices. If you do not agree with our policies and practices, please do not use our Services. If you still have any questions or concerns, please contact us at ", { text: "jdeese@flashweather.ai", href: "mailto:jdeese@flashweather.ai" }, "."] },
  ],
  preamble: [
    {
      id: "summary-of-key-points",
      heading: "SUMMARY OF KEY POINTS",
      blocks: [
        { type: 'paragraph', text: ["This summary provides key points from our privacy notice, but you can find out more details about any of these topics by clicking the link following each key point or by using our table of contents below to find the section you are looking for."] },
        { type: 'paragraph', text: [{ text: "What personal information do we process?", strong: true }, " When you visit, use, or navigate our Services, we may process personal information depending on how you interact with us and the Services, the choices you make, and the products and features you use. ", { text: "Learn more about personal information you disclose to us.", href: "#what-information-do-we-collect" }] },
        { type: 'paragraph', text: [{ text: "Do we process any sensitive personal information?", strong: true }, " We do not process sensitive personal information."] },
        { type: 'paragraph', text: [{ text: "Do we receive any information from third parties?", strong: true }, " We do not receive any information from third parties."] },
        { type: 'paragraph', text: [{ text: "How do we process your information?", strong: true }, " We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent. We process your information only when we have a valid legal reason to do so. ", { text: "Learn more about how we process your information.", href: "#how-do-we-process-your-information" }] },
        { type: 'paragraph', text: [{ text: "In what situations and with which parties do we share personal information?", strong: true }, " We may share information in specific situations and with specific third parties. ", { text: "Learn more about when and with whom we share your personal information.", href: "#when-and-with-whom-do-we-share" }] },
        { type: 'paragraph', text: [{ text: "How do we keep your information safe?", strong: true }, " We have organizational and technical processes and procedures in place to protect your personal information. However, no electronic transmission over the internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. ", { text: "Learn more about how we keep your information safe.", href: "#how-do-we-keep-your-information-safe" }] },
        { type: 'paragraph', text: [{ text: "What are your rights?", strong: true }, " Depending on where you are located geographically, the applicable privacy law may mean you have certain rights regarding your personal information. ", { text: "Learn more about your privacy rights.", href: "#what-are-your-privacy-rights" }] },
        { type: 'paragraph', text: [{ text: "How do you exercise your rights?", strong: true }, " The easiest way to exercise your rights is by submitting a data subject access request, or by contacting us. We will consider and act upon any request in accordance with applicable data protection laws."] },
        { type: 'paragraph', text: [{ text: "Want to learn more about what we do with any information we collect?", strong: true }, " ", { text: "Review the privacy notice in full.", href: "#what-information-do-we-collect" }] },
      ],
    },
  ],
  tocHeading: "TABLE OF CONTENTS",
  sections: [
    {
      id: "what-information-do-we-collect",
      heading: "1. WHAT INFORMATION DO WE COLLECT?",
      tocLabel: "1. WHAT INFORMATION DO WE COLLECT?",
      blocks: [
        { type: 'subheading', text: "Personal information you disclose to us" },
        { type: 'inShort', text: "In Short: We collect personal information that you provide to us." },
        { type: 'paragraph', text: ["We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us."] },
        { type: 'paragraph', text: ["Personal Information Provided by You. The personal information that we collect depends on the context of your interactions with us and the Services, the choices you make, and the products and features you use. The personal information we collect may include the following:"] },
        { type: 'list', items: [["Names"], ["Phone numbers"], ["Email addresses"], ["Mailing addresses"], ["Usernames"], ["Passwords"], ["Contact preferences"], ["Contact or authentication data"], ["Billing addresses"], ["Debit/credit card numbers"], ["Sensitive Information. We do not process sensitive information."]] },
        { type: 'paragraph', text: ["Payment Data. We may collect data necessary to process your payment if you make purchases, such as your payment instrument number, and the security code associated with your payment instrument. All payment data is stored by Stripe. You may find their privacy notice link(s) here: ", { text: "https://stripe.com/privacy", href: "https://stripe.com/privacy" }, "."] },
        { type: 'paragraph', text: ["Social Media Login Data. We may provide you with the option to register with us using your existing social media account details, like your Facebook, Twitter, or other social media account. If you choose to register in this way, we will collect the information described in the section called “HOW DO WE HANDLE YOUR SOCIAL LOGINS?” below."] },
        { type: 'paragraph', text: ["Application Data. If you use our application(s), we also may collect the following information if you choose to provide us with access or permission:"] },
        { type: 'paragraph', text: ["Geolocation Information. We may request access or permission to track location-based information from your mobile device, either continuously or while you are using our mobile application(s), to provide certain location-based services. If you wish to change our access or permissions, you may do so in your device’s settings."] },
        { type: 'paragraph', text: ["Push Notifications. We may request to send you push notifications regarding your account or certain features of the application(s). If you wish to opt out from receiving these types of communications, you may turn them off in your device’s settings."] },
        { type: 'paragraph', text: ["This information is primarily needed to maintain the security and operation of our application(s), for troubleshooting, and for our internal analytics and reporting purposes."] },
        { type: 'paragraph', text: ["All personal information that you provide to us must be true, complete, and accurate, and you must notify us of any changes to such personal information."] },
        { type: 'subheading', text: "Information automatically collected" },
        { type: 'inShort', text: "In Short: Some information — such as your Internet Protocol (IP) address and/or browser and device characteristics — is collected automatically when you visit our Services." },
        { type: 'paragraph', text: ["We automatically collect certain information when you visit, use, or navigate the Services. This information does not reveal your specific identity (like your name or contact information) but may include device and usage information, such as your IP address, browser and device characteristics, operating system, language preferences, referring URLs, device name, country, location, information about how and when you use our Services, and other technical information. This information is primarily needed to maintain the security and operation of our Services, and for our internal analytics and reporting purposes."] },
        { type: 'paragraph', text: ["The information we collect includes:"] },
        { type: 'paragraph', text: ["Location Data. We collect location data such as information about your device’s location, which can be either precise or imprecise. How much information we collect depends on the type and settings of the device you use to access the Services. For example, we may use GPS and other technologies to collect geolocation data that tells us your current location (based on your IP address). You can opt out of allowing us to collect this information either by refusing access to the information or by disabling your Location setting on your device. However, if you choose to opt out, you may not be able to use certain aspects of the Services."] },
      ],
    },
    {
      id: "how-do-we-process-your-information",
      heading: "2. HOW DO WE PROCESS YOUR INFORMATION?",
      tocLabel: "2. HOW DO WE PROCESS YOUR INFORMATION?",
      blocks: [
        { type: 'inShort', text: "In Short: We process your information to provide, improve, and administer our Services, communicate with you, for security and fraud prevention, and to comply with law. We may also process your information for other purposes with your consent." },
        { type: 'paragraph', text: ["We process your personal information for a variety of reasons, depending on how you interact with our Services, including:"] },
        { type: 'list', items: [["To facilitate account creation and authentication and otherwise manage user accounts. We may process your information so you can create and log in to your account, as well as keep your account in working order."], ["To deliver and facilitate delivery of services to the user. We may process your information to provide you with the requested service."], ["To request feedback. We may process your information when necessary to request feedback and to contact you about your use of our Services."], ["To send you marketing and promotional communications. We may process the personal information you send to us for our marketing purposes, if this is in accordance with your marketing preferences. You can opt out of our marketing emails at any time. For more information, see “WHAT ARE YOUR PRIVACY RIGHTS?” below."], ["To deliver targeted advertising to you. We may process your information to develop and display personalized content and advertising tailored to your interests, location, and more."], ["To post testimonials. We post testimonials on our Services that may contain personal information."], ["To evaluate and improve our Services, products, marketing, and your experience. We may process your information when we believe it is necessary to identify usage trends, determine the effectiveness of our promotional campaigns, and to evaluate and improve our Services, products, marketing, and your experience."], ["To identify usage trends. We may process information about how you use our Services to better understand how they are being used so we can improve them."]] },
      ],
    },
    {
      id: "what-legal-bases-do-we-rely-on",
      heading: "3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR INFORMATION?",
      tocLabel: "3. WHAT LEGAL BASES DO WE RELY ON TO PROCESS YOUR PERSONAL INFORMATION?",
      blocks: [
        { type: 'inShort', text: "In Short: We only process your personal information when we believe it is necessary and we have a valid legal reason (i.e., legal basis) to do so under applicable law, like with your consent, to comply with laws, to provide you with services to enter into or fulfill our contractual obligations, to protect your rights, or to fulfill our legitimate business interests." },
        { type: 'paragraph', text: ["If you are located in Canada, this section applies to you."] },
        { type: 'paragraph', text: ["We may process your information if you have given us specific permission (i.e., express consent) to use your personal information for a specific purpose, or in situations where your permission can be inferred (i.e., implied consent). You can withdraw your consent at any time."] },
        { type: 'paragraph', text: ["In some exceptional cases, we may be legally permitted under applicable law to process your information without your consent, including, for example:"] },
        { type: 'list', items: [["If collection is clearly in the interests of an individual and consent cannot be obtained in a timely way"], ["For investigations and fraud detection and prevention"], ["For business transactions provided certain conditions are met"], ["If it is contained in a witness statement and the collection is necessary to assess, process, or settle an insurance claim"], ["For identifying injured, ill, or deceased persons and communicating with next of kin"], ["If we have reasonable grounds to believe an individual has been, is, or may be victim of financial abuse"], ["If it is reasonable to expect collection and use with consent would compromise the availability or the accuracy of the information and the collection is reasonable for purposes related to investigating a breach of an agreement or a contravention of the laws of Canada or a province"], ["If disclosure is required to comply with a subpoena, warrant, court order, or rules of the court relating to the production of records"], ["If it was produced by an individual in the course of their employment, business, or profession and the collection is consistent with the purposes for which the information was produced"], ["If the collection is solely for journalistic, artistic, or literary purposes"], ["If the information is publicly available and is specified by the regulations"]] },
      ],
    },
    {
      id: "when-and-with-whom-do-we-share",
      heading: "4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?",
      tocLabel: "4. WHEN AND WITH WHOM DO WE SHARE YOUR PERSONAL INFORMATION?",
      blocks: [
        { type: 'inShort', text: "In Short: We may share information in specific situations described in this section and/or with the following third parties." },
        { type: 'paragraph', text: ["We may need to share your personal information in the following situations:"] },
        { type: 'list', items: [["Business Transfers. We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company."]] },
      ],
    },
    {
      id: "third-party-websites",
      heading: "5. WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?",
      tocLabel: "5. WHAT IS OUR STANCE ON THIRD-PARTY WEBSITES?",
      blocks: [
        { type: 'inShort', text: "In Short: We are not responsible for the safety of any information that you share with third parties that we may link to or who advertise on our Services, but are not affiliated with, our Services." },
        { type: 'paragraph', text: ["The Services may link to third-party websites, online services, or mobile applications and/or contain advertisements from third parties that are not affiliated with us and which may link to other websites, services, or applications. Accordingly, we do not make any guarantee regarding any such third parties, and we will not be liable for any loss or damage caused by the use of such third-party websites, services, or applications. The inclusion of a link towards a third-party website, service, or application does not imply an endorsement by us. We cannot guarantee the safety and privacy of data you provide to any third parties. Any data collected by third parties is not covered by this privacy notice. We are not responsible for the content or privacy and security practices and policies of any third parties, including other websites, services, or applications that may be linked to or from the Services. You should review the policies of such third parties and contact them directly to respond to your questions."] },
      ],
    },
    {
      id: "social-logins",
      heading: "6. HOW DO WE HANDLE YOUR SOCIAL LOGINS?",
      tocLabel: "6. HOW DO WE HANDLE YOUR SOCIAL LOGINS?",
      blocks: [
        { type: 'inShort', text: "In Short: If you choose to register or log in to our Services using a social media account, we may have access to certain information about you." },
        { type: 'paragraph', text: ["Our Services offer you the ability to register and log in using your third-party social media account details (like your Facebook or Twitter logins). Where you choose to do this, we will receive certain profile information about you from your social media provider. The profile information we receive may vary depending on the social media provider concerned, but will often include your name, email address, friends list, and profile picture, as well as other information you choose to make public on such a social media platform."] },
        { type: 'paragraph', text: ["We will use the information we receive only for the purposes that are described in this privacy notice or that are otherwise made clear to you on the relevant Services. Please note that we do not control, and are not responsible for, other uses of your personal information by your third-party social media provider. We recommend that you review their privacy notice to understand how they collect, use, and share your personal information, and how you can set your privacy preferences on their sites and apps."] },
      ],
    },
    {
      id: "how-long-do-we-keep-your-information",
      heading: "7. HOW LONG DO WE KEEP YOUR INFORMATION?",
      tocLabel: "7. HOW LONG DO WE KEEP YOUR INFORMATION?",
      blocks: [
        { type: 'inShort', text: "In Short: We keep your information for as long as necessary to fulfill the purposes outlined in this privacy notice unless otherwise required by law." },
        { type: 'paragraph', text: ["We will only keep your personal information for as long as it is necessary for the purposes set out in this privacy notice, unless a longer retention period is required or permitted by law (such as tax, accounting, or other legal requirements). No purpose in this notice will require us keeping your personal information for longer than the period of time in which users have an account with us."] },
        { type: 'paragraph', text: ["When we have no ongoing legitimate business need to process your personal information, we will either delete or anonymize such information, or, if this is not possible (for example, because your personal information has been stored in backup archives), then we will securely store your personal information and isolate it from any further processing until deletion is possible."] },
      ],
    },
    {
      id: "how-do-we-keep-your-information-safe",
      heading: "8. HOW DO WE KEEP YOUR INFORMATION SAFE?",
      tocLabel: "8. HOW DO WE KEEP YOUR INFORMATION SAFE?",
      blocks: [
        { type: 'inShort', text: "In Short: We aim to protect your personal information through a system of organizational and technical security measures." },
        { type: 'paragraph', text: ["We have implemented appropriate and reasonable technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure, so we cannot promise or guarantee that hackers, cybercriminals, or other unauthorized third parties will not be able to defeat our security and improperly collect, access, steal, or modify your information. Although we will do our best to protect your personal information, transmission of personal information to and from our Services is at your own risk. You should only access the Services within a secure environment."] },
      ],
    },
    {
      id: "do-we-collect-information-from-minors",
      heading: "9. DO WE COLLECT INFORMATION FROM MINORS?",
      tocLabel: "9. DO WE COLLECT INFORMATION FROM MINORS?",
      blocks: [
        { type: 'inShort', text: "In Short: We do not knowingly collect data from or market to children under 18 years of age." },
        { type: 'paragraph', text: ["We do not knowingly solicit data from or market to children under 18 years of age. By using the Services, you represent that you are at least 18 or that you are the parent or guardian of such a minor and consent to such minor dependent’s use of the Services. If we learn that personal information from users less than 18 years of age has been collected, we will deactivate the account and take reasonable measures to promptly delete such data from our records. If you become aware of any data we may have collected from children under age 18, please contact us at ", { text: "jdeese@flashweather.ai", href: "mailto:jdeese@flashweather.ai" }, "."] },
      ],
    },
    {
      id: "what-are-your-privacy-rights",
      heading: "10. WHAT ARE YOUR PRIVACY RIGHTS?",
      tocLabel: "10. WHAT ARE YOUR PRIVACY RIGHTS?",
      blocks: [
        { type: 'inShort', text: "In Short: In some regions, such as Canada, you have rights that allow you greater access to and control over your personal information. You may review, change, or terminate your account at any time." },
        { type: 'paragraph', text: ["In some regions (like Canada), you have certain rights under applicable data protection laws. These may include the right (i) to request access and obtain a copy of your personal information, (ii) to request rectification or erasure; (iii) to restrict the processing of your personal information; (vi) if applicable, to data portability; and (vii) not to be subject to automated decision-making. In certain circumstances, you may also have the right to object to the processing of your personal information. You can make such a request by contacting us by using the contact details provided in the section “HOW CAN YOU CONTACT US ABOUT THIS NOTICE?” below."] },
        { type: 'paragraph', text: ["We will consider and act upon any request in accordance with applicable data protection laws."] },
        { type: 'paragraph', text: ["Withdrawing your consent: If we are relying on your consent to process your personal information, which may be express and/or implied consent depending on the applicable law, you have the right to withdraw your consent at any time. You can withdraw your consent at any time by contacting us by using the contact details provided in the section “HOW CAN YOU CONTACT US ABOUT THIS NOTICE?” below."] },
        { type: 'paragraph', text: ["However, please note that this will not affect the lawfulness of the processing before its withdrawal nor, when applicable law allows, will it affect the processing of your personal information conducted in reliance on lawful processing grounds other than consent."] },
        { type: 'paragraph', text: ["Opting out of marketing and promotional communications: You can unsubscribe from our marketing and promotional communications at any time by clicking on the unsubscribe link in the emails that we send, or by contacting us using the details provided in the section “HOW CAN YOU CONTACT US ABOUT THIS NOTICE?” below. You will then be removed from the marketing lists. However, we may still communicate with you — for example, to send you service-related messages that are necessary for the administration and use of your account, to respond to service requests, or for other non-marketing purposes."] },
        { type: 'subheading', text: "Account Information" },
        { type: 'paragraph', text: ["If you would at any time like to review or change the information in your account or terminate your account, you can:"] },
        { type: 'list', items: [["Log in to your account settings and update your user account."]] },
        { type: 'paragraph', text: ["Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, we may retain some information in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our legal terms and/or comply with applicable legal requirements."] },
        { type: 'paragraph', text: ["If you have questions or comments about your privacy rights, you may email us at ", { text: "jdeese@flashweather.ai", href: "mailto:jdeese@flashweather.ai" }, "."] },
      ],
    },
    {
      id: "do-not-track",
      heading: "11. CONTROLS FOR DO-NOT-TRACK FEATURES",
      tocLabel: "11. CONTROLS FOR DO-NOT-TRACK FEATURES",
      blocks: [
        { type: 'paragraph', text: ["Most web browsers and some mobile operating systems and mobile applications include a Do-Not-Track (“DNT”) feature or setting you can activate to signal your privacy preference not to have data about your online browsing activities monitored and collected. At this stage no uniform technology standard for recognizing and implementing DNT signals has been finalized. As such, we do not currently respond to DNT browser signals or any other mechanism that automatically communicates your choice not to be tracked online. If a standard for online tracking is adopted that we must follow in the future, we will inform you about that practice in a revised version of this privacy notice."] },
      ],
    },
    {
      id: "california-privacy-rights",
      heading: "12. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?",
      tocLabel: "12. DO CALIFORNIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?",
      blocks: [
        { type: 'inShort', text: "In Short: Yes, if you are a resident of California, you are granted specific rights regarding access to your personal information." },
        { type: 'paragraph', text: ["California Civil Code Section 1798.83, also known as the “Shine The Light” law, permits our users who are California residents to request and obtain from us, once a year and free of charge, information about categories of personal information (if any) we disclosed to third parties for direct marketing purposes and the names and addresses of all third parties with which we shared personal information in the immediately preceding calendar year. If you are a California resident and would like to make such a request, please submit your request in writing to us using the contact information provided below."] },
        { type: 'paragraph', text: ["If you are under 18 years of age, reside in California, and have a registered account with Services, you have the right to request removal of unwanted data that you publicly post on the Services. To request removal of such data, please contact us using the contact information provided below and include the email address associated with your account and a statement that you reside in California. We will make sure the data is not publicly displayed on the Services, but please be aware that the data may not be completely or comprehensively removed from all our systems (e.g., backups, etc.)."] },
        { type: 'subheading', text: "CCPA Privacy Notice" },
        { type: 'paragraph', text: ["The California Code of Regulations defines a “resident” as:"] },
        { type: 'list', items: [["(1) every individual who is in the State of California for other than a temporary or transitory purpose and"], ["(2) every individual who is domiciled in the State of California who is outside the State of California for a temporary or transitory purpose"]] },
        { type: 'paragraph', text: ["All other individuals are defined as “non-residents.”"] },
        { type: 'paragraph', text: ["If this definition of “resident” applies to you, we must adhere to certain rights and obligations regarding your personal information."] },
        { type: 'subheading', text: "What categories of personal information do we collect?" },
        { type: 'paragraph', text: ["We have collected the following categories of personal information in the past twelve (12) months:"] },
        { type: 'table', caption: 'Categories of personal information collected in the past twelve (12) months', columns: ["Category", "Examples", "Collected"], rows: [["A. Identifiers", "Contact details, such as real name, alias, postal address, telephone or mobile contact number, unique personal identifier, online identifier, Internet Protocol address, email address, and account name", "NO"], ["B. Personal information categories listed in the California Customer Records statute", "Name, contact information, education, employment, employment history, and financial information", "NO"], ["C. Protected classification characteristics under California or federal law", "Gender and date of birth", "NO"], ["D. Commercial information", "Transaction information, purchase history, financial details, and payment information", "NO"], ["E. Biometric information", "Fingerprints and voiceprints", "NO"], ["F. Internet or other similar network activity", "Browsing history, search history, online behavior, interest data, and interactions with our and other websites, applications, systems, and advertisements", "NO"], ["G. Geolocation data", "Device location", "NO"], ["H. Audio, electronic, visual, thermal, olfactory, or similar information", "Images and audio, video or call recordings created in connection with our business activities", "NO"], ["I. Professional or employment-related information", "Business contact details in order to provide you our Services at a business level or job title, work history, and professional qualifications if you apply for a job with us", "NO"], ["J. Education Information", "Student records and directory information", "NO"], ["K. Inferences drawn from other personal information", "Inferences drawn from any of the collected personal information listed above to create a profile or summary about, for example, an individual’s preferences and characteristics", "NO"], ["L. Sensitive Personal Information", "", "NO"]] },
        { type: 'paragraph', text: ["We may also collect other personal information outside of these categories through instances where you interact with us in person, online, or by phone or mail in the context of:"] },
        { type: 'list', items: [["Receiving help through our customer support channels;"], ["Participation in customer surveys or contests; and"], ["Facilitation in the delivery of our Services and to respond to your inquiries."]] },
        { type: 'subheading', text: "How do we use and share your personal information?" },
        { type: 'paragraph', text: ["More information about our data collection and sharing practices can be found in this privacy notice."] },
        { type: 'paragraph', text: ["You may contact us by email at ", { text: "jdeese@flashweather.ai", href: "mailto:jdeese@flashweather.ai" }, ", or by referring to the contact details at the bottom of this document."] },
        { type: 'paragraph', text: ["If you are using an authorized agent to exercise your right to opt out we may deny a request if the authorized agent does not submit proof that they have been validly authorized to act on your behalf."] },
        { type: 'subheading', text: "Will your information be shared with anyone else?" },
        { type: 'paragraph', text: ["We may disclose your personal information with our service providers pursuant to a written contract between us and each service provider. Each service provider is a for-profit entity that processes the information on our behalf, following the same strict privacy protection obligations mandated by the CCPA."] },
        { type: 'paragraph', text: ["We may use your personal information for our own business purposes, such as for undertaking internal research for technological development and demonstration. This is not considered to be “selling” of your personal information."] },
        { type: 'paragraph', text: ["We have not disclosed, sold, or shared any personal information to third parties for a business or commercial purpose in the preceding twelve (12) months. We will not sell or share personal information in the future belonging to website visitors, users, and other consumers."] },
        { type: 'subheading', text: "Your rights with respect to your personal data" },
        { type: 'minorHeading', text: "Right to request deletion of the data — Request to delete" },
        { type: 'paragraph', text: ["You can ask for the deletion of your personal information. If you ask us to delete your personal information, we will respect your request and delete your personal information, subject to certain exceptions provided by law, such as (but not limited to) the exercise by another consumer of his or her right to free speech, our compliance requirements resulting from a legal obligation, or any processing that may be required to protect against illegal activities."] },
        { type: 'minorHeading', text: "Right to be informed — Request to know" },
        { type: 'paragraph', text: ["Depending on the circumstances, you have a right to know:"] },
        { type: 'list', items: [["whether we collect and use your personal information;"], ["the categories of personal information that we collect;"], ["the purposes for which the collected personal information is used;"], ["whether we sell or share personal information to third parties;"], ["the categories of personal information that we sold, shared, or disclosed for a business purpose;"], ["the categories of third parties to whom the personal information was sold, shared, or disclosed for a business purpose;"], ["the business or commercial purpose for collecting, selling, or sharing personal information; and"], ["the specific pieces of personal information we collected about you."]] },
        { type: 'paragraph', text: ["In accordance with applicable law, we are not obligated to provide or delete consumer information that is de-identified in response to a consumer request or to re-identify individual data to verify a consumer request."] },
        { type: 'minorHeading', text: "Right to Non-Discrimination for the Exercise of a Consumer’s Privacy Rights" },
        { type: 'paragraph', text: ["We will not discriminate against you if you exercise your privacy rights."] },
        { type: 'minorHeading', text: "Right to Limit Use and Disclosure of Sensitive Personal Information" },
        { type: 'paragraph', text: ["We do not process consumer’s sensitive personal information."] },
        { type: 'subheading', text: "Verification process" },
        { type: 'paragraph', text: ["Upon receiving your request, we will need to verify your identity to determine you are the same person about whom we have the information in our system. These verification efforts require us to ask you to provide information so that we can match it with information you have previously provided us. For instance, depending on the type of request you submit, we may ask you to provide certain information so that we can match the information you provide with the information we already have on file, or we may contact you through a communication method (e.g., phone or email) that you have previously provided to us. We may also use other verification methods as the circumstances dictate."] },
        { type: 'paragraph', text: ["We will only use personal information provided in your request to verify your identity or authority to make the request. To the extent possible, we will avoid requesting additional information from you for the purposes of verification. However, if we cannot verify your identity from the information already maintained by us, we may request that you provide additional information for the purposes of verifying your identity and for security or fraud-prevention purposes. We will delete such additionally provided information as soon as we finish verifying you."] },
        { type: 'subheading', text: "Other privacy rights" },
        { type: 'list', items: [["You may object to the processing of your personal information."], ["You may request correction of your personal data if it is incorrect or no longer relevant, or ask to restrict the processing of the information."], ["You can designate an authorized agent to make a request under the CCPA on your behalf. We may deny a request from an authorized agent that does not submit proof that they have been validly authorized to act on your behalf in accordance with the CCPA."], ["You may request to opt out from future selling or sharing of your personal information to third parties. Upon receiving an opt-out request, we will act upon the request as soon as feasibly possible, but no later than fifteen (15) days from the date of the request submission."]] },
        { type: 'paragraph', text: ["To exercise these rights, you can contact us by email at ", { text: "jdeese@flashweather.ai", href: "mailto:jdeese@flashweather.ai" }, ", or by referring to the contact details at the bottom of this document. If you have a complaint about how we handle your data, we would like to hear from you."] },
      ],
    },
    {
      id: "virginia-privacy-rights",
      heading: "13. DO VIRGINIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?",
      tocLabel: "13. DO VIRGINIA RESIDENTS HAVE SPECIFIC PRIVACY RIGHTS?",
      blocks: [
        { type: 'inShort', text: "In Short: Yes, if you are a resident of Virginia, you may be granted specific rights regarding access to and use of your personal information." },
        { type: 'subheading', text: "Virginia CDPA Privacy Notice" },
        { type: 'paragraph', text: ["Under the Virginia Consumer Data Protection Act (CDPA):"] },
        { type: 'list', items: [["“Consumer” means a natural person who is a resident of the Commonwealth acting only in an individual or household context. It does not include a natural person acting in a commercial or employment context."], ["“Personal data” means any information that is linked or reasonably linkable to an identified or identifiable natural person. “Personal data” does not include de-identified data or publicly available information."], ["“Sale of personal data” means the exchange of personal data for monetary consideration."]] },
        { type: 'paragraph', text: ["If this definition “consumer” applies to you, we must adhere to certain rights and obligations regarding your personal data."] },
        { type: 'paragraph', text: ["The information we collect, use, and disclose about you will vary depending on how you interact with us and our Services. To find out more, please visit the following links:"] },
        { type: 'list', items: [["Personal data we collect"], ["How we use your personal data"], ["When and with whom we share your personal data"]] },
        { type: 'subheading', text: "Your rights with respect to your personal data" },
        { type: 'list', items: [["Right to be informed whether or not we are processing your personal data"], ["Right to access your personal data"], ["Right to correct inaccuracies in your personal data"], ["Right to request deletion of your personal data"], ["Right to obtain a copy of the personal data you previously shared with us"], ["Right to opt out of the processing of your personal data if it is used for targeted advertising, the sale of personal data, or profiling in furtherance of decisions that produce legal or similarly significant effects (“profiling”)"]] },
        { type: 'paragraph', text: ["We sell personal data to third parties or process personal data for targeted advertising. Please see the following section to find out how you can opt out from further selling or sharing of your personal data for targeted advertising or profiling purposes."] },
        { type: 'subheading', text: "Exercise your rights provided under the Virginia CDPA" },
        { type: 'paragraph', text: ["More information about our data collection and sharing practices can be found in this privacy notice."] },
        { type: 'paragraph', text: ["You can opt out from the selling of your personal data, targeted advertising, or profiling by disabling cookies in Cookie Preference Settings. You may contact us by email at ", { text: "jdeese@flashweather.ai", href: "mailto:jdeese@flashweather.ai" }, ", by submitting a data subject access request, or by referring to the contact details at the bottom of this document."] },
        { type: 'paragraph', text: ["If you are using an authorized agent to exercise your rights, we may deny a request if the authorized agent does not submit proof that they have been validly authorized to act on your behalf."] },
        { type: 'subheading', text: "Verification process" },
        { type: 'paragraph', text: ["We may request that you provide additional information reasonably necessary to verify you and your consumer’s request. If you submit the request through an authorized agent, we may need to collect additional information to verify your identity before processing your request."] },
        { type: 'paragraph', text: ["Upon receiving your request, we will respond without undue delay, but in all cases, within forty-five (45) days of receipt. The response period may be extended once by forty-five (45) additional days when reasonably necessary. We will inform you of any such extension within the initial 45-day response period, together with the reason for the extension."] },
        { type: 'subheading', text: "Right to appeal" },
        { type: 'paragraph', text: ["If we decline to take action regarding your request, we will inform you of our decision and reasoning behind it. If you wish to appeal our decision, please email us at ", { text: "jdeese@flashweather.ai", href: "mailto:jdeese@flashweather.ai" }, ". Within sixty (60) days of receipt of an appeal, we will inform you in writing of any action taken or not taken in response to the appeal, including a written explanation of the reasons for the decisions. If your appeal if denied, you may contact the Attorney General to submit a complaint."] },
      ],
    },
    {
      id: "updates-to-this-notice",
      heading: "14. DO WE MAKE UPDATES TO THIS NOTICE?",
      tocLabel: "14. DO WE MAKE UPDATES TO THIS NOTICE?",
      blocks: [
        { type: 'inShort', text: "In Short: Yes, we will update this notice as necessary to stay compliant with relevant laws." },
        { type: 'paragraph', text: ["We may update this privacy notice from time to time. The updated version will be indicated by an updated “Revised” date and the updated version will be effective as soon as it is accessible. If we make material changes to this privacy notice, we may notify you either by prominently posting a notice of such changes or by directly sending you a notification. We encourage you to review this privacy notice frequently to be informed of how we are protecting your information."] },
      ],
    },
    {
      id: "how-can-you-contact-us",
      heading: "15. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?",
      tocLabel: "15. HOW CAN YOU CONTACT US ABOUT THIS NOTICE?",
      blocks: [
        { type: 'paragraph', text: ["If you have questions or comments about this notice, you may email us at ", { text: "jdeese@flashweather.ai", href: "mailto:jdeese@flashweather.ai" }, " or contact us by post at:"] },
        { type: 'address', lines: ["FLASH Weather AI", "135 Star Street", "Pounding Mill, VA 24637", "United States"] },
      ],
    },
    {
      id: "review-update-or-delete-your-data",
      heading: "16. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?",
      tocLabel: "16. HOW CAN YOU REVIEW, UPDATE, OR DELETE THE DATA WE COLLECT FROM YOU?",
      blocks: [
        { type: 'paragraph', text: ["Based on the applicable laws of your country, you may have the right to request access to the personal information we collect from you, change that information, or delete it. To request to review, update, or delete your personal information, please fill out and submit a data subject access request."] },
      ],
    },
  ],
};

export const legalInformation: LegalDocument = {
  path: '/flash-weather-ai-legal-information/',
  title: 'Legal information',
  description:
    'Flash Weather AI legal terms: trademarks, US-dollar pricing, the 14-day refund and cancellation policy, and the disclaimer on weather information we provide.',
  label: 'Legal information',
  headline: 'Flash Weather AI Legal Information',
  lastUpdated: { label: "Last updated: July 11, 2024", iso: '2024-07-11' },
  intro: [
    { type: 'paragraph', text: ["All of our customer-facing documents are here for you to review and for your convenience."] },
    { type: 'paragraph', text: ["Flash Weather AI and other marks indicated on our website are trademarks or registered trademarks of Flash Weather AI Inc. or its subsidiaries in the United States of America and other territories."] },
    { type: 'paragraph', text: ["In addition, graphics, logos, page headers, button icons, scripts, and service names included in or made available through the service are trademarks of Flash Weather AI. Flash Weather AI’s trademarks may not be used in connection with any product or service that is not Flash Weather AI’s, in any manner likely to confuse customers, or in any manner that disparages or discredits Flash Weather AI."] },
    { type: 'paragraph', text: ["All other trademarks that appear in the service that Flash Weather AI does not own are the property of their respective owners. These owners may or may not be affiliated with, connected to, or sponsored by Flash Weather AI."] },
    { type: 'paragraph', text: [{ text: "Terms of Service:", strong: true }, " By using our service, you agree to comply with our Terms of Service. These terms outline your responsibilities and the scope of services provided by Flash Weather AI."] },
    { type: 'paragraph', text: [{ text: "Pricing:", strong: true }, " All transactions will be in US dollars."] },
    { type: 'paragraph', text: [{ text: "Refund Policy:", strong: true }, " We offer a full money-back guarantee for all purchases made from Flash Weather AI. If you are not satisfied with your purchase of the Flash software for any reason, you can request a refund, no questions asked. Refund requests must be made within 14 calendar days of the original purchase. After this 14-day period, you will no longer be eligible for a refund. We encourage you to fully try our product during this time to ensure it meets your needs."] },
    { type: 'paragraph', text: [{ text: "Cancellation Policy:", strong: true }, " You may cancel your subscription or service with Flash Weather AI anytime. If you choose to cancel within the initial 14-day period, you are eligible for a full refund under our Refund Policy."] },
    { type: 'paragraph', text: ["Cancellations made after the 14 days will not be eligible for a refund, but you will retain access to the service until the end of the current billing cycle. No further charges will be applied after the cancellation."] },
    { type: 'paragraph', text: ["To cancel your subscription or service, please contact us at ", { text: site.email, href: `mailto:${site.email}` }, ". If you have any additional questions regarding cancellations, feel free to reach out to us."] },
    { type: 'paragraph', text: [{ text: "Privacy Policy:", strong: true }, " Your privacy is important to us. Our ", { text: "Privacy Policy", href: "/privacy-policy/" }, " explains how we collect, use, store, and protect your data in compliance with applicable laws."] },
    { type: 'paragraph', text: [{ text: "Disclaimer of Warranties:", strong: true }, " The service is provided “as is” without any warranties. Flash Weather AI disclaims any warranties regarding the content’s accuracy, reliability, or completeness."] },
    { type: 'paragraph', text: [{ text: "Limitation of Liability:", strong: true }, " Flash Weather AI is not liable for any damages caused by using the service."] },
    { type: 'paragraph', text: [{ text: "Governing Law:", strong: true }, " Any disputes arising from the service will be governed by the laws of the State of Georgia, USA."] },
    { type: 'paragraph', text: [{ text: "Copyright Notice:", strong: true }, " All content on this website is the property of Flash Weather AI and is protected by copyright laws. Unauthorized use of the content is prohibited."] },
    { type: 'paragraph', text: [{ text: "User-Generated Content:", strong: true }, " Users who post content on our service are responsible for their submissions. Flash Weather AI does not endorse user-generated content and is not liable for it."] },
    { type: 'paragraph', text: [{ text: "Modification of Terms:", strong: true }, " Flash Weather AI reserves the right to modify these terms anytime. Users may or may not be notified of any changes."] },
    { type: 'paragraph', text: [{ text: "Weather Information Disclaimer:", strong: true }, " Weather information provided by Flash, including forecasts, alerts, and analyses, is for ", { text: "general informational and basic advisory purposes only", strong: true }, ". ", { text: "All calls to action are for advisory purposes only and should not be considered directives.", strong: true }] },
    { type: 'paragraph', text: ["While Flash strives for accuracy, weather conditions can change rapidly, and the Company ", { text: "makes no guarantees regarding the completeness, accuracy, timeliness, or reliability", strong: true }, " of any data. Users are ", { text: "solely responsible for decisions", strong: true }, " made based on this information."] },
    { type: 'paragraph', text: [{ text: "Always consult official sources", strong: true }, ", such as the ", { text: "National Weather Service, local authorities, or other professional guidance", strong: true }, ", for critical safety or operational actions. Flash and its affiliates ", { text: "assume no liability for any damages, losses, or actions taken in reliance on this information. Users", strong: true }, " agree to use the app at their own risk."] },
    { type: 'paragraph', text: ["Contact us if you have any questions at ", { text: site.email, href: `mailto:${site.email}` }, "."] },
  ],
  preamble: [],
  sections: [],
};

export const legalDocuments = [privacyPolicy, legalInformation];
