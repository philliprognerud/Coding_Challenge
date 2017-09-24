const lobFuncs = require("../lob/lob");

module.exports = app => {
  app.get("/", (req, res) => {
    let err = req.query.error;
    res.render("../views/landing", { err: err });
  });

  app.post("/new", async (req, res) => {
    try {
      let fromAddress = await lobFuncs.fromAddress(req.body);
      let toAddress = await lobFuncs.toAddress(req.body.addrLine1);
      let letter = await lobFuncs.createLetter(
        fromAddress,
        toAddress,
        req.body.message
      );

      app.set("letter", letter);
      res.redirect(`/letter/${letter.id}`);
    } catch (err) {
      console.log(err.name);
      console.log(err.message);
      res.redirect(`/?error=true`);
    }
  });

  app.get("/letter/:id", (req, res) => {
    let letterUrl = app.get("letter").url;
    res.render("../views/letter", { letterUrl: letterUrl });
  });
};
