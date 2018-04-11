git subtree add --prefix=ext/smart-launcher        https://github.com/chb/smart-launcher.git                  master --squash
git subtree add --prefix=ext/generated-sample-data https://github.com/smart-on-fhir/generated-sample-data.git master --squash
git subtree add --prefix=ext/tag-uploader          https://github.com/smart-on-fhir/tag-uploader.git          master --squash
git subtree add --prefix=ext/xml-bundle-uploader   https://github.com/smart-on-fhir/xml-bundle-uploader.git   master --squash
git subtree add --prefix=ext/synthea               https://github.com/synthetichealth/synthea.git             master --squash
git subtree add --prefix=ext/fhir-viewer           https://github.com/smart-on-fhir/fhir-viewer.git           master --squash

git subtree pull -P ext/fhir-viewer                https://github.com/smart-on-fhir/fhir-viewer.git           master --squash
git subtree pull -P ext/generated-sample-data      https://github.com/smart-on-fhir/generated-sample-data.git master --squash
git subtree pull -P ext/xml-bundle-uploader        https://github.com/smart-on-fhir/xml-bundle-uploader.git   master --squash
git subtree pull -P ext/smart-launcher             https://github.com/chb/smart-launcher.git                  master --squash
git subtree pull -P ext/tag-uploader               https://github.com/smart-on-fhir/tag-uploader.git          master --squash
git subtree pull -P ext/synthea                    https://github.com/synthetichealth/synthea.git             master --squash

