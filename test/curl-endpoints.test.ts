import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { readdirSync } from "node:fs";
import { join } from "node:path";

import { GET as getCard } from "../app/api/curl/route";
import { GET as getContact } from "../app/api/curl/contact/route";
import { GET as getProjects } from "../app/api/curl/projects/route";
import { GET as getExperience } from "../app/api/curl/experience/route";
import { GET as getBlog } from "../app/api/curl/blog/route";
import { GET as getBlogPost } from "../app/api/curl/blog/[slug]/route";

import { site } from "../data/site";
import { projects } from "../data/projects";
import { experience } from "../data/experience";
import { blogPosts } from "../data/blog";
import { banner, WIDTH } from "../util/curl-format";
import { CURL_REWRITES, isCurlRoute } from "../util/curl-routes";

// Markers derive from the data files so content edits never break tests.
const firstPublishedProject = projects.find((p) => p.published)!;
const firstPublishedPost = blogPosts.find((p) => p.published)!;

const url = (path: string) => new Request(`http://localhost${path}`);

async function assertPlainText(res: Response, marker: string) {
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type") ?? "", /text\/plain/);
  assert.ok(
    (await res.text()).includes(marker),
    `response should contain ${JSON.stringify(marker)}`,
  );
}

test("GET /api/curl renders the bash card", async () => {
  const res = await getCard(url("/"));
  await assertPlainText(res, site.title);
});

test("GET /api/curl/contact lists socials", async () => {
  const res = await getContact();
  await assertPlainText(res, "CONTACT");
});

test("GET /api/curl/projects lists published projects", async () => {
  const res = await getProjects();
  await assertPlainText(res, firstPublishedProject.title);
});

test("GET /api/curl/experience lists work history", async () => {
  const res = await getExperience();
  await assertPlainText(res, experience[0].company);
});

test("GET /api/curl/blog lists published posts", async () => {
  const res = await getBlog();
  await assertPlainText(res, firstPublishedPost.title);
});

test("GET /api/curl/blog/[slug] renders a post and 404s on unknown slugs", async () => {
  const ok = await getBlogPost(url(`/blog/${firstPublishedPost.slug}`), {
    params: { slug: firstPublishedPost.slug },
  });
  await assertPlainText(ok, firstPublishedPost.title);

  const missing = await getBlogPost(url("/blog/nope"), {
    params: { slug: "nope" },
  });
  assert.equal(missing.status, 404);
});

test("banner box edges align", () => {
  const stripAnsi = (s: string) => s.replace(/\x1b\[[0-9;]*m/g, "");
  const lines = stripAnsi(banner("PROJECTS")).trimEnd().split("\n");
  assert.equal(lines.length, 3);
  for (const line of lines) {
    assert.equal(line.length, WIDTH + 2, `misaligned line: ${line}`);
  }
});

test("every curl rewrite has a route handler", () => {
  for (const target of Object.values(CURL_REWRITES)) {
    const handler = join(process.cwd(), "app", target, "route.ts");
    assert.ok(existsSync(handler), `missing handler for ${target}`);
  }
});

test("every browser page has a curl counterpart", () => {
  const pages: string[] = [];
  const walk = (dir: string, route: string) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (entry.isDirectory() && !entry.name.startsWith("_")) {
        walk(join(dir, entry.name), `${route}/${entry.name}`);
      } else if (entry.name === "page.tsx") {
        pages.push(route || "/");
      }
    }
  };
  walk(join(process.cwd(), "app"), "");

  for (const page of pages) {
    // Dynamic segments resolve at request time; representative path suffices.
    const probe = page.replace("[slug]", "some-slug");
    assert.ok(isCurlRoute(probe), `page ${page} has no curl counterpart`);
  }
});
