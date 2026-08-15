/* global jest */

jest.mock("react-native-mmkv", () => ({
  createMMKV: jest.fn((configuration = { id: "mmkv.default" }) => {
    const values = new Map();

    return {
      id: configuration.id,
      set: (key, value) => values.set(key, value),
      getString: (key) => {
        const value = values.get(key);
        return typeof value === "string" ? value : undefined;
      },
      getNumber: (key) => {
        const value = values.get(key);
        return typeof value === "number" ? value : undefined;
      },
      getBoolean: (key) => {
        const value = values.get(key);
        return typeof value === "boolean" ? value : undefined;
      },
      contains: (key) => values.has(key),
      getAllKeys: () => [...values.keys()],
      remove: (key) => values.delete(key),
      clearAll: () => values.clear(),
    };
  }),
}));
