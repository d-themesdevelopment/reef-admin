import { c as createComponent, r as renderTemplate, e as renderComponent, f as createAstro } from '../astro_DWLa3mAM.mjs';
import 'kleur/colors';
import 'html-escaper';
import { g as getCurrentUser, u as userStore, $ as $$Layout } from './employees_BL15NJAH.mjs';
import { f as fetchApi } from './index_gmj3xhdU.mjs';

const $$Astro = createAstro();
const $$Settings = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Settings;
  if (!Astro2.cookies.has("reef_token")) {
    return Astro2.redirect("/signin");
  }
  const strapiUrl = "https://reef-backend-34b3ed81e4c2.herokuapp.com";
  const strapiToken = "8ec72496bc52e747626a47e6344a946ce2dc25da334b5e3a37e813f5fef68b000beebe1f357ae988a0342809fbeb8bd352fef5bf91becd2d88eea084dce221c958ff474278236506126096dd15df4a65232a483082fd0f48986df88529d7dfb93eb1490ef30d90bf275e3c1d9476d0a9f12d0768a312ed84edca26a3f606fc30";
  const profilePageData = await fetchApi({
    endpoint: "profile-page",
    // the content type to fetch
    query: {
      populate: {
        firstName: {
          populate: "*"
        },
        lastName: {
          populate: "*"
        },
        title: {
          populate: "*"
        },
        phoneNumber: {
          populate: "*"
        },
        email: {
          populate: "*"
        },
        newPassword: {
          populate: "*"
        },
        currentPassword: {
          populate: "*"
        }
      }
    },
    apiUrl: strapiUrl,
    apiToken: strapiToken,
    locale: "ar"
  });
  const $user = await getCurrentUser(
    Astro2.cookies.get("reef_token")?.value
  );
  userStore.set($user);
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Settigns Page" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "UserSettings", null, { "user": $user ?? {}, "pageData": profilePageData?.attributes, "apiUrl": strapiUrl, "apiToken": strapiToken, "client:only": "react", "client:component-hydration": "only", "client:component-path": "D:/work/astro/1/admin/src/components/partials/UserSettings", "client:component-export": "default" })} ` })}`;
}, "D:/work/astro/1/admin/src/pages/settings.astro", void 0);
const $$file = "D:/work/astro/1/admin/src/pages/settings.astro";
const $$url = "/settings";

export { $$Settings as default, $$file as file, $$url as url };
