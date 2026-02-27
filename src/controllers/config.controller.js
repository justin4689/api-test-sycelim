const EntityConfig = require("../models/Config");

const getEntityList = async (req, res) => {
  try {
    const entities = await EntityConfig.find({}, { __v: 0 });
    const formattedEntities = entities.map((item) => ({
      id: item._id,
      label: item.label,
      entity: item.entity,
      formColumns: item.config?.form?.columns || 0
    }));

    res.json(formattedEntities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getEntityConfigById = async (req, res) => {
    try {
        const entityConfig = await EntityConfig.findById(req.params.id, { __v: 0 }) ;
        if (!entityConfig) {
            return res.status(404).json({ message: "Entity Config not found" });
        }
        res.json(entityConfig);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const updateEntityConfig = async (req, res) => {
    try {
        const entityConfig = await EntityConfig.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!entityConfig) {
            return res.status(404).json({ message: "Entity Config not found" });
        }
        res.json(entityConfig);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
  getEntityList,
  getEntityConfigById,
  updateEntityConfig
};
