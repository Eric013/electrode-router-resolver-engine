"use strict";


const routerResolver = require("../../lib/index");

require("babel-core/register");

const routes = require("../routes.jsx").default;
const badRoutes = require("../bad-routes.jsx").default;
const getIndexRoutes = require("../get-index-routes.jsx").default;
const ErrorRoute = require("../get-index-routes.jsx").ErrorRoute;

describe("RouterResolver", function () {
  it("should return 404 for unknown index route", () => {
    const resolver = routerResolver(routes);
    return resolver({url: {path: "/test/blah"}}).then((result) => {
      expect(result.status).to.equal(404);
    });
  });

  it("should return string error", () => {
    const resolver = routerResolver(getIndexRoutes);
    return resolver({url: {path: "/test"}}).then((result) => {
      expect(result.status).to.equal(500);
      expect(result._err.message).to.equal("failed");
    });
  });

  it("should return Error error", () => {
    const resolver = routerResolver(ErrorRoute);
    return resolver({url: {path: "/test"}}).then((result) => {
      expect(result.status).to.equal(500);
      expect(result._err.message).to.equal("failed error");
    });
  });

  it("should resolve index route", () => {
    const resolver = routerResolver(routes);
    return resolver({url: {path: "/test"}}).then((result) => {
      expect(result.status).to.equal(200);
    });
  });

  it("should redirect redirect route", () => {
    const resolver = routerResolver(routes);
    return resolver({url: {path: "/test/source"}}).then((result) => {
      expect(result.status).to.equal(302);
      expect(result.path).to.equal("/test/target");
    });
  });

  it("should return 500 for invalid component", () => {
    const resolver = routerResolver(badRoutes);
    return resolver({url: {path: "/test"}}).then((result) => {
      expect(result.status).to.equal(500);
      expect(result._err).to.be.ok;
    });
  });


});
