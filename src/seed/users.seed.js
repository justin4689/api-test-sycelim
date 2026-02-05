require("dotenv").config();
const mongoose = require("mongoose");
const { faker } = require("@faker-js/faker");

const User = require("../models/User");

const parseCountArg = () => {
  const raw = process.argv[2];
  if (!raw) return 50;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 ? n : 50;
};

const buildUser = (i) => {
  const genre = faker.helpers.arrayElement(["Homme", "Femme"]);

  const prenom = faker.person.firstName(genre === "Homme" ? "male" : "female");
  const nom = faker.person.lastName();

  const uniqueSuffix = `${faker.string.alphanumeric({ length: 8, casing: "lower" })}${i}`;

  const login = faker.internet
    .userName({ firstName: prenom, lastName: nom })
    .toLowerCase()
    .replace(/[^a-z0-9_\.]/g, "_")
    .slice(0, 20);

  const userLogin = `${login}_${uniqueSuffix}`.slice(0, 30);
  const userEmail = `${login}.${uniqueSuffix}@example.com`.slice(0, 64);
  const userMobile = faker.phone.number("0#########");

  return {
    user_nom: nom,
    user_prenoms: prenom,
    user_genre: genre,
    user_date: faker.date.birthdate({ min: 18, max: 65, mode: "age" }),
    user_login: userLogin,
    user_password: faker.internet.password({ length: 12 }),
    user_email: userEmail,
    user_mobile: userMobile,
    user_active: true,
  };
};

const main = async () => {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("MONGO_URI manquant dans .env");
    process.exit(1);
  }

  const count = parseCountArg();

  try {
    await mongoose.connect(mongoUri);

    const docs = Array.from({ length: count }, (_, i) => buildUser(i));

    const inserted = await User.insertMany(docs, { ordered: false });
    console.log(`Seed users: ${inserted.length} insérés`);
  } catch (error) {
    console.error("Erreur seed users:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

main();
