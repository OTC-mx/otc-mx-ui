// Maps provider-factory

const option_factory_mappings = ({
  'http://localhost:8545': '0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B',
  'private': '0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B',
  'ropsten': '0xBcafbb9e481633B9A12Ae4DcFA6e35735542fCF2',
  'rinkeby': '0xafF7c772D52E153C4Dbef94f2B86102bB232F70d',
});

const silent_option_factory_mappings = ({
  'http://localhost:8545': '0x9561C133DD8580860B6b7E504bC5Aa500f0f06a7',
  'private': '0x9561C133DD8580860B6b7E504bC5Aa500f0f06a7',
  'rinkeby': '0x502eB5D30cd4714A67bF0Da78D348FD5D78E6a06',
});

const local_token_mappings = ({
  'a': '0x59d3631c86BbE35EF041872d502F218A39FBa150',
  'b': '0xD3aA556287Afe63102e5797BFDDd2A1E8DbB3eA5',
});

const ropsten_token_mappings = ({
  'a': '0x04156193A576e1D8B00d72A41e773EC08F32Da41',
  'b': '0x8539E31BE22DE64d51477Ce9930d7b1aCBFe2b47',
});

const rinkeby_token_mappings = ({
  'a': '0x86abBC560adBe54CCb2ddfDb58A4Cf11e930396B',
  'b': '0x900D84D4558b1ef6C2103b361F9aA14ac8Df227A',
});

module.exports.option_factory_mappings = option_factory_mappings;
module.exports.silent_option_factory_mappings = silent_option_factory_mappings;
module.exports.local_token_mappings = local_token_mappings;
