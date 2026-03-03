// init

require("dotenv").config();
const mongoose = require("mongoose");

const EntityConfig = require("../models/Config");

const main = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI manquant dans .env");
    process.exit(1);
  }

  const docs = [
    {
      label: "Utilisateurs",
      entity: "users",
      config: {
        form: {
          columns: 2,
          fields: [
            {
              name: "user_nom",
              label: "Nom",
              type: "text",
              required: true,
              colSpan: 1,
            },
            {
              name: "user_prenoms",
              label: "Prénoms",
              type: "text",
              required: true,
              colSpan: 1,
            },
            {
              name: "user_genre",
              label: "Genre",
              type: "select",
              required: true,
              colSpan: 1,
              options: [
                { label: "Homme", value: "Homme" },
                { label: "Femme", value: "Femme" },
              ],
            },
            {
              name: "user_date",
              label: "Date de naissance",
              type: "date",
              required: true,
              colSpan: 1,
            },
            {
              name: "user_login",
              label: "Login",
              type: "text",
              required: true,
              colSpan: 1,
            },
            {
              name: "user_password",
              label: "Mot de passe",
              type: "password",
              required: true,
              colSpan: 1,
            },
            {
              name: "user_email",
              label: "Email",
              type: "email",
              required: true,
              colSpan: 2,
            },
            {
              name: "user_mobile",
              label: "Mobile",
              type: "text",
              required: false,
              colSpan: 1,
            },
            {
              name: "user_active",
              label: "Actif",
              type: "checkbox",
              required: false,
              colSpan: 1,
            },
          ],
        },

        table: {
          columns: [
            { name: "user_nom", label: "Nom", sortable: true },
            { name: "user_prenoms", label: "Prénoms", sortable: true },
            { name: "user_email", label: "Email", sortable: true },
            { name: "user_mobile", label: "Mobile", sortable: false },
            { name: "user_active", label: "Actif", sortable: true },
          ],
        },

        buttons: [
          { label: "Nouveau" },
          { label: "Lister" },
          { label: "Rechercher" },
        ],
      },
    },
  ];

  try {
    await mongoose.connect(mongoUri);

    const results = await Promise.all(
      docs.map((doc) =>
        EntityConfig.updateOne(
          { entity: doc.entity },
          { $set: doc },
          { upsert: true },
        ),
      ),
    );

    const upsertedCount = results.reduce(
      (acc, r) => acc + (r.upsertedCount || (r.upsertedId ? 1 : 0)),
      0,
    );

    console.log(
      `Seed config: ${results.length} entité(s) traitée(s) (${upsertedCount} créée(s)/upsert)`,
    );
  } catch (error) {
    console.error("Erreur seed config:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

main();
