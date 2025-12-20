import { type SchemaTypeDefinition } from "sanity";
import { customerType } from "./customerTypes";
import { categoryType } from "./categoryTypes";
import { orderType } from "./orderTypes";
import { productType } from "./productTypes";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [customerType, categoryType, orderType, productType],
};
