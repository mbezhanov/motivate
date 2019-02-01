export const IMPORT_MODE_APPEND = 1;
export const IMPORT_MODE_OVERWRITE = 2;

export default {
  random: jest.fn(),
  remove: jest.fn(),
  importCsv: jest.fn(),
  exportCsv: jest.fn(),
};
