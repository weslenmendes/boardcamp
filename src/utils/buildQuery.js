import SQLString from "sqlstring";

const buildQuery = (fields) => {
  let offset = "";
  let limit = "";
  let orderBy = "";

  if (fields) {
    const offsetParsed = fields.offset && parseInt(fields.offset);
    const limitParsed = fields.limit && parseInt(fields.limit);

    if (!isNaN(offsetParsed)) {
      offset = fields.offset ? `OFFSET ${SQLString.escape(offsetParsed)}` : "";
    }

    if (!isNaN(limitParsed)) {
      limit = fields.limit ? `LIMIT ${SQLString.escape(limitParsed)}` : "";
    }

    orderBy = fields.order
      ? `ORDER BY "${SQLString.escape(fields.order).slice(1, -1)}" ${
          fields.desc === "true" ? "DESC" : "ASC"
        }`
      : "";
  }

  return { offset, limit, orderBy };
};

export default buildQuery;
