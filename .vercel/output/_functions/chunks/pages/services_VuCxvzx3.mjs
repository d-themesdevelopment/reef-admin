import { c as createComponent, r as renderTemplate, e as renderComponent, f as createAstro, m as maybeRenderHead } from '../astro_DWLa3mAM.mjs';
import 'kleur/colors';
import 'html-escaper';
import { f as fetchApi } from './index_gmj3xhdU.mjs';
import { $ as $$Layout } from './employees_BL15NJAH.mjs';

const $$Astro = createAstro();
const $$Services = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Services;
  if (!Astro2.cookies.has("reef_token")) {
    return Astro2.redirect("/signin");
  }
  const urlParamsObject = {
    populate: {
      user: {
        populate: "*"
      },
      media: {
        populate: "*"
      },
      category: {
        populate: "*"
      },
      personalInformation: {
        populate: "*"
      },
      requestInformation: {
        populate: "*"
      }
    }
  };
  const strapiUrl = "https://reef-backend-34b3ed81e4c2.herokuapp.com";
  const strapiToken = "8ec72496bc52e747626a47e6344a946ce2dc25da334b5e3a37e813f5fef68b000beebe1f357ae988a0342809fbeb8bd352fef5bf91becd2d88eea084dce221c958ff474278236506126096dd15df4a65232a483082fd0f48986df88529d7dfb93eb1490ef30d90bf275e3c1d9476d0a9f12d0768a312ed84edca26a3f606fc30";
  const servicesData = await fetchApi({
    endpoint: "services",
    // the content type to fetch
    query: urlParamsObject,
    apiUrl: strapiUrl,
    apiToken: strapiToken
  });
  console.log(servicesData, "servicesData");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Services" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800"> ${renderComponent($$result2, "ServiceTable", null, { "apiUrl": strapiUrl, "apiToken": strapiToken, "servicesData": servicesData, "client:only": "react", "client:component-hydration": "only", "client:component-path": "D:/work/astro/1/admin/src/components/partials/services/ServiceTable", "client:component-export": "default" })} </div> ` })}`;
}, "D:/work/astro/1/admin/src/pages/services.astro", void 0);
const $$file = "D:/work/astro/1/admin/src/pages/services.astro";
const $$url = "/services";

export { $$Services as default, $$file as file, $$url as url };
