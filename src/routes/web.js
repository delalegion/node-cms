const express = require('express');
const router = new express.Router();

const users = [
    { id: 1, name: "Janek", email: "janek@gmail.com" },
    { id: 2, name: "Rafał", email: "rafał@gmail.com" },
    { id: 3, name: "Krzychu", email: "rafał@gmail.com" },
    { id: 4, name: "Hubert", email: "pomalo@gmail.com" },
]

router.get('/firmy/:name', (req, res) => {
    const { name } = req.params;
    const companies = [
        { slug: 'tworcastron', name: 'Tworca Stron.pl' },
        { slug: 'kruk', name: 'Hubert Kruk' }
    ]

    const comp = companies.find(x => x.slug === name);

    comp ? res.send(`${comp?.name}`) : res.send(`Podana firma nie istnieje.`);
})
router.get("/", (req, res) => {
    res.render('home', {title: "Homepage"});
})
router.get("/profile", (req, res) => {
    res.render('profile', {users: users, title: "CO", details: 0})
})
router.get("/kontakt", (req, res) => {

})
router.get("/profile/:id/:mode?", (req, res) => {
    const data = users.find(x => x.id === parseInt(req.params.id));
    console.log("co");
    console.log(req.params);
    res.render('profile', { data: data, users: users, details: req.params, title: "Profiles" });
})
router.get('*', (req, res) => {
    res.render('404', {title: "404 - Site no found"});
})

module.exports = router;