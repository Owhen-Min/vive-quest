const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Route *.svg imports through react-native-svg-transformer so they resolve
// to React components (e.g. <Icon />) instead of plain image assets.
const { transformer, resolver } = config;
config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer"),
};
config.resolver = {
  ...resolver,
  // react-native-skia ships canvaskit.wasm for web; Metro needs to serve it
  // as a static asset rather than trying to parse it as JS.
  assetExts: [...resolver.assetExts.filter((ext) => ext !== "svg"), "wasm"],
  sourceExts: [...resolver.sourceExts, "svg"],
};

module.exports = withNativeWind(config, { input: "./src/global.css" });
