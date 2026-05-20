// init

require("dotenv").config();
const mongoose = require("mongoose");

const Category = require("../models/Category");
const EntityConfig = require("../models/Config");

const main = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI manquant dans .env");
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri);

    const categories = [
      { name: "parametres", label: "Paramètres" },
      { name: "medecine", label: "Médecine" },
      { name: "rh", label: "Ressources Humaines" },
      { name: "finance", label: "Finance" },
    ];

    const categoryDocs = await Promise.all(
      categories.map((cat) =>
        Category.findOneAndUpdate({ name: cat.name }, { $set: cat }, {
          upsert: true,
          new: true,
        }),
      ),
    );

    const categoryMap = Object.fromEntries(
      categoryDocs.map((c) => [c.name, c._id]),
    );

    console.log(`Seed categories: ${categoryDocs.length} catégorie(s) traitée(s)`);

    const docs = [
      // ── PARAMÈTRES ──────────────────────────────────────────────────────────
      {
        label: "Utilisateurs",
        entity: "users",
        category: categoryMap["parametres"],
        config: {
          form: {
            columns: 2,
            fields: [
              { name: "user_nom",      label: "Nom",              type: "text",     required: true,  colSpan: 1 },
              { name: "user_prenoms",  label: "Prénoms",          type: "text",     required: true,  colSpan: 1 },
              { name: "user_genre",    label: "Genre",            type: "select",   required: true,  colSpan: 1,
                options: [{ label: "Homme", value: "Homme" }, { label: "Femme", value: "Femme" }] },
              { name: "user_date",     label: "Date de naissance",type: "date",     required: true,  colSpan: 1 },
              { name: "user_login",    label: "Login",            type: "text",     required: true,  colSpan: 1 },
              { name: "user_password", label: "Mot de passe",     type: "password", required: true,  colSpan: 1 },
              { name: "user_email",    label: "Email",            type: "email",    required: true,  colSpan: 2 },
              { name: "user_mobile",   label: "Mobile",           type: "text",     required: false, colSpan: 1 },
              { name: "user_active",   label: "Actif",            type: "checkbox", required: false, colSpan: 1 },
            ],
          },
          table: {
            columns: [
              { name: "user_nom",     label: "Nom",     sortable: true },
              { name: "user_prenoms", label: "Prénoms", sortable: true },
              { name: "user_email",   label: "Email",   sortable: true },
              { name: "user_mobile",  label: "Mobile",  sortable: false },
              { name: "user_active",  label: "Actif",   sortable: true },
            ],
          },
          buttons: [
            { label: "Nouveau" },
            { label: "Lister" },
            { label: "Rechercher" },
          ],
        },
      },

      // ── MÉDECINE ─────────────────────────────────────────────────────────────
      {
        label: "Patients",
        entity: "patients",
        category: categoryMap["medecine"],
        config: {
          form: {
            columns: 2,
            fields: [
              { name: "pat_nom",         label: "Nom",              type: "text",   required: true,  colSpan: 1 },
              { name: "pat_prenoms",     label: "Prénoms",          type: "text",   required: true,  colSpan: 1 },
              { name: "pat_genre",       label: "Genre",            type: "select", required: true,  colSpan: 1,
                options: [{ label: "Homme", value: "Homme" }, { label: "Femme", value: "Femme" }] },
              { name: "pat_ddn",         label: "Date de naissance",type: "date",   required: true,  colSpan: 1 },
              { name: "pat_telephone",   label: "Téléphone",        type: "text",   required: false, colSpan: 1 },
              { name: "pat_adresse",     label: "Adresse",          type: "text",   required: false, colSpan: 2 },
              { name: "pat_groupe_sang", label: "Groupe sanguin",   type: "select", required: false, colSpan: 1,
                options: [
                  { label: "A+", value: "A+" }, { label: "A-", value: "A-" },
                  { label: "B+", value: "B+" }, { label: "B-", value: "B-" },
                  { label: "AB+", value: "AB+" }, { label: "AB-", value: "AB-" },
                  { label: "O+", value: "O+" }, { label: "O-", value: "O-" },
                ] },
            ],
          },
          table: {
            columns: [
              { name: "pat_nom",       label: "Nom",     sortable: true },
              { name: "pat_prenoms",   label: "Prénoms", sortable: true },
              { name: "pat_genre",     label: "Genre",   sortable: true },
              { name: "pat_ddn",       label: "Naissance",sortable: true },
              { name: "pat_telephone", label: "Téléphone",sortable: false },
            ],
          },
          buttons: [
            { label: "Nouveau" },
            { label: "Lister" },
            { label: "Rechercher" },
          ],
        },
      },

      {
        label: "Médecins",
        entity: "medecins",
        category: categoryMap["medecine"],
        config: {
          form: {
            columns: 2,
            fields: [
              { name: "med_nom",         label: "Nom",        type: "text",   required: true,  colSpan: 1 },
              { name: "med_prenoms",     label: "Prénoms",    type: "text",   required: true,  colSpan: 1 },
              { name: "med_specialite",  label: "Spécialité", type: "select", required: true,  colSpan: 1,
                options: [
                  { label: "Généraliste",    value: "generaliste" },
                  { label: "Cardiologue",    value: "cardiologue" },
                  { label: "Pédiatre",       value: "pediatre" },
                  { label: "Chirurgien",     value: "chirurgien" },
                ] },
              { name: "med_telephone",   label: "Téléphone",  type: "text",   required: true,  colSpan: 1 },
              { name: "med_email",       label: "Email",      type: "email",  required: false, colSpan: 2 },
              { name: "med_actif",       label: "Actif",      type: "checkbox",required: false, colSpan: 1 },
            ],
          },
          table: {
            columns: [
              { name: "med_nom",        label: "Nom",        sortable: true },
              { name: "med_prenoms",    label: "Prénoms",    sortable: true },
              { name: "med_specialite", label: "Spécialité", sortable: true },
              { name: "med_telephone",  label: "Téléphone",  sortable: false },
              { name: "med_actif",      label: "Actif",      sortable: true },
            ],
          },
          buttons: [
            { label: "Nouveau" },
            { label: "Lister" },
            { label: "Rechercher" },
          ],
        },
      },

      // ── RESSOURCES HUMAINES ──────────────────────────────────────────────────
      {
        label: "Employés",
        entity: "employes",
        category: categoryMap["rh"],
        config: {
          form: {
            columns: 2,
            fields: [
              { name: "emp_matricule",   label: "Matricule",        type: "text",   required: true,  colSpan: 1 },
              { name: "emp_nom",         label: "Nom",              type: "text",   required: true,  colSpan: 1 },
              { name: "emp_prenoms",     label: "Prénoms",          type: "text",   required: true,  colSpan: 1 },
              { name: "emp_genre",       label: "Genre",            type: "select", required: true,  colSpan: 1,
                options: [{ label: "Homme", value: "Homme" }, { label: "Femme", value: "Femme" }] },
              { name: "emp_ddn",         label: "Date de naissance",type: "date",   required: true,  colSpan: 1 },
              { name: "emp_poste",       label: "Poste",            type: "text",   required: true,  colSpan: 1 },
              { name: "emp_date_entree", label: "Date d'entrée",    type: "date",   required: true,  colSpan: 1 },
              { name: "emp_telephone",   label: "Téléphone",        type: "text",   required: false, colSpan: 1 },
              { name: "emp_email",       label: "Email",            type: "email",  required: false, colSpan: 2 },
            ],
          },
          table: {
            columns: [
              { name: "emp_matricule",   label: "Matricule",  sortable: true },
              { name: "emp_nom",         label: "Nom",        sortable: true },
              { name: "emp_prenoms",     label: "Prénoms",    sortable: true },
              { name: "emp_poste",       label: "Poste",      sortable: true },
              { name: "emp_date_entree", label: "Entrée",     sortable: true },
            ],
          },
          buttons: [
            { label: "Nouveau" },
            { label: "Lister" },
            { label: "Rechercher" },
          ],
        },
      },

      // ── FINANCE ──────────────────────────────────────────────────────────────
      {
        label: "Factures",
        entity: "factures",
        category: categoryMap["finance"],
        config: {
          form: {
            columns: 2,
            fields: [
              { name: "fac_numero",      label: "Numéro",       type: "text",   required: true,  colSpan: 1 },
              { name: "fac_date",        label: "Date",         type: "date",   required: true,  colSpan: 1 },
              { name: "fac_client",      label: "Client",       type: "text",   required: true,  colSpan: 2 },
              { name: "fac_montant_ht",  label: "Montant HT",   type: "number", required: true,  colSpan: 1 },
              { name: "fac_taux_tva",    label: "Taux TVA (%)", type: "number", required: true,  colSpan: 1 },
              { name: "fac_montant_ttc", label: "Montant TTC",  type: "number", required: false, colSpan: 1 },
              { name: "fac_statut",      label: "Statut",       type: "select", required: true,  colSpan: 1,
                options: [
                  { label: "Brouillon",  value: "brouillon" },
                  { label: "Émise",      value: "emise" },
                  { label: "Payée",      value: "payee" },
                  { label: "Annulée",    value: "annulee" },
                ] },
            ],
          },
          table: {
            columns: [
              { name: "fac_numero",      label: "Numéro",  sortable: true },
              { name: "fac_date",        label: "Date",    sortable: true },
              { name: "fac_client",      label: "Client",  sortable: true },
              { name: "fac_montant_ttc", label: "TTC",     sortable: true },
              { name: "fac_statut",      label: "Statut",  sortable: true },
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
    console.error("Erreur seed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

main();
