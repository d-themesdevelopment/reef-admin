import { c as createComponent, r as renderTemplate, e as renderComponent, f as createAstro, m as maybeRenderHead } from '../astro_CgxDHAZY.mjs';
import 'kleur/colors';
import 'html-escaper';
import { f as fetchApi } from './index_DyYv3VnO.mjs';
import { $ as $$Layout } from './employees_BKlhQ1TD.mjs';

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
    endpoint: "service-orders",
    // the content type to fetch
    query: urlParamsObject,
    apiUrl: strapiUrl,
    apiToken: strapiToken
  });
  console.log(servicesData, "servicesData");
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Service Page" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm dark:border-gray-700 sm:p-6 dark:bg-gray-800"> <!-- Card header --> <div class="items-center justify-between lg:flex"> <div class="mb-4 lg:mb-0"> <h3 class="mb-2 text-xl font-bold text-gray-900 dark:text-white">
Services
</h3> <span class="text-base font-normal text-gray-500 dark:text-gray-400">This is a list of latest Services</span> </div> <div class="items-center sm:flex"></div> </div> <!-- Table --> <div class="flex flex-col mt-6"> <div class="overflow-x-auto rounded-lg"> <div class="inline-block min-w-full align-middle"> <div class="overflow-hidden shadow sm:rounded-lg"> ${renderComponent($$result2, "ServiceTable", null, { "strapiUrl": strapiUrl, "strapiToken": strapiToken, "servicesData": servicesData, "client:only": "react", "client:component-hydration": "only", "client:component-path": "D:/work/astro/1/admin/src/components/partials/services/ServiceTable", "client:component-export": "default" })} </div> </div> </div> </div> </div> ` })}`;
}, "D:/work/astro/1/admin/src/pages/services.astro", void 0);
const $$file = "D:/work/astro/1/admin/src/pages/services.astro";
const $$url = "/services";

export { $$Services as default, $$file as file, $$url as url };
