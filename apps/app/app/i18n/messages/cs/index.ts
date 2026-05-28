import global from "./global/global.json";
import errorMessages from "./global/error-messages.json";
import homepage from "./pages/homepage.json";
import forGastro from "./pages/for-gastro.json";
import forEntertainment from "./pages/for-entertainment.json";
import forVenue from "./pages/for-venue.json";
import faq from "./pages/faq.json";
import howItWorksForCompany from "./pages/how-it-works-for-company.json";
import howItWorksForUser from "./pages/how-it-works-for-user.json";
import about from "./pages/about.json";
import contact from "./pages/contact.json";
import partnership from "./pages/partnership.json";
import pricing from "./pages/pricing.json";
import roadmap from "./pages/roadmap.json";
import addTeamMemberModal from "./components/add-team-member.modal.json";
import editTeamMemberRoleModal from "./components/edit-team-member-role.modal.json";
import spacesTypeChangeModal from "./components/spaces-type-change-modal.json";

export default {
  global,
  errorMessages,
  pages: {
    homepage,
    forGastro,
    forEntertainment,
    forVenue,
    faq,
    howItWorksForCompany,
    howItWorksForUser,
    about,
    contact,
    partnership,
    pricing,
    roadmap,
  },
  components: {
    addTeamMemberModal,
    editTeamMemberRoleModal,
    spacesTypeChangeModal,
  },
};
