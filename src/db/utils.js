"use strict";

module.exports.searchQuery = function (filter) {
  const fields = Object.keys(filter);
  const hasAllFields =
    fields.includes("name") &&
    fields.includes("category") &&
    fields.includes("recommended");

  return {
    bool: {
      must: hasAllFields
        ? [{ match: { name: filter.name } }] // Prioritize "name" field if all three are present
        : fields.map((field) => {
            if (field === "name") {
              return { match: { [field]: filter[field] } };
            } else if (field === "recommended" || field === "category") {
              return { match: { [field]: filter[field] } };
            } else {
              return { term: { [field]: filter[field] } };
            }
          }),
    },
  };
};
