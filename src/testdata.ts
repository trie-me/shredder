import {ShredderConfig} from "./core/configuration/abstractions/shredder-config";
import {FieldAnalysis} from "./core/configuration/abstractions/field-analysis";

const defaultCurrentCleaner = ['currency'];
const fordPriceAnalysis: FieldAnalysis = {"fieldName": "price", isNumeric: true, "selector": "p.item-value.price-value", transforms: defaultCurrentCleaner};
const testdata = <ShredderConfig>{
  headless: true,
  "jobs": [
    {
      "uri": "https://www.ford.com/suvs/mach-e/?gnav=header-electrified-v32hp",
      "tasks": [{
        name: 'mach-e', analyses: [
          {"fieldName": "name", "selector": "span.fgx-brand-ds.display-three.ff-c.styled-txt"},
          fordPriceAnalysis
        ]
      }],
      "data": {"id": "111111"}
    },
    {
      "uri": "https://www.ford.com/commercial-trucks/e-transit/",
      "tasks": [{
        name: 'e-transit', analyses: [
          fordPriceAnalysis,
          {"fieldName": "name", "selector": "span.fgx-brand-ds.display-three.ff-c.styled-txt"}
        ]
      }],
      "data": {"id": "111112"},
    },
    {
      "uri": "https://www.audiusa.com/us/web/en/models/electric-models.html",
      "tasks": [
        {
          name: 'Q4 e-tron', analyses: [
            {"fieldName": "name", "selector": "h2.sc-pbxSd.jSSYpn", valueAtIndex: 0},
            {"fieldName": "price", isNumeric: true, "selector": "h4.sc-pbxSd.Ansnp", valueAtIndex: 0, transforms: defaultCurrentCleaner}
          ],
          data: {"id": "A1"},
        },
        {
          name: 'Q4 Sportback e-tron', analyses: [
            {"fieldName": "name", "selector": "h2.sc-pbxSd.jSSYpn", valueAtIndex: 1},
            {"fieldName": "price", isNumeric: true, "selector": "h4.sc-pbxSd.Ansnp", valueAtIndex: 1, transforms: defaultCurrentCleaner}
          ],
          data: {"id": "A2"},
        },
        {
          name: 'e-tron', analyses: [
            {"fieldName": "name", "selector": "h2.sc-pbxSd.jSSYpn", valueAtIndex: 2},
            {"fieldName": "price", isNumeric: true, "selector": "h4.sc-pbxSd.Ansnp", valueAtIndex: 2, transforms: defaultCurrentCleaner}
          ],
          data: {"id": "A3"},
        },
        {
          name: 'e-tron Sportback', analyses: [
            {"fieldName": "name", "selector": "h2.sc-pbxSd.jSSYpn", valueAtIndex: 3},
            {"fieldName": "price", isNumeric: true, "selector": "h4.sc-pbxSd.Ansnp", valueAtIndex: 3, transforms: defaultCurrentCleaner}
          ],
          data: {"id": "A4"},
        },
        {
          name: 'e-tron s', analyses: [
            {"fieldName": "name", "selector": "h2.sc-pbxSd.iUmVbC"},
            {"fieldName": "price", isNumeric: true, "selector": "h4.sc-pbxSd.hFMzqU", transforms: defaultCurrentCleaner}
          ],
          data: {"id": "A5"},
        },
        {
          name: 'e-tron S Sportback', analyses: [
            {"fieldName": "name", "selector": "h2.sc-pbxSd.jSSYpn", valueAtIndex: 4},
            {"fieldName": "price", isNumeric: true, "selector": "h4.sc-pbxSd.Ansnp", valueAtIndex: 4, transforms: defaultCurrentCleaner}
          ],
          data: {"id": "A6"},
        },
        {
          name: 'e-tron GT', analyses: [
            {"fieldName": "name", "selector": "h2.sc-pbxSd.jSSYpn", valueAtIndex: 5},
            {"fieldName": "price", isNumeric: true, "selector": "h4.sc-pbxSd.Ansnp", valueAtIndex: 5, transforms: defaultCurrentCleaner}
          ],
          data: {"id": "A7"},
        }]
    }
  ]
}
export const stringTestData = JSON.stringify(testdata);
