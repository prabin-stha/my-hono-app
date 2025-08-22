import { Hono } from "hono";
import { FC } from "hono/jsx";

import { basicAuth } from "hono/basic-auth";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.get("/", (c) => {
  return c.text("Hello World!");
});

app.get("/json", (c) => {
  return c.json({
    message: "Hello World!",
  });
});

app.get("/dynamic/:id", (c) => {
  const page = c.req.query("page");
  const id = c.req.param("id");

  c.header("X-Message", "hello world");

  return c.json({
    message: "Hello World!",
    id,
    page,
  });
});
app.post("/dynamic", (c) => c.text("Created", 201));
app.delete("/dynamic/:id", (c) => c.text(`Removed ${c.req.param("id")}`));

const JSXPage: FC = () => {
  return <div>This is a test Page</div>;
};
app.get("/jsx", (c) => {
  return c.html(<JSXPage />);
});

// app.get("/response", () => {
//   return new Response("Good Morning");
// });

app.use("/protected/*", async (c, next) => {
  const auth = basicAuth({
    username: c.env.BASIC_AUTH_USERNAME,
    password: c.env.BASIC_AUTH_PASSWORD,
  });
  return auth(c, next);
});

app.get("/protected/resource", (c) => {
  return c.text("You are authorized");
});

export default app;
