import { c as createComponent, r as renderTemplate, e as renderComponent, f as createAstro } from '../astro_CgxDHAZY.mjs';
import 'kleur/colors';
import 'html-escaper';
import { $ as $$Layout } from './employees_BKlhQ1TD.mjs';

const $$Astro = createAstro();
const $$Signin = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Signin;
  const apiUrl = "https://reef-backend-34b3ed81e4c2.herokuapp.com";
  const apiToken = "8ec72496bc52e747626a47e6344a946ce2dc25da334b5e3a37e813f5fef68b000beebe1f357ae988a0342809fbeb8bd352fef5bf91becd2d88eea084dce221c958ff474278236506126096dd15df4a65232a483082fd0f48986df88529d7dfb93eb1490ef30d90bf275e3c1d9476d0a9f12d0768a312ed84edca26a3f606fc30";
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Sign In" }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "SignInForm", null, { "apiUrl": apiUrl, "apiToken": apiToken, "client:only": "react", "client:component-hydration": "only", "client:component-path": "D:/work/astro/1/admin/src/components/partials/auth/SignInForm", "client:component-export": "default" })} ` })}`;
}, "D:/work/astro/1/admin/src/pages/signin.astro", void 0);
const $$file = "D:/work/astro/1/admin/src/pages/signin.astro";
const $$url = "/signin";

export { $$Signin as default, $$file as file, $$url as url };
