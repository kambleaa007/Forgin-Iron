import api, { route } from "@forge/api";
import ForgeUI, {
  MacroConfig,
  Image,
  Macro,
  Option,
  render,
  Select,
  useAction,
  useConfig,
  useProductContext, Fragment, Text }
from '@forge/ui';
import { countryData, MapBuilder } from 'countries-svg/dist/es6';

const App = () => {

  const config = useConfig();

  const addLabel = async () => {
    if (config && config.selectedCountry) {
      const context = useProductContext();
      const bodyData = [{
        prefix: "global",
        name: config.selectedCountry
      }];
      await api
        .asUser()
        .requestConfluence(route`/wiki/rest/api/content/${context.contentId}/label`, {
          method: 'POST',
          body: JSON.stringify(bodyData)
        });
    }
  };

  useAction(value => value, async () => await addLabel());

  const confluenceSectionWidth = 680;
  const mapAspectRatio = 0.7;
  const mapWidth = confluenceSectionWidth;
  const mapHeight = mapAspectRatio * mapWidth;
  let builder = new MapBuilder()
    .setWidth(confluenceSectionWidth)
    .setHeight(mapHeight)
    .setNormalColor('#f2f2f2')
    .setHighlightColor('#FF5630');
  if (config && config.selectedCountry) {
    builder = builder.addCountryToHighlight(config.selectedCountry);
  }
  const svg = builder.build();
  return (

    <Fragment>
      <Text>Forgin Iron still in 21st century</Text>
      <Text>Countries Map is here</Text>
      <Image
      src={`data:image/svg+xml;utf8,${encodeURIComponent(svg)}`}
      alt='header'
    />
    </Fragment>
  );
};

const Config = () => {
  const countryNames = countryData.getCountryNames();
  const options = countryNames.map(countryName => {
    return (
      <Option label={countryName} value={countryName} />
    );
  });
  return (
    <MacroConfig>
      <Select label="Countries" name="selectedCountry">
        {options}
      </Select>
    </MacroConfig>
  );
};

export const run = render(
  <Macro
    app={<App />}
  />
);
export const config = render(
  <Config />
);
