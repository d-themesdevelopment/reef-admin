import 'cookie';
import { bold, red, yellow, dim, blue } from 'kleur/colors';
import 'html-escaper';
import 'clsx';
import './chunks/astro_CgxDHAZY.mjs';
import { compile } from 'path-to-regexp';

const dateTimeFormat = new Intl.DateTimeFormat([], {
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false
});
const levels = {
  debug: 20,
  info: 30,
  warn: 40,
  error: 50,
  silent: 90
};
function log(opts, level, label, message, newLine = true) {
  const logLevel = opts.level;
  const dest = opts.dest;
  const event = {
    label,
    level,
    message,
    newLine
  };
  if (!isLogLevelEnabled(logLevel, level)) {
    return;
  }
  dest.write(event);
}
function isLogLevelEnabled(configuredLogLevel, level) {
  return levels[configuredLogLevel] <= levels[level];
}
function info(opts, label, message, newLine = true) {
  return log(opts, "info", label, message, newLine);
}
function warn(opts, label, message, newLine = true) {
  return log(opts, "warn", label, message, newLine);
}
function error(opts, label, message, newLine = true) {
  return log(opts, "error", label, message, newLine);
}
function debug(...args) {
  if ("_astroGlobalDebug" in globalThis) {
    globalThis._astroGlobalDebug(...args);
  }
}
function getEventPrefix({ level, label }) {
  const timestamp = `${dateTimeFormat.format(/* @__PURE__ */ new Date())}`;
  const prefix = [];
  if (level === "error" || level === "warn") {
    prefix.push(bold(timestamp));
    prefix.push(`[${level.toUpperCase()}]`);
  } else {
    prefix.push(timestamp);
  }
  if (label) {
    prefix.push(`[${label}]`);
  }
  if (level === "error") {
    return red(prefix.join(" "));
  }
  if (level === "warn") {
    return yellow(prefix.join(" "));
  }
  if (prefix.length === 1) {
    return dim(prefix[0]);
  }
  return dim(prefix[0]) + " " + blue(prefix.splice(1).join(" "));
}
if (typeof process !== "undefined") {
  let proc = process;
  if ("argv" in proc && Array.isArray(proc.argv)) {
    if (proc.argv.includes("--verbose")) ; else if (proc.argv.includes("--silent")) ; else ;
  }
}
class Logger {
  options;
  constructor(options) {
    this.options = options;
  }
  info(label, message, newLine = true) {
    info(this.options, label, message, newLine);
  }
  warn(label, message, newLine = true) {
    warn(this.options, label, message, newLine);
  }
  error(label, message, newLine = true) {
    error(this.options, label, message, newLine);
  }
  debug(label, ...messages) {
    debug(label, ...messages);
  }
  level() {
    return this.options.level;
  }
  forkIntegrationLogger(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
}
class AstroIntegrationLogger {
  options;
  label;
  constructor(logging, label) {
    this.options = logging;
    this.label = label;
  }
  /**
   * Creates a new logger instance with a new label, but the same log options.
   */
  fork(label) {
    return new AstroIntegrationLogger(this.options, label);
  }
  info(message) {
    info(this.options, this.label, message);
  }
  warn(message) {
    warn(this.options, this.label, message);
  }
  error(message) {
    error(this.options, this.label, message);
  }
  debug(message) {
    debug(this.label, message);
  }
}

function getRouteGenerator(segments, addTrailingSlash) {
  const template = segments.map((segment) => {
    return "/" + segment.map((part) => {
      if (part.spread) {
        return `:${part.content.slice(3)}(.*)?`;
      } else if (part.dynamic) {
        return `:${part.content}`;
      } else {
        return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      }
    }).join("");
  }).join("");
  let trailing = "";
  if (addTrailingSlash === "always" && segments.length) {
    trailing = "/";
  }
  const toPath = compile(template + trailing);
  return (params) => {
    const path = toPath(params);
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware(_, next) {
      return next();
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes
  };
}

const manifest = deserializeManifest({"adapterName":"@astrojs/vercel/serverless","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"inline","value":"const t=document.getElementById(\"sidebar\");if(t){const o=(s,g,i,m)=>{s.classList.toggle(\"hidden\"),g.classList.toggle(\"hidden\"),i.classList.toggle(\"hidden\"),m.classList.toggle(\"hidden\")},a=document.getElementById(\"toggleSidebarMobile\"),e=document.getElementById(\"sidebarBackdrop\"),l=document.getElementById(\"toggleSidebarMobileHamburger\"),d=document.getElementById(\"toggleSidebarMobileClose\");document.getElementById(\"toggleSidebarMobileSearch\")?.addEventListener(\"click\",()=>{o(t,e,l,d)}),a?.addEventListener(\"click\",()=>{o(t,e,l,d)}),e?.addEventListener(\"click\",()=>{o(t,e,l,d)})}const c=document.getElementById(\"theme-toggle-dark-icon\"),n=document.getElementById(\"theme-toggle-light-icon\");localStorage.getItem(\"color-theme\")===\"dark\"||!(\"color-theme\"in localStorage)&&window.matchMedia(\"(prefers-color-scheme: dark)\").matches?n?.classList.remove(\"hidden\"):c?.classList.remove(\"hidden\");const r=document.getElementById(\"theme-toggle\");let h=new Event(\"dark-mode\");r?.addEventListener(\"click\",function(){c?.classList.toggle(\"hidden\"),n?.classList.toggle(\"hidden\"),localStorage.getItem(\"color-theme\")?localStorage.getItem(\"color-theme\")===\"light\"?(document.documentElement.classList.add(\"dark\"),localStorage.setItem(\"color-theme\",\"dark\")):(document.documentElement.classList.remove(\"dark\"),localStorage.setItem(\"color-theme\",\"light\")):document.documentElement.classList.contains(\"dark\")?(document.documentElement.classList.remove(\"dark\"),localStorage.setItem(\"color-theme\",\"light\")):(document.documentElement.classList.add(\"dark\"),localStorage.setItem(\"color-theme\",\"dark\")),document.dispatchEvent(h)});\n"}],"styles":[{"type":"external","src":"/_astro/employees.2G1llXGW.css"}],"routeData":{"route":"/employees","isIndex":false,"type":"page","pattern":"^\\/employees\\/?$","segments":[[{"content":"employees","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/employees.astro","pathname":"/employees","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"inline","value":"const t=document.getElementById(\"sidebar\");if(t){const o=(s,g,i,m)=>{s.classList.toggle(\"hidden\"),g.classList.toggle(\"hidden\"),i.classList.toggle(\"hidden\"),m.classList.toggle(\"hidden\")},a=document.getElementById(\"toggleSidebarMobile\"),e=document.getElementById(\"sidebarBackdrop\"),l=document.getElementById(\"toggleSidebarMobileHamburger\"),d=document.getElementById(\"toggleSidebarMobileClose\");document.getElementById(\"toggleSidebarMobileSearch\")?.addEventListener(\"click\",()=>{o(t,e,l,d)}),a?.addEventListener(\"click\",()=>{o(t,e,l,d)}),e?.addEventListener(\"click\",()=>{o(t,e,l,d)})}const c=document.getElementById(\"theme-toggle-dark-icon\"),n=document.getElementById(\"theme-toggle-light-icon\");localStorage.getItem(\"color-theme\")===\"dark\"||!(\"color-theme\"in localStorage)&&window.matchMedia(\"(prefers-color-scheme: dark)\").matches?n?.classList.remove(\"hidden\"):c?.classList.remove(\"hidden\");const r=document.getElementById(\"theme-toggle\");let h=new Event(\"dark-mode\");r?.addEventListener(\"click\",function(){c?.classList.toggle(\"hidden\"),n?.classList.toggle(\"hidden\"),localStorage.getItem(\"color-theme\")?localStorage.getItem(\"color-theme\")===\"light\"?(document.documentElement.classList.add(\"dark\"),localStorage.setItem(\"color-theme\",\"dark\")):(document.documentElement.classList.remove(\"dark\"),localStorage.setItem(\"color-theme\",\"light\")):document.documentElement.classList.contains(\"dark\")?(document.documentElement.classList.remove(\"dark\"),localStorage.setItem(\"color-theme\",\"light\")):(document.documentElement.classList.add(\"dark\"),localStorage.setItem(\"color-theme\",\"dark\")),document.dispatchEvent(h)});\n"}],"styles":[{"type":"external","src":"/_astro/employees.2G1llXGW.css"}],"routeData":{"route":"/services","isIndex":false,"type":"page","pattern":"^\\/services\\/?$","segments":[[{"content":"services","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/services.astro","pathname":"/services","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"inline","value":"const t=document.getElementById(\"sidebar\");if(t){const o=(s,g,i,m)=>{s.classList.toggle(\"hidden\"),g.classList.toggle(\"hidden\"),i.classList.toggle(\"hidden\"),m.classList.toggle(\"hidden\")},a=document.getElementById(\"toggleSidebarMobile\"),e=document.getElementById(\"sidebarBackdrop\"),l=document.getElementById(\"toggleSidebarMobileHamburger\"),d=document.getElementById(\"toggleSidebarMobileClose\");document.getElementById(\"toggleSidebarMobileSearch\")?.addEventListener(\"click\",()=>{o(t,e,l,d)}),a?.addEventListener(\"click\",()=>{o(t,e,l,d)}),e?.addEventListener(\"click\",()=>{o(t,e,l,d)})}const c=document.getElementById(\"theme-toggle-dark-icon\"),n=document.getElementById(\"theme-toggle-light-icon\");localStorage.getItem(\"color-theme\")===\"dark\"||!(\"color-theme\"in localStorage)&&window.matchMedia(\"(prefers-color-scheme: dark)\").matches?n?.classList.remove(\"hidden\"):c?.classList.remove(\"hidden\");const r=document.getElementById(\"theme-toggle\");let h=new Event(\"dark-mode\");r?.addEventListener(\"click\",function(){c?.classList.toggle(\"hidden\"),n?.classList.toggle(\"hidden\"),localStorage.getItem(\"color-theme\")?localStorage.getItem(\"color-theme\")===\"light\"?(document.documentElement.classList.add(\"dark\"),localStorage.setItem(\"color-theme\",\"dark\")):(document.documentElement.classList.remove(\"dark\"),localStorage.setItem(\"color-theme\",\"light\")):document.documentElement.classList.contains(\"dark\")?(document.documentElement.classList.remove(\"dark\"),localStorage.setItem(\"color-theme\",\"light\")):(document.documentElement.classList.add(\"dark\"),localStorage.setItem(\"color-theme\",\"dark\")),document.dispatchEvent(h)});\n"}],"styles":[{"type":"external","src":"/_astro/employees.2G1llXGW.css"}],"routeData":{"route":"/services-2","isIndex":false,"type":"page","pattern":"^\\/services-2\\/?$","segments":[[{"content":"services-2","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/services-2.astro","pathname":"/services-2","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"inline","value":"const t=document.getElementById(\"sidebar\");if(t){const o=(s,g,i,m)=>{s.classList.toggle(\"hidden\"),g.classList.toggle(\"hidden\"),i.classList.toggle(\"hidden\"),m.classList.toggle(\"hidden\")},a=document.getElementById(\"toggleSidebarMobile\"),e=document.getElementById(\"sidebarBackdrop\"),l=document.getElementById(\"toggleSidebarMobileHamburger\"),d=document.getElementById(\"toggleSidebarMobileClose\");document.getElementById(\"toggleSidebarMobileSearch\")?.addEventListener(\"click\",()=>{o(t,e,l,d)}),a?.addEventListener(\"click\",()=>{o(t,e,l,d)}),e?.addEventListener(\"click\",()=>{o(t,e,l,d)})}const c=document.getElementById(\"theme-toggle-dark-icon\"),n=document.getElementById(\"theme-toggle-light-icon\");localStorage.getItem(\"color-theme\")===\"dark\"||!(\"color-theme\"in localStorage)&&window.matchMedia(\"(prefers-color-scheme: dark)\").matches?n?.classList.remove(\"hidden\"):c?.classList.remove(\"hidden\");const r=document.getElementById(\"theme-toggle\");let h=new Event(\"dark-mode\");r?.addEventListener(\"click\",function(){c?.classList.toggle(\"hidden\"),n?.classList.toggle(\"hidden\"),localStorage.getItem(\"color-theme\")?localStorage.getItem(\"color-theme\")===\"light\"?(document.documentElement.classList.add(\"dark\"),localStorage.setItem(\"color-theme\",\"dark\")):(document.documentElement.classList.remove(\"dark\"),localStorage.setItem(\"color-theme\",\"light\")):document.documentElement.classList.contains(\"dark\")?(document.documentElement.classList.remove(\"dark\"),localStorage.setItem(\"color-theme\",\"light\")):(document.documentElement.classList.add(\"dark\"),localStorage.setItem(\"color-theme\",\"dark\")),document.dispatchEvent(h)});\n"}],"styles":[{"type":"external","src":"/_astro/employees.2G1llXGW.css"}],"routeData":{"route":"/settings","isIndex":false,"type":"page","pattern":"^\\/settings\\/?$","segments":[[{"content":"settings","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/settings.astro","pathname":"/settings","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"inline","value":"const t=document.getElementById(\"sidebar\");if(t){const o=(s,g,i,m)=>{s.classList.toggle(\"hidden\"),g.classList.toggle(\"hidden\"),i.classList.toggle(\"hidden\"),m.classList.toggle(\"hidden\")},a=document.getElementById(\"toggleSidebarMobile\"),e=document.getElementById(\"sidebarBackdrop\"),l=document.getElementById(\"toggleSidebarMobileHamburger\"),d=document.getElementById(\"toggleSidebarMobileClose\");document.getElementById(\"toggleSidebarMobileSearch\")?.addEventListener(\"click\",()=>{o(t,e,l,d)}),a?.addEventListener(\"click\",()=>{o(t,e,l,d)}),e?.addEventListener(\"click\",()=>{o(t,e,l,d)})}const c=document.getElementById(\"theme-toggle-dark-icon\"),n=document.getElementById(\"theme-toggle-light-icon\");localStorage.getItem(\"color-theme\")===\"dark\"||!(\"color-theme\"in localStorage)&&window.matchMedia(\"(prefers-color-scheme: dark)\").matches?n?.classList.remove(\"hidden\"):c?.classList.remove(\"hidden\");const r=document.getElementById(\"theme-toggle\");let h=new Event(\"dark-mode\");r?.addEventListener(\"click\",function(){c?.classList.toggle(\"hidden\"),n?.classList.toggle(\"hidden\"),localStorage.getItem(\"color-theme\")?localStorage.getItem(\"color-theme\")===\"light\"?(document.documentElement.classList.add(\"dark\"),localStorage.setItem(\"color-theme\",\"dark\")):(document.documentElement.classList.remove(\"dark\"),localStorage.setItem(\"color-theme\",\"light\")):document.documentElement.classList.contains(\"dark\")?(document.documentElement.classList.remove(\"dark\"),localStorage.setItem(\"color-theme\",\"light\")):(document.documentElement.classList.add(\"dark\"),localStorage.setItem(\"color-theme\",\"dark\")),document.dispatchEvent(h)});\n"}],"styles":[{"type":"external","src":"/_astro/employees.2G1llXGW.css"}],"routeData":{"route":"/signin","isIndex":false,"type":"page","pattern":"^\\/signin\\/?$","segments":[[{"content":"signin","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/signin.astro","pathname":"/signin","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"inline","value":"const t=document.getElementById(\"sidebar\");if(t){const o=(s,g,i,m)=>{s.classList.toggle(\"hidden\"),g.classList.toggle(\"hidden\"),i.classList.toggle(\"hidden\"),m.classList.toggle(\"hidden\")},a=document.getElementById(\"toggleSidebarMobile\"),e=document.getElementById(\"sidebarBackdrop\"),l=document.getElementById(\"toggleSidebarMobileHamburger\"),d=document.getElementById(\"toggleSidebarMobileClose\");document.getElementById(\"toggleSidebarMobileSearch\")?.addEventListener(\"click\",()=>{o(t,e,l,d)}),a?.addEventListener(\"click\",()=>{o(t,e,l,d)}),e?.addEventListener(\"click\",()=>{o(t,e,l,d)})}const c=document.getElementById(\"theme-toggle-dark-icon\"),n=document.getElementById(\"theme-toggle-light-icon\");localStorage.getItem(\"color-theme\")===\"dark\"||!(\"color-theme\"in localStorage)&&window.matchMedia(\"(prefers-color-scheme: dark)\").matches?n?.classList.remove(\"hidden\"):c?.classList.remove(\"hidden\");const r=document.getElementById(\"theme-toggle\");let h=new Event(\"dark-mode\");r?.addEventListener(\"click\",function(){c?.classList.toggle(\"hidden\"),n?.classList.toggle(\"hidden\"),localStorage.getItem(\"color-theme\")?localStorage.getItem(\"color-theme\")===\"light\"?(document.documentElement.classList.add(\"dark\"),localStorage.setItem(\"color-theme\",\"dark\")):(document.documentElement.classList.remove(\"dark\"),localStorage.setItem(\"color-theme\",\"light\")):document.documentElement.classList.contains(\"dark\")?(document.documentElement.classList.remove(\"dark\"),localStorage.setItem(\"color-theme\",\"light\")):(document.documentElement.classList.add(\"dark\"),localStorage.setItem(\"color-theme\",\"dark\")),document.dispatchEvent(h)});\n"}],"styles":[{"type":"external","src":"/_astro/employees.2G1llXGW.css"}],"routeData":{"route":"/signup","isIndex":false,"type":"page","pattern":"^\\/signup\\/?$","segments":[[{"content":"signup","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/signup.astro","pathname":"/signup","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[{"type":"inline","value":"const t=document.getElementById(\"sidebar\");if(t){const o=(s,g,i,m)=>{s.classList.toggle(\"hidden\"),g.classList.toggle(\"hidden\"),i.classList.toggle(\"hidden\"),m.classList.toggle(\"hidden\")},a=document.getElementById(\"toggleSidebarMobile\"),e=document.getElementById(\"sidebarBackdrop\"),l=document.getElementById(\"toggleSidebarMobileHamburger\"),d=document.getElementById(\"toggleSidebarMobileClose\");document.getElementById(\"toggleSidebarMobileSearch\")?.addEventListener(\"click\",()=>{o(t,e,l,d)}),a?.addEventListener(\"click\",()=>{o(t,e,l,d)}),e?.addEventListener(\"click\",()=>{o(t,e,l,d)})}const c=document.getElementById(\"theme-toggle-dark-icon\"),n=document.getElementById(\"theme-toggle-light-icon\");localStorage.getItem(\"color-theme\")===\"dark\"||!(\"color-theme\"in localStorage)&&window.matchMedia(\"(prefers-color-scheme: dark)\").matches?n?.classList.remove(\"hidden\"):c?.classList.remove(\"hidden\");const r=document.getElementById(\"theme-toggle\");let h=new Event(\"dark-mode\");r?.addEventListener(\"click\",function(){c?.classList.toggle(\"hidden\"),n?.classList.toggle(\"hidden\"),localStorage.getItem(\"color-theme\")?localStorage.getItem(\"color-theme\")===\"light\"?(document.documentElement.classList.add(\"dark\"),localStorage.setItem(\"color-theme\",\"dark\")):(document.documentElement.classList.remove(\"dark\"),localStorage.setItem(\"color-theme\",\"light\")):document.documentElement.classList.contains(\"dark\")?(document.documentElement.classList.remove(\"dark\"),localStorage.setItem(\"color-theme\",\"light\")):(document.documentElement.classList.add(\"dark\"),localStorage.setItem(\"color-theme\",\"dark\")),document.dispatchEvent(h)});\n"}],"styles":[{"type":"external","src":"/_astro/employees.2G1llXGW.css"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["D:/work/astro/1/admin/src/pages/employees.astro",{"propagation":"none","containsHead":true}],["D:/work/astro/1/admin/src/pages/index.astro",{"propagation":"none","containsHead":true}],["D:/work/astro/1/admin/src/pages/services-2.astro",{"propagation":"none","containsHead":true}],["D:/work/astro/1/admin/src/pages/services.astro",{"propagation":"none","containsHead":true}],["D:/work/astro/1/admin/src/pages/settings.astro",{"propagation":"none","containsHead":true}],["D:/work/astro/1/admin/src/pages/signin.astro",{"propagation":"none","containsHead":true}],["D:/work/astro/1/admin/src/pages/signup.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var i=t=>{let e=async()=>{await(await t())()};\"requestIdleCallback\"in window?window.requestIdleCallback(e):setTimeout(e,200)};(self.Astro||(self.Astro={})).idle=i;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000noop-middleware":"_noop-middleware.mjs","/node_modules/astro/dist/assets/endpoint/generic.js":"chunks/pages/generic_DmqzS9Ac.mjs","/src/pages/services-2.astro":"chunks/pages/services-2_Bzzlerk5.mjs","/src/pages/services.astro":"chunks/pages/services_D-hgefkw.mjs","/src/pages/settings.astro":"chunks/pages/settings_ZQTGh2rl.mjs","/src/pages/signin.astro":"chunks/pages/signin_Bw1WfoCE.mjs","/src/pages/signup.astro":"chunks/pages/signup_C6wPWJGn.mjs","\u0000@astrojs-manifest":"manifest_C_Z2YGIh.mjs","D:/work/astro/1/admin/node_modules/@astrojs/react/vnode-children.js":"chunks/vnode-children_BkR_XoPb.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"chunks/generic_CgaT81T1.mjs","\u0000@astro-page:src/pages/employees@_@astro":"chunks/employees_DxtgG91g.mjs","\u0000@astro-page:src/pages/services@_@astro":"chunks/services_BQdDCDYG.mjs","\u0000@astro-page:src/pages/services-2@_@astro":"chunks/services-2_DwUaU1zM.mjs","\u0000@astro-page:src/pages/settings@_@astro":"chunks/settings_DEBbYZ4R.mjs","\u0000@astro-page:src/pages/signin@_@astro":"chunks/signin_BA-J53W2.mjs","\u0000@astro-page:src/pages/signup@_@astro":"chunks/signup_D120aQ6Q.mjs","\u0000@astro-page:src/pages/index@_@astro":"chunks/index_Czrf2RbW.mjs","D:/work/astro/1/admin/src/components/partials/services/ServiceTableTwo":"_astro/ServiceTableTwo.Zg1XDCO_.js","D:/work/astro/1/admin/src/components/partials/LoginButton":"_astro/LoginButton.BpmFpzxC.js","D:/work/astro/1/admin/src/components/partials/auth/SignUpForm":"_astro/SignUpForm.B1Id58Hi.js","D:/work/astro/1/admin/src/components/partials/auth/SignInForm":"_astro/SignInForm.DDz4QGvz.js","/astro/hoisted.js?q=0":"_astro/hoisted.mdkOj7hp.js","@astrojs/react/client.js":"_astro/client.D4qF4TdC.js","D:/work/astro/1/admin/src/components/partials/UserSettings":"_astro/UserSettings.gENk5mqz.js","react-toastify":"_astro/_astro-entry_react-toastify.D281TVym.js","D:/work/astro/1/admin/src/components/partials/services/ServiceTable":"_astro/ServiceTable.CL3GNBn_.js","D:/work/astro/1/admin/src/components/partials/Employees":"_astro/Employees.Cjh_XDvl.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/employees.2G1llXGW.css","/favicon.svg","/_astro/client.D4qF4TdC.js","/_astro/clsx.B-dksMZM.js","/_astro/Employees.Cjh_XDvl.js","/_astro/Form.D2qAwbVm.js","/_astro/index.24z1lnX0.js","/_astro/index.BBp7o1b3.js","/_astro/index.CnNGgP6X.js","/_astro/index.D7nEWG0E.js","/_astro/index.D82GmqbV.js","/_astro/index.DTLz-HeY.js","/_astro/index.hBl1Gx-m.js","/_astro/Loading.Dw76dUgN.js","/_astro/LoginButton.BpmFpzxC.js","/_astro/ServiceTable.CL3GNBn_.js","/_astro/ServiceTableTwo.Zg1XDCO_.js","/_astro/SignInForm.DDz4QGvz.js","/_astro/SignUpForm.B1Id58Hi.js","/_astro/strapi.99PukOo3.js","/_astro/UserSettings.gENk5mqz.js","/_astro/_astro-entry_react-toastify.CDZtbDrs.js","/_astro/_astro-entry_react-toastify.D281TVym.js"],"buildFormat":"directory","checkOrigin":false});

export { AstroIntegrationLogger as A, Logger as L, getEventPrefix as g, levels as l, manifest };
