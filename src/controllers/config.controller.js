const EntityConfig = require("../models/Config");

const getEntityList = async (req, res) => {
  try {
    const filter = {};
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const entities = await EntityConfig.find(filter, { __v: 0 }).populate(
      "category",
      "name label",
    );

    const formattedEntities = entities.map((item) => ({
      id: item._id,
      label: item.label,
      entity: item.entity,
      category: item.category ?? null,
      formColumns: item.config?.form?.columns || 0,
    }));

    res.json(formattedEntities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEntityConfigById = async (req, res) => {
  try {
    const entityConfig = await EntityConfig.findById(req.params.id, {
      __v: 0,
    }).populate("category", "name label");
    if (!entityConfig) {
      return res.status(404).json({ message: "Entity Config not found" });
    }
    res.json(entityConfig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEntityConfigByName = async (req, res) => {
  try {
    const entityConfig = await EntityConfig.findOne(
      { entity: req.params.name },
      { __v: 0 },
    ).populate("category", "name label");
    if (!entityConfig) {
      return res.status(404).json({ message: "Entity Config not found" });
    }
    res.json(entityConfig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createEntityConfig = async (req, res) => {
  try {
    const entityConfig = await EntityConfig.create(req.body);
    res.status(201).json(entityConfig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateEntityConfig = async (req, res) => {
  try {
    const entityConfig = await EntityConfig.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    if (!entityConfig) {
      return res.status(404).json({ message: "Entity Config not found" });
    }
    res.json(entityConfig);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteEntityConfig = async (req, res) => {
  try {
    const entityConfig = await EntityConfig.findByIdAndDelete(req.params.id);
    if (!entityConfig) {
      return res.status(404).json({ message: "Entity Config not found" });
    }
    res.json({ message: "Entity Config deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getEntityList,
  getEntityConfigById,
  getEntityConfigByName,
  createEntityConfig,
  updateEntityConfig,
  deleteEntityConfig,
};
