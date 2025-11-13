import type { Connection } from "./types";

/**
 * Flatten a GraphQL connection into an array of nodes.
 */
export const removeEdgesAndNodes = <T>(connection: Connection<T>): T[] => {
  return connection.edges.map((edge) => edge?.node);
};
