const User = require("../models/User");

const formatDateFR = (value) => {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;

  const pad2 = (n) => String(n).padStart(2, "0");
  const day = pad2(d.getDate());
  const month = pad2(d.getMonth() + 1);
  const year = d.getFullYear();

  return `${day}/${month}/${year}`;
};

const serializeUserDates = (u) => {
  if (!u) return u;
  return {
    ...u,
    user_date: formatDateFR(u.user_date),
    user_creation: formatDateFR(u.user_creation),
  };
};

// CREATE
exports.createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// READ ALL
exports.getUsers = async (req, res) => {
  try {
    const pageRaw = Number.parseInt(req.query.page, 10);
    const limitRaw = Number.parseInt(req.query.limit, 10);

    const page = Number.isFinite(pageRaw) && pageRaw > 0 ? pageRaw : 1;
    const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? limitRaw : 10;
    const skip = (page - 1) * limit;

    const sortableFields = new Set([
      "user_creation",
      "user_nom",
      "user_prenoms",
      "user_login",
      "user_email",
      "user_date",
    ]);

    const sortBy = sortableFields.has(req.query.sortBy)
      ? req.query.sortBy
      : "user_creation";
    const sortOrder = String(req.query.sortOrder || "desc").toLowerCase();
    const sortDir = sortOrder === "asc" ? 1 : -1;
    const sort = { [sortBy]: sortDir };

    const filter = {};

    if (req.query.user_active !== undefined) {
      if (req.query.user_active === "true" || req.query.user_active === true) {
        filter.user_active = true;
      } else if (
        req.query.user_active === "false" ||
        req.query.user_active === false
      ) {
        filter.user_active = false;
      }
    }

    if (req.query.user_genre) {
      filter.user_genre = req.query.user_genre;
    }

    if (req.query.q) {
      const q = String(req.query.q).trim();
      if (q.length) {
        const regex = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
        filter.$or = [
          { user_nom: regex },
          { user_prenoms: regex },
          { user_login: regex },
          { user_email: regex },
          { user_mobile: regex },
        ];
      }
    }

    const [total, users] = await Promise.all([
      User.countDocuments(filter),
      User.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    ]);

    const usersSerialized = users.map(serializeUserDates);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    res.json({
      data: usersSerialized,
      pagination: {
        total,
        totalPages,
        page,
        limit,
      },
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// READ ONE
exports.getUserById = async (req, res) => {
  const user = await User.findById(req.params.id).lean();
  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }
  res.json(serializeUserDates(user));
};

// UPDATE
exports.updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(user);
};

// DELETE (soft delete conseillé)
exports.disableUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { user_active: false },
    { new: true },
  );
  res.json(user);
};
